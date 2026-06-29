/* eslint-disable @typescript-eslint/no-explicit-any */
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
            (body as any).team?.id, // ts-ignore
        recipientUserId: slackMessage.user,
    });
});

export { app };
