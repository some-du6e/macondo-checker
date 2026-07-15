/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSession, scheduleThreadSessionSleep } from "./pi";
import type { App } from "@slack/bolt";
import type {
    AgentSession,
    AgentSessionEvent,
} from "@earendil-works/pi-coding-agent";
import { subagent } from "../slack/subagents";

const SLACK_CHANNEL_ID = process.env.SLACK_CHANNEL_ID || "C0BDBR2MEPM";
const SLACK_TASK_TEXT_LIMIT = 256;
const routedThreads = new Set<string>();

export interface SlackReplyTarget {
    channel?: string;
    recipientTeamId?: string;
    recipientUserId?: string;
}

function getSlackChannel(target: SlackReplyTarget) {
    return target.channel || SLACK_CHANNEL_ID;
}

async function sendMdMessageInThread(
    threadTs: string,
    markdownMessage: string,
    app: App,
    target: SlackReplyTarget,
    agent?: subagent,
) {
    await app.client.chat.postMessage({
        channel: getSlackChannel(target),
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: markdownMessage,
                },
            },
        ],
        thread_ts: threadTs.toString(),
        icon_url: agent?.pfp,
        username: agent?.name,
    });
}

async function sendSubagentRoutingMessage(
    threadTs: string,
    app: App,
    target: SlackReplyTarget,
    agent: subagent,
) {
    if (routedThreads.has(threadTs)) return;
    routedThreads.add(threadTs);

    await sendMdMessageInThread(
        threadTs,
        `I'm going to route you to *${agent.name}*.`,
        app,
        target,
    );
}

type SlackTaskStatus = "pending" | "in_progress" | "complete" | "error";

interface SlackTaskUpdateChunk {
    type: "task_update";
    id: string;
    title: string;
    status: SlackTaskStatus;
    details?: string;
    output?: string;
}

function truncateTaskText(text: string) {
    const normalized = text
        .split("\n")
        .map((line) => line.replace(/[ \t]+/g, " ").trim())
        .filter(Boolean)
        .join("\n");
    if (normalized.length <= SLACK_TASK_TEXT_LIMIT) return normalized;
    return `${normalized.slice(0, SLACK_TASK_TEXT_LIMIT - 3)}...`;
}

function stringifyForSlack(value: unknown) {
    if (typeof value === "string") return value;
    if (
        value &&
        typeof value === "object" &&
        "content" in value &&
        Array.isArray(value.content)
    ) {
        const text = value.content
            .filter((content: any) => content.type === "text")
            .map((content: any) => content.text)
            .join(" ")
            .trim();
        if (text) return text;
    }

    try {
        return JSON.stringify(value);
    } catch {
        return String(value);
    }
}

function formatToolInput(toolName: string, args: unknown) {
    if (
        args &&
        typeof args === "object" &&
        "command" in args &&
        typeof args.command === "string"
    ) {
        return `Command\n${args.command}`;
    }

    return `${toolName} input\n${stringifyForSlack(args)}`;
}

function formatToolOutput(toolName: string, value: unknown) {
    const output = stringifyForSlack(value);
    return `${toolName} output\n${output}`;
}

function getThinkingPreview(thinking: string) {
    return truncateTaskText(thinking);
}

