/* eslint-disable @typescript-eslint/no-explicit-any */
import { App } from "@slack/bolt";
import { handleNewMessage } from "../pi/slackIntegration";
import {
    isStopCommand,
    isThreadStopped,
    markThreadStopped,
    mentionsBot,
    shouldIgnoreMessage,
} from "./rfc";
import { stopThread } from "../pi/pi";
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

const ALWAYS_ON_CHANNEL_ID = process.env.SLACK_CHANNEL_ID;
const getThreadTs = (message: any) => message.thread_ts ?? message.ts;

// Treat every human message in the configured channel as an implicit mention
app.message(async ({ message, context, body }) => {
    const slackMessage = message as any;
    if (slackMessage.channel !== ALWAYS_ON_CHANNEL_ID) return;
    if (!("user" in slackMessage)) return;
    if (slackMessage.bot_id || slackMessage.subtype === "bot_message") return;
    if (!slackMessage.text) return;
    // Avoid double-handling: app_mention below already covers messages that ping the bot
    if (mentionsBot(slackMessage.text, context.botUserId)) return;
    // RFC I: hidden "## " messages, group pings and "<>" messages without a direct mention
    if (shouldIgnoreMessage(slackMessage.text, false)) return;

    const threadTs = getThreadTs(slackMessage);
    if (await isThreadStopped(threadTs)) return;

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

// Also respond when the bot is @-mentioned in any channel it's in
app.event("app_mention", async ({ event, context, body }) => {
    const mentionEvent = event as any;
    if (mentionEvent.bot_id || mentionEvent.subtype === "bot_message") return;
    if (!mentionEvent.text) return;

    const threadTs = getThreadTs(mentionEvent);
    const directlyMentioned = mentionsBot(mentionEvent.text, context.botUserId);

    // RFC I: "@botname !stop" halts the thread immediately, even mid-run.
    if (isStopCommand(mentionEvent.text, context.botUserId)) {
        await markThreadStopped(threadTs);
        await stopThread(threadTs);
        return;
    }

    if (await isThreadStopped(threadTs)) return;
    // RFC I: never reply to hidden "## " messages, and treat a group ping as
    // not addressed to the bot even though Slack delivered the event.
    if (shouldIgnoreMessage(mentionEvent.text, directlyMentioned)) return;

    // Strip the leading "<@BOTID>" mention from the text
    const text = mentionEvent.text.replace(/^<@[^>]+>\s*/, "").trim();
    if (!text) return;

    await handleNewMessage(threadTs, text, app, {
        channel: mentionEvent.channel,
        recipientTeamId:
            context.teamId ||
            mentionEvent.team ||
            (body as any).team_id ||
            (body as any).team?.id, // ts-ignore
        recipientUserId: mentionEvent.user,
    });
});

export { app };
