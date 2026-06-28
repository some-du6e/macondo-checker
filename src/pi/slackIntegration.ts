import { getSession } from "./pi"
import type { App } from "@slack/bolt"

async function sendMdMessageInThread(threadTs: string, markdownMessage: string, app: App) {
    await app.client.chat.postMessage({
        channel: process.env.SLACK_CHANNEL_ID || "C0BDBR2MEPM",
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

function getTextContent(message: any) {
    if (typeof message.content === "string") return message.content
    if (!Array.isArray(message.content)) return ""

    return message.content
        .filter((content: any) => content.type === "text")
        .map((content: any) => content.text)
        .join("\n")
}

export async function handleNewMessage(threadTs: string, message: string, app: App) {
    if (message.trim().startsWith("##")) return // ignore it like the gork(ie) bots

    let session = await getSession(threadTs)

    await session.prompt(message)
    
    let piMessage = session.state.messages
        .slice()
        .reverse()
        .find((message: any) => message.role === "assistant")
    if (!piMessage) return

    const text = getTextContent(piMessage)
    if (!text) return

    await sendMdMessageInThread(threadTs, text, app)
}
