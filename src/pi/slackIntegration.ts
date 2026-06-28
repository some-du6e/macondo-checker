import { getSession } from "./pi"
import type { App } from "@slack/bolt"
import type { AgentSession, AgentSessionEvent } from "@earendil-works/pi-coding-agent"

const SLACK_CHANNEL_ID = process.env.SLACK_CHANNEL_ID || "C0BDBR2MEPM"

export interface SlackReplyTarget {
    channel?: string
    recipientTeamId?: string
    recipientUserId?: string
}

function getSlackChannel(target: SlackReplyTarget) {
    return target.channel || SLACK_CHANNEL_ID
}

async function sendMdMessageInThread(threadTs: string, markdownMessage: string, app: App, target: SlackReplyTarget) {
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
    })
}

async function streamPromptToSlack(
    threadTs: string,
    session: AgentSession,
    prompt: () => Promise<void>,
    app: App,
    target: SlackReplyTarget,
) {
    const streamer = app.client.chatStream({
        channel: getSlackChannel(target),
        thread_ts: threadTs.toString(),
        recipient_team_id: target.recipientTeamId,
        recipient_user_id: target.recipientUserId,
        buffer_size: 128,
    })

    let sawTextDelta = false
    let appendPromise = Promise.resolve()

    const unsubscribe = session.subscribe((event: AgentSessionEvent) => {
        if (event.type !== "message_update" || event.assistantMessageEvent.type !== "text_delta") return

        const delta = event.assistantMessageEvent.delta
        if (!delta) return

        sawTextDelta = true
        appendPromise = appendPromise.then(async () => {
            await streamer.append({ markdown_text: delta })
        })
    })

    let promptError: unknown

    try {
        try {
            await prompt()
        } catch (error) {
            promptError = error
        }

        await appendPromise

        if (sawTextDelta) {
            await streamer.stop()
        }

        if (promptError) throw promptError
    } finally {
        unsubscribe()
    }

    return sawTextDelta
}

function getTextContent(message: any) {
    if (typeof message.content === "string") return message.content
    if (!Array.isArray(message.content)) return ""

    return message.content
        .filter((content: any) => content.type === "text")
        .map((content: any) => content.text)
        .join("\n")
}

export async function handleNewMessage(threadTs: string, message: string, app: App, target: SlackReplyTarget = {}) {
    if (message.trim().startsWith("##")) return // ignore it like the gork(ie) bots

    let session = await getSession(threadTs)

    const streamed = await streamPromptToSlack(threadTs, session, () => session.prompt(message), app, target)

    let piMessage = session.state.messages
        .slice()
        .reverse()
        .find((message: any) => message.role === "assistant")
    if (!piMessage) return

    const text = getTextContent(piMessage)
    if (!text) return

    if (!streamed) await sendMdMessageInThread(threadTs, text, app, target)
}
