import { App } from "@slack/bolt"
import { session } from "../pi/pi"
/**
 * This sample Slack application uses Socket Mode.
 * For the companion getting started setup guide, see:
 * https://docs.slack.dev/tools/bolt-js/getting-started/
 */

// Initializes your app with your bot token and app token
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN,
})

function sendMdMessageInThread(originalMessageTs: string, markdownMessage: string, app: App) {
    app.client.chat.postMessage({
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
        thread_ts: originalMessageTs.toString(),
    })
}

// Listens to incoming messages that contain "hello"
app.message(async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    if (!("user" in message)) return

    let threadts = message.ts
    await sendMdMessageInThread(
        threadts,
        `fuck you
    # fuck you
    ## fuck you`,
        app,
    )

    if (!message.text) return

    await session.prompt(message.text)

    let piMessage = await session.messages.at(-1)
    if (!piMessage || !("content" in piMessage) || !piMessage.content) return

    const text = typeof piMessage.content === "string"
        ? piMessage.content
        : (piMessage.content.find((c: any) => c.type === "text") as any)?.text ?? ""

    sendMdMessageInThread(threadts, text, app)
})

export { app }
