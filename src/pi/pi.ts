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
        const model = modelRegistry.find("openrouter", "minimax/minimax-m2.7");
        if (!model) throw new Error("Model not found");
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
