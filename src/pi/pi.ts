import {
    AgentSession,
    AuthStorage,
    createAgentSession,
    ModelRegistry,
    SessionManager,
    DefaultResourceLoader,
    getAgentDir,
} from "@earendil-works/pi-coding-agent";
import { mkdir, readFile, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { subagent } from "../slack/subagents";
// Set up credential storage and model registry
const authStorage = AuthStorage.create();
const modelRegistry = ModelRegistry.create(authStorage);
const DEFAULT_PI_MODEL_PROVIDER = "openrouter";
const DEFAULT_PI_MODEL = "minimax/minimax-m2.7";
const DEFAULT_PI_MODEL_API = "openai-completions";
const DEFAULT_PI_USAGE = {
    input: 0,
    output: 0,
    cacheRead: 0,
    cacheWrite: 0,
    totalTokens: 0,
    cost: {
        input: 0,
        output: 0,
        cacheRead: 0,
        cacheWrite: 0,
        total: 0,
    },
};
export interface ThreadAgentSession {
    session: AgentSession;
    agent: subagent;
}

const SESSION_IDLE_MS = 3 * 60 * 1000;

interface CachedThreadSession {
    promise: Promise<ThreadAgentSession>;
    idleTimer?: ReturnType<typeof setTimeout>;
}

const sessions = new Map<string, CachedThreadSession>();
let resourceLoaderPromise: Promise<DefaultResourceLoader> | undefined;

function threadSessionDir(threadTs: string) {
    return `threads/${threadTs.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
}

function threadSubagentPath(threadTs: string) {
    return join(process.cwd(), threadSessionDir(threadTs), "subagent.json");
}

async function getThreadSubagent(threadTs: string) {
    const subagentPath = threadSubagentPath(threadTs);

    try {
        const saved = JSON.parse(await readFile(subagentPath, "utf-8"));
        if (typeof saved.name === "string" && saved.name.trim()) {
            return subagent.create(saved.name);
        }
    } catch (error) {
        const code = (error as NodeJS.ErrnoException).code;
        if (code !== "ENOENT") throw error;
    }

    const agent = await subagent.create();
    await mkdir(dirname(subagentPath), { recursive: true });
    await writeFile(
        subagentPath,
        `${JSON.stringify({ name: agent.name }, null, 2)}\n`,
    );
    return agent;
}

function getPiModelConfig() {
    const provider = process.env.PI_MODEL_API || DEFAULT_PI_MODEL_PROVIDER;
    const model = process.env.PI_MODEL || DEFAULT_PI_MODEL;
    const apiKey = process.env.PI_MODEL_KEY;
    const baseUrl = process.env.PI_MODEL_BASE_URL;

    if (apiKey) authStorage.setRuntimeApiKey(provider, apiKey);
    if (baseUrl) {
        modelRegistry.registerProvider(provider, {
            name: provider,
            baseUrl,
            apiKey: "$PI_MODEL_KEY",
            api: DEFAULT_PI_MODEL_API,
            streamSimple: createFetchOpenAIStream(
                provider,
                baseUrl,
                apiKey,
            ) as any,
            authHeader: true,
            models: [
                {
                    id: model,
                    name: model,
                    reasoning: false,
                    input: ["text"],
                    contextWindow: 128000,
                    maxTokens: 16384,
                    cost: {
                        input: 0,
                        output: 0,
                        cacheRead: 0,
                        cacheWrite: 0,
                    },
                },
            ],
        });
    }

    return { provider, model };
}

function createFetchOpenAIStream(
    provider: string,
    baseUrl: string,
    apiKey?: string,
) {
    return (model: any, context: any, options?: any) => {
        const stream = createPiEventStream();

        queueMicrotask(async () => {
            const message = {
                role: "assistant",
                content: [] as Array<
                    | { type: "text"; text: string }
                    | {
                          type: "toolCall";
                          id: string;
                          name: string;
                          arguments: Record<string, unknown>;
                      }
                >,
                api: DEFAULT_PI_MODEL_API,
                provider,
                model: model.id,
                usage: DEFAULT_PI_USAGE,
                stopReason: "stop",
                timestamp: Date.now(),
            };

            try {
                const textBlock = { type: "text" as const, text: "" };
                let textContentIndex: number | undefined;
                const toolCalls = new Map<
                    number,
                    {
                        contentIndex: number;
                        id: string;
                        name: string;
                        argumentsJson: string;
                    }
                >();
                stream.push({ type: "start", partial: { ...message } });

                const response = await fetch(`${baseUrl}/chat/completions`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${apiKey || process.env.PI_MODEL_KEY}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model: model.id,
                        stream: true,
                        stream_options: { include_usage: true },
                        messages: getOpenAIMessages(context),
                        tools: getOpenAITools(context),
                    }),
                    signal: options?.signal,
                });

                await options?.onResponse?.(
                    {
                        status: response.status,
                        headers: Object.fromEntries(response.headers.entries()),
                    },
                    model,
                );

                if (!response.ok) {
                    throw new Error(
                        `${response.status} ${await response.text()}`,
                    );
                }
                if (!response.body) throw new Error("Response body missing");

                for await (const event of readServerSentEvents(response.body)) {
                    if (event === "[DONE]") break;

                    const chunk = JSON.parse(event);
                    const delta = chunk.choices?.[0]?.delta?.content;
                    if (typeof delta === "string" && delta) {
                        if (textContentIndex === undefined) {
                            textContentIndex = message.content.length;
                            message.content.push(textBlock);
                            stream.push({
                                type: "text_start",
                                contentIndex: textContentIndex,
                                partial: { ...message },
                            });
                        }
                        textBlock.text += delta;
                        stream.push({
                            type: "text_delta",
                            contentIndex: textContentIndex,
                            delta,
                            partial: { ...message },
                        });
                    }

                    const deltaToolCalls =
                        chunk.choices?.[0]?.delta?.tool_calls;
                    if (Array.isArray(deltaToolCalls)) {
                        for (const deltaToolCall of deltaToolCalls) {
                            const index = deltaToolCall.index ?? 0;
                            let toolCall = toolCalls.get(index);
                            if (!toolCall) {
                                toolCall = {
                                    contentIndex: message.content.length,
                                    id:
                                        deltaToolCall.id ||
                                        `tool-${Date.now()}-${index}`,
                                    name: "",
                                    argumentsJson: "",
                                };
                                toolCalls.set(index, toolCall);
                                message.content.push({
                                    type: "toolCall",
                                    id: toolCall.id,
                                    name: "",
                                    arguments: {},
                                });
                                stream.push({
                                    type: "toolcall_start",
                                    contentIndex: toolCall.contentIndex,
                                    partial: { ...message },
                                });
                            }

                            if (deltaToolCall.id)
                                toolCall.id = deltaToolCall.id;
                            if (deltaToolCall.function?.name) {
                                toolCall.name = deltaToolCall.function.name;
                            }
                            if (deltaToolCall.function?.arguments) {
                                toolCall.argumentsJson +=
                                    deltaToolCall.function.arguments;
                                stream.push({
                                    type: "toolcall_delta",
                                    contentIndex: toolCall.contentIndex,
                                    delta: deltaToolCall.function.arguments,
                                    partial: { ...message },
                                });
                            }
                        }
                    }

                    if (chunk.usage) {
                        message.usage = {
                            ...DEFAULT_PI_USAGE,
                            input: chunk.usage.prompt_tokens || 0,
                            output: chunk.usage.completion_tokens || 0,
                            totalTokens: chunk.usage.total_tokens || 0,
                        };
                    }
                }

                if (textContentIndex !== undefined) {
                    stream.push({
                        type: "text_end",
                        contentIndex: textContentIndex,
                        content: textBlock.text,
                        partial: { ...message },
                    });
                }

                for (const toolCall of toolCalls.values()) {
                    const parsedToolCall = {
                        type: "toolCall" as const,
                        id: toolCall.id,
                        name: toolCall.name,
                        arguments: parseToolArguments(toolCall.argumentsJson),
                    };
                    message.content[toolCall.contentIndex] = parsedToolCall;
                    stream.push({
                        type: "toolcall_end",
                        contentIndex: toolCall.contentIndex,
                        toolCall: parsedToolCall,
                        partial: { ...message },
                    });
                }

                message.stopReason =
                    toolCalls.size > 0 ? "toolUse" : message.stopReason;
                stream.push({
                    type: "done",
                    reason: message.stopReason,
                    message,
                });
                stream.end(message);
            } catch (error) {
                const errorMessage = {
                    ...message,
                    content: [],
                    stopReason: "error",
                    errorMessage:
                        error instanceof Error ? error.message : String(error),
                };
                stream.push({
                    type: "error",
                    reason: "error",
                    error: errorMessage,
                });
                stream.end(errorMessage);
            }
        });

        return stream;
    };
}

function parseToolArguments(value: string) {
    if (!value.trim()) return {};
    try {
        return JSON.parse(value);
    } catch {
        return {};
    }
}

function getOpenAITools(context: any) {
    if (!Array.isArray(context.tools) || context.tools.length === 0) {
        return undefined;
    }

    return context.tools.map((tool: any) => ({
        type: "function",
        function: {
            name: tool.name,
            description: tool.description || "",
            parameters: tool.parameters,
        },
    }));
}

function getOpenAIMessages(context: any) {
    const messages = [];
    if (context.systemPrompt) {
        messages.push({ role: "system", content: context.systemPrompt });
    }

    for (const message of context.messages || []) {
        if (message.role === "tool") continue;
        messages.push({
            role: message.role,
            content: getTextContent(message.content),
        });
    }

    return messages;
}

function getTextContent(content: unknown) {
    if (typeof content === "string") return content;
    if (!Array.isArray(content)) return "";

    return content
        .map((part) => {
            if (part?.type === "text") return part.text;
            if (part?.type === "thinking") return part.thinking;
            if (part?.type === "toolResult") return part.text || "";
            return "";
        })
        .filter(Boolean)
        .join("\n");
}

async function* readServerSentEvents(body: ReadableStream<Uint8Array>) {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            let separator = buffer.indexOf("\n\n");

            while (separator !== -1) {
                const rawEvent = buffer.slice(0, separator);
                buffer = buffer.slice(separator + 2);
                const data = rawEvent
                    .split(/\r?\n/)
                    .filter((line) => line.startsWith("data:"))
                    .map((line) => line.slice(5).trimStart())
                    .join("\n");
                if (data) yield data;
                separator = buffer.indexOf("\n\n");
            }
        }
    } finally {
        reader.releaseLock();
    }
}

function createPiEventStream() {
    const queue: any[] = [];
    const waiting: Array<(value: IteratorResult<any>) => void> = [];
    let done = false;
    let result: any;
    let resolveResult: (value: any) => void;
    const resultPromise = new Promise((resolve) => {
        resolveResult = resolve;
    });

    return {
        push(event: any) {
            if (done) return;
            const waiter = waiting.shift();
            if (waiter) waiter({ value: event, done: false });
            else queue.push(event);
        },
        end(finalResult: any) {
            if (done) return;
            done = true;
            result = finalResult;
            resolveResult(result);
            while (waiting.length) {
                waiting.shift()?.({ value: undefined, done: true });
            }
        },
        result() {
            return resultPromise;
        },
        [Symbol.asyncIterator]() {
            return {
                next() {
                    const value = queue.shift();
                    if (value) return Promise.resolve({ value, done: false });
                    if (done)
                        return Promise.resolve({
                            value: undefined,
                            done: true,
                        });
                    return new Promise<IteratorResult<any>>((resolve) =>
                        waiting.push(resolve),
                    );
                },
            };
        },
    };
}

async function createOrResumeThreadSession(threadTs: string) {
    if (!process.env.E2B_API_KEY) {
        throw new Error("E2B_API_KEY is required for Slack bot sessions");
    }

    const manager = SessionManager.continueRecent(
        process.cwd(),
        threadSessionDir(threadTs),
    );

    const { session } = await createAgentSession({
        sessionManager: manager,
        authStorage,
        modelRegistry,
        resourceLoader: await getResourceLoader(),
    });
    await session.bindExtensions({ mode: "rpc" });

    return session;
}

async function getResourceLoader() {
    // todo macondoise
    if (resourceLoaderPromise) return resourceLoaderPromise;

    resourceLoaderPromise = (async () => {
        const extraInstructions = [
            "You must use Slack mrkdwn formatting for your responses.",
        ];

        const loader = new DefaultResourceLoader({
            cwd: process.cwd(),
            agentDir: getAgentDir(),
            additionalExtensionPaths: ["src/e2b/extension.ts"],
            appendSystemPromptOverride: (base) => [
                ...base,
                `## Extra Instructions\n${extraInstructions.map((instruction) => `- ${instruction}`).join("\n")}`,
            ],
        });

        await loader.reload();
        const extensionsResult = loader.getExtensions();
        extensionsResult.runtime.flagValues.set("e2b", true);
        extensionsResult.runtime.flagValues.set("e2b-sync", true);
        return loader;
    })();

    return resourceLoaderPromise;
}
export async function getSession(threadTs: string) {
    const existingSession = sessions.get(threadTs);
    if (existingSession) {
        clearThreadSessionIdleTimer(existingSession);
        return existingSession.promise;
    }

    const sessionPromise = Promise.all([
        createOrResumeThreadSession(threadTs),
        getThreadSubagent(threadTs),
    ]).then(([session, agent]) => {
        const modelConfig = getPiModelConfig();
        const model = modelRegistry.find(
            modelConfig.provider,
            modelConfig.model,
        );
        if (!model)
            throw new Error(
                `Model not found: ${modelConfig.provider}/${modelConfig.model}`,
            );
        session.setModel(model);

        return { session, agent };
    });

    const cachedSession: CachedThreadSession = { promise: sessionPromise };
    sessions.set(threadTs, cachedSession);
    sessionPromise.catch(() => sessions.delete(threadTs));

    return sessionPromise;
}

function clearThreadSessionIdleTimer(cachedSession: CachedThreadSession) {
    if (!cachedSession.idleTimer) return;
    clearTimeout(cachedSession.idleTimer);
    cachedSession.idleTimer = undefined;
}

export function scheduleThreadSessionSleep(threadTs: string) {
    const cachedSession = sessions.get(threadTs);
    if (!cachedSession) return;

    clearThreadSessionIdleTimer(cachedSession);
    cachedSession.idleTimer = setTimeout(() => {
        void sleepThreadSession(threadTs, cachedSession);
    }, SESSION_IDLE_MS);
    cachedSession.idleTimer.unref?.();
}

async function sleepThreadSession(
    threadTs: string,
    cachedSession: CachedThreadSession,
) {
    if (sessions.get(threadTs) !== cachedSession) return;

    sessions.delete(threadTs);
    clearThreadSessionIdleTimer(cachedSession);

    const { session } = await cachedSession.promise;
    await session.extensionRunner.emit({
        type: "session_shutdown",
        reason: "quit",
    });
    session.dispose();
}
