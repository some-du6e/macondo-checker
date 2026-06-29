import {
    AgentSession,
    AuthStorage,
    createAgentSession,
    ModelRegistry,
    SessionManager,
    DefaultResourceLoader,
    getAgentDir,
} from "@earendil-works/pi-coding-agent";
import { createModels } from "@earendil-works/pi-ai";
import { mkdir, readFile, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { subagent } from "../slack/subagents";
// Set up credential storage and model registry
const authStorage = AuthStorage.create();
const modelRegistry = ModelRegistry.create(authStorage);
const models = createModels({});
export interface ThreadAgentSession {
    session: AgentSession;
    agent: subagent;
}

const sessions = new Map<string, Promise<ThreadAgentSession>>();
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
    let manager = SessionManager.continueRecent(
        process.cwd(),
        threadSessionDir(threadTs),
    );

    const { session } = await createAgentSession({
        sessionManager: manager,
        authStorage,
        modelRegistry,
        resourceLoader: await getResourceLoader(),
    });

    return session;
}

async function getResourceLoader() {
    // todo macondoise
    if (resourceLoaderPromise) return resourceLoaderPromise;

    resourceLoaderPromise = (async () => {
        let extraInstructions = [
            "You must use Slack mrkdwn formatting for your responses.",
        ];

        const loader = new DefaultResourceLoader({
            cwd: process.cwd(),
            agentDir: getAgentDir(),
            appendSystemPromptOverride: (base) => [
                ...base,
                `## Extra Instructions\n${extraInstructions.map((instruction) => `- ${instruction}`).join("\n")}`,
            ],
        });

        await loader.reload();
        return loader;
    })();

    return resourceLoaderPromise;
}
export async function getSession(threadTs: string) {
    let existingSession = sessions.get(threadTs);
    if (existingSession) return existingSession;

    const sessionPromise = Promise.all([
        createOrResumeThreadSession(threadTs),
        getThreadSubagent(threadTs),
    ]).then(([session, agent]) => {
        const model = modelRegistry.find("openrouter", "minimax/minimax-m2.7");
        if (!model) throw new Error("Model not found");
        session.setModel(model);

        return { session, agent };
    });

    sessions.set(threadTs, sessionPromise);
    sessionPromise.catch(() => sessions.delete(threadTs));

    return sessionPromise;
}
