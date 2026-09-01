/**
 * RFC I - Guidelines for AI agents in Slack.
 *
 * See the README for the normative text. Everything here is the enforcement of
 * those rules, kept in one place so both Slack event handlers apply them the
 * same way.
 */
import { mkdir, readFile, writeFile } from "fs/promises";
import { dirname, join } from "path";

/** Rule 1: messages starting with "## " are invisible to the agent. */
export function isHiddenMessage(text: string) {
    return /^##(\s|$)/.test(text.trimStart());
}

/** Rule 4: messages starting with "<>" are only handled on a direct mention. */
export function isQuietMessage(text: string) {
    return text.trimStart().startsWith("<>");
}

/**
 * Rule 3: a ping/user group mention is not a mention of the bot. Slack encodes
 * those as <!subteam^ID> and the broadcast pings as <!here>, <!channel> and
 * <!everyone>.
 */
export function mentionsGroup(text: string) {
    return /<!(subteam\^[^>|]+|here|channel|everyone)(\|[^>]*)?>/.test(text);
}

export function mentionsBot(text: string, botUserId?: string) {
    if (!botUserId) return false;
    return new RegExp(`<@${botUserId}(\\|[^>]*)?>`).test(text);
}

/** Rule 2: "@botname !stop" halts the thread. */
export function isStopCommand(text: string, botUserId?: string) {
    if (!botUserId) return false;
    return new RegExp(`<@${botUserId}(\\|[^>]*)?>\\s*!stop\\b`, "i").test(text);
}

// Stopped threads are remembered on disk next to the thread's session so a
// restart cannot resurrect an agent the user told to stop.
const stoppedThreads = new Set<string>();
const knownUnstopped = new Set<string>();

function stoppedFlagPath(threadTs: string) {
    return join(
        process.cwd(),
        "threads",
        threadTs.replace(/[^a-zA-Z0-9._-]/g, "_"),
        "stopped",
    );
}

export async function markThreadStopped(threadTs: string) {
    stoppedThreads.add(threadTs);
    knownUnstopped.delete(threadTs);

    const path = stoppedFlagPath(threadTs);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, `${new Date().toISOString()}\n`);
}

export async function isThreadStopped(threadTs: string) {
    if (stoppedThreads.has(threadTs)) return true;
    if (knownUnstopped.has(threadTs)) return false;

    try {
        await readFile(stoppedFlagPath(threadTs), "utf-8");
        stoppedThreads.add(threadTs);
        return true;
    } catch (error) {
        const code = (error as NodeJS.ErrnoException).code;
        if (code !== "ENOENT") throw error;
        knownUnstopped.add(threadTs);
        return false;
    }
}

/**
 * Decide whether a Slack message reaches the agent at all.
 *
 * `directlyMentioned` means the bot's own user id appears in the raw text, not
 * that Slack delivered the event.
 */
export function shouldIgnoreMessage(
    rawText: string,
    directlyMentioned: boolean,
) {
    if (isHiddenMessage(rawText)) return true;
    if (!directlyMentioned && mentionsGroup(rawText)) return true;
    if (!directlyMentioned && isQuietMessage(rawText)) return true;
    return false;
}
