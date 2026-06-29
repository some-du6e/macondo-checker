import { App } from "@slack/bolt";
import { handleNewMessage } from "../pi/slackIntegration";
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
});

export function sendMdMessageInThread(
    originalMessageTs: string,
    markdownMessage: string,
    app: App,
) {
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
    });
}

// Listens to incoming messages that contain "hello"
app.message(async ({ message, context, body }) => {
    // say() sends a message to the channel where the event was triggered
    const slackMessage = message as any;
    if (!("user" in slackMessage)) return;
    if (slackMessage.bot_id || slackMessage.subtype === "bot_message") return;
    if (!slackMessage.text) return;

    const threadTs = slackMessage.thread_ts || slackMessage.ts;
    await handleNewMessage(threadTs, slackMessage.text, app, {
        channel: slackMessage.channel,
        recipientTeamId:
            context.teamId ||
            slackMessage.team ||
            (body as any).team_id ||
            (body as any).team?.id,
        recipientUserId: slackMessage.user,
    });
});

export { app };