async function streamPromptToSlack(
    threadTs: string,
    session: AgentSession,
    prompt: () => Promise<void>,
    app: App,
    target: SlackReplyTarget,
    agent: subagent,
) {
    const streamer = app.client.chatStream({
        channel: getSlackChannel(target),
        thread_ts: threadTs.toString(),
        recipient_team_id: target.recipientTeamId,
        recipient_user_id: target.recipientUserId,
        buffer_size: 128,
        task_display_mode: "plan",
        icon_url: agent.pfp,
        username: agent.name,
    });

    let sawTextDelta = false;
    let usedStream = false;
    let appendPromise = Promise.resolve();
    let turnIndex = 0;
    const thinkingBuffers = new Map<string, string>();
    const thinkingTaskIds = new Map<string, string>();
    const completedTaskIds = new Set<string>();
    let claimedInitialThinkingTask = false;
    let resolvedInitialThinkingTask = false;

    const appendToStream = (args: Parameters<typeof streamer.append>[0]) => {
        usedStream = true;
        appendPromise = appendPromise.then(async () => {
            await streamer.append(args);
        });
    };

    const appendTaskUpdate = (chunk: SlackTaskUpdateChunk) => {
        if (completedTaskIds.has(chunk.id)) return;
        if (chunk.status === "complete" || chunk.status === "error")
            completedTaskIds.add(chunk.id);

        appendToStream({
            chunks: [
                {
                    ...chunk,
                    title: truncateTaskText(chunk.title),
                    details: chunk.details
                        ? truncateTaskText(chunk.details)
                        : undefined,
                    output: chunk.output
                        ? truncateTaskText(chunk.output)
                        : undefined,
                },
            ],
        });
    };

    const completeThinkingTask = (id: string) => {
        const thinking = thinkingBuffers.get(id) || "";
        if (!thinking) return;

        appendTaskUpdate({
            type: "task_update",
            id,
            title: "Reasoning",
            status: "complete",
            output: getThinkingPreview(thinking),
        });
    };

    const unsubscribe = session.subscribe((event: AgentSessionEvent) => {
        if (event.type === "turn_start") {
            turnIndex += 1;
            return;
        }

        if (event.type === "tool_execution_start") {
            appendTaskUpdate({
                type: "task_update",
                id: `execution-${event.toolCallId}`,
                title: `Run ${event.toolName}`,
                status: "in_progress",
                details: "Executing tool.",
            });
            return;
        }

        if (event.type === "tool_execution_update") {
            return;
        }

        if (event.type === "tool_execution_end") {
            appendTaskUpdate({
                type: "task_update",
                id: `execution-${event.toolCallId}`,
                title: `Finished ${event.toolName}`,
                status: event.isError ? "error" : "complete",
                output: formatToolOutput(event.toolName, event.result),
            });
            return;
        }

        if (event.type !== "message_update") return;

        if (event.assistantMessageEvent.type === "thinking_start") {
            const key = `${turnIndex}-${event.assistantMessageEvent.contentIndex}`;
            const id = claimedInitialThinkingTask
                ? `thinking-${key}`
                : "thinking-current";
            claimedInitialThinkingTask = true;
            thinkingTaskIds.set(key, id);
            thinkingBuffers.set(id, "");
            return;
        }

        if (event.assistantMessageEvent.type === "thinking_delta") {
            const key = `${turnIndex}-${event.assistantMessageEvent.contentIndex}`;
            const id = thinkingTaskIds.get(key) || `thinking-${key}`;
            thinkingBuffers.set(
                id,
                `${thinkingBuffers.get(id) || ""}${event.assistantMessageEvent.delta}`,
            );
            return;
        }

        if (event.assistantMessageEvent.type === "thinking_end") {
            const key = `${turnIndex}-${event.assistantMessageEvent.contentIndex}`;
            const id = thinkingTaskIds.get(key) || `thinking-${key}`;
            const thinking =
                event.assistantMessageEvent.content ||
                thinkingBuffers.get(id) ||
                "";
            thinkingBuffers.set(id, thinking);
            completeThinkingTask(id);
            if (id === "thinking-current") resolvedInitialThinkingTask = true;
            thinkingTaskIds.delete(key);
            thinkingBuffers.delete(id);
            return;
        }

        if (event.assistantMessageEvent.type === "toolcall_start") {
            appendTaskUpdate({
                type: "task_update",
                id: `input-${turnIndex}-${event.assistantMessageEvent.contentIndex}`,
                title: "Tool input",
                status: "in_progress",
                details: "Preparing tool arguments.",
            });
            return;
        }

        if (event.assistantMessageEvent.type === "toolcall_end") {
            appendTaskUpdate({
                type: "task_update",
                id: `input-${turnIndex}-${event.assistantMessageEvent.contentIndex}`,
                title: `${event.assistantMessageEvent.toolCall.name} input`,
                status: "complete",
                details: formatToolInput(
                    event.assistantMessageEvent.toolCall.name,
                    event.assistantMessageEvent.toolCall.arguments,
                ),
            });
            return;
        }

        if (event.assistantMessageEvent.type !== "text_delta") return;

        const delta = event.assistantMessageEvent.delta;
        if (!delta) return;

        sawTextDelta = true;
        appendToStream({ markdown_text: delta });
    });

    let promptError: unknown;

    try {
        try {
            appendTaskUpdate({
                type: "task_update",
                id: "thinking-current",
                title: "Reasoning",
                status: "in_progress",
                details: "Thinking through the request.",
            });
            await prompt();
        } catch (error) {
            promptError = error;
        }

        await appendPromise;

        if (usedStream && !resolvedInitialThinkingTask) {
            appendTaskUpdate({
                type: "task_update",
                id: "thinking-current",
                title: "Reasoning",
                status: promptError ? "error" : "complete",
                details: promptError
                    ? "The run ended before reasoning finished."
                    : "Reasoning stream finished.",
            });
            await appendPromise;
        }

        if (usedStream) {
            await streamer.stop();
        }

        if (promptError) throw promptError;
    } finally {
        unsubscribe();
    }

    return sawTextDelta;
}

function getTextContent(message: any) {
    if (typeof message.content === "string") return message.content;
    if (!Array.isArray(message.content)) return "";

    return message.content
        .filter((content: any) => content.type === "text")
        .map((content: any) => content.text)
        .join("\n");
}

export async function handleNewMessage(
    threadTs: string,
    message: string,
    app: App,
    target: SlackReplyTarget = {},
) {
    if (message.trim().startsWith("##")) return; // ignore it like the gork(ie) bots

    const { session, agent } = await getSession(threadTs);
    await sendSubagentRoutingMessage(threadTs, app, target, agent);

    try {
        const streamed = await streamPromptToSlack(
            threadTs,
            session,
            () => session.prompt(message),
            app,
            target,
            agent,
        );

        const piMessage = session.state.messages
            .slice()
            .reverse()
            .find((message: any) => message.role === "assistant");
        if (!piMessage) return;

        const text = getTextContent(piMessage);
        if (!text) return;

        if (!streamed)
            await sendMdMessageInThread(threadTs, text, app, target, agent);
    } finally {
        scheduleThreadSessionSleep(threadTs);
    }
}
