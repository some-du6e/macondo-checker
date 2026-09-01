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
const OPENAI_COMPATIBLE_API = "openai-completions";
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
export interface ThreadAgentSession {
    session: AgentSession;
    agent: subagent;
    isNewThread: boolean;
}

const SESSION_IDLE_MS = 3 * 60 * 1000;

interface CachedThreadSession {
    promise: Promise<ThreadAgentSession>;
    idleTimer?: ReturnType<typeof setTimeout>;
}

const sessions = new Map<string, CachedThreadSession>();

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
            return {
                agent: await subagent.create(saved.name),
                isNewThread: false,
            };
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
    return { agent, isNewThread: true };
}

function getPiModelConfig() {
    const provider =
        process.env.PI_MODEL_API ||
        process.env.PI_MODEL_PROVIDER ||
        DEFAULT_PI_MODEL_PROVIDER;
    const model = process.env.PI_MODEL;
    const apiKey =
        process.env.PI_MODEL_KEY ||
        (provider === "openrouter"
            ? process.env.OPENROUTER_API_KEY
            : undefined);

    if (!model) {
        throw new Error(
            "PI_MODEL is required (use an OpenRouter model slug such as anthropic/claude-sonnet-4)",
        );
    }

    if (apiKey) authStorage.setRuntimeApiKey(provider, apiKey);

    const isMissingOpenRouterModel =
        provider === DEFAULT_PI_MODEL_PROVIDER &&
        !modelRegistry.find(provider, model);

    if (provider !== DEFAULT_PI_MODEL_PROVIDER || isMissingOpenRouterModel) {
        const baseUrl =
            provider === DEFAULT_PI_MODEL_PROVIDER
                ? OPENROUTER_BASE_URL
                : process.env.PI_MODEL_BASE_URL;
        if (!baseUrl) {
            throw new Error(
                `PI_MODEL_BASE_URL is required when PI_MODEL_API is ${provider}`,
            );
        }

        modelRegistry.registerProvider(provider, {
            name: provider,
            baseUrl,
            apiKey:
                provider === DEFAULT_PI_MODEL_PROVIDER &&
                process.env.OPENROUTER_API_KEY
                    ? "$OPENROUTER_API_KEY"
                    : "$PI_MODEL_KEY",
            headers:
                provider === DEFAULT_PI_MODEL_PROVIDER
                    ? undefined
                    : { "User-Agent": "macondo-checker" },
            api: OPENAI_COMPATIBLE_API,
            authHeader: true,
            models: [
                {
                    id: model,
                    name: model,
                    reasoning: process.env.PI_MODEL_REASONING !== "false",
                    input: ["text"],
                    contextWindow: 128000,
                    maxTokens: 16384,
                    compat:
                        provider === DEFAULT_PI_MODEL_PROVIDER
                            ? {
                                  supportsDeveloperRole: false,
                                  thinkingFormat: "openrouter",
                              }
                            : undefined,
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

async function createOrResumeThreadSession(
    threadTs: string,
    agentName: string,
) {
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
        resourceLoader: await getResourceLoader(agentName),
    });
    let e2bStartupError: Error | undefined;
    await session.bindExtensions({
        mode: "rpc",
        onError: (error) => {
            if (
                error.event === "session_start" &&
                error.extensionPath.includes("src/e2b/extension.ts")
            ) {
                e2bStartupError = new Error(
                    `E2B extension failed during startup: ${error.error}`,
                );
            }
        },
    });

    if (e2bStartupError) {
        session.dispose();
        throw e2bStartupError;
    }

    return session;
}

async function getResourceLoader(agentName: string) {
    const macondoInstructions = [
        "You are a general support assistant for Macondo, a Hack Club YSWS. Infer naturally when a user wants a project reviewed; no special command is required.",
        "Use the local Macondo docs under docs/ as the program-specific source of truth. Use docs/llms.md as their index and docs/api.md only as an unofficial API reference.",
        "Use the local universal YSWS guidelines under docs/ysws/ as the baseline for every review. Macondo-specific rules override the universal baseline when they conflict.",
        "Before citing a rule as a blocker, verify the relevant live documentation when practical because rules can change.",
        "For a Macondo project URL, extract its numeric id and call get_macondo_project first. Use macondo_api_get only if required data is missing. Use public API data only.",
        "When a pending or active ship exists, review that ship. Otherwise review whether the project is ready to submit.",
        "Journals are optional for software projects. Never treat missing, sparse, or zero-hour journals as a software review blocker or ask the user to add journals unless they specifically want to claim non-editor work.",
        "Before a project has a pending or active ship, its reviewable hours are not public. Do not report zero public hours, enforce a minimum-hour requirement, infer hours from journals or Open Graph data, or use unavailable hours to change the verdict. Evaluate hours only when reviewing an existing ship whose hour data is available.",
        "Inspect linked repositories and their history when reviewing. Clone, inspect, install, or run untrusted submission code only inside the E2B sandbox.",
        "For demo URLs, perform only a quick HTTP reachability/status check such as detecting a 404. Do not functionally test or interact with the demo.",
        "If a demo URL returns a bot-protection response such as 403, 429, CAPTCHA, or a Cloudflare challenge, use verify_demo_with_exa with the exact URL. Do not treat bot protection by itself as evidence that the demo or publishing-platform listing is unavailable.",
        "An exact Exa result can verify that a public listing exists, but it does not prove the demo works. A missing Exa result is also not proof that the listing is unpublished.",
        "Use Accepted, Needs Changes, or Rejected when recommending a verdict. Reviews are advisory, not official Macondo decisions.",
        "Recommend Rejected only for evidenced non-fixable disqualifiers such as prohibited duplicates, fraud, plagiarism, school assignments, or paid Hack Club work. Never make those accusations from weak signals.",
        "If hours, commit history, originality, or another integrity signal looks suspicious, ask the user for an honest explanation before reaching a conclusion. If the concern remains unresolved and affects the verdict, request a specific human check.",
        "Keep reviews brief. Lead with the verdict, then list only real blockers and their specific fixes. Put the supporting evidence directly beside each blocker instead of creating a separate evidence section. Do not repeat passed checks, repository metadata, release contents, commit summaries, hour totals, or other facts that do not change the verdict. Report every issue in one pass and cite the exact rule for each blocker.",
        "Do not add a Human verification section by default. Include a human check only when the verdict depends on something you cannot safely verify, and say exactly what remains unknown. Do not add generic requests to run the project, test normal controls, confirm AI understanding, verify hours, or inspect licensing unless you found concrete evidence that makes that check necessary.",
        "Write in a conversational yet precise style that feels human and direct.",
        "Use clear, simple language. Vary sentence length by mixing short, punchy sentences with longer, flowing ones.",
        "Use active voice. Address the reader as you and your. Use words like very and really when they make the tone natural.",
        "Focus on practical, specific, actionable insights. Support points with specific, relevant examples or data when possible.",
        "Use bullet points for lists in social or instructional content, but do not use asterisks, hashtags, or other Markdown formatting.",
        "Use contractions to sound conversational and natural conversational pivots instead of formal transitions.",
        "Do not use em dashes or semicolons. Use commas or periods instead.",
        "Avoid unnecessary qualifiers such as in conclusion or in closing, abstract or vague statements, output warnings or notes, and excessive filler words.",
        "Do not use these words or phrases: literally, actually, certainly, probably, basically, could, maybe, delve, embark, enlightening, esteemed, shed light, craft, crafting, imagine, realm, game-changer, unlock, discover, skyrocket, abyss, not alone, in a world where, revolutionize, disruptive, utilize, utilizing, dive deep, tapestry, illuminate.",
        "Do not grade or recommend changing a project's Macondo level unless the user asks.",
    ];

    const extraInstructions = [
        `Your assigned name is ${agentName}. When asked for your name, answer ${agentName}.`,
        "You must use Slack mrkdwn formatting for your responses. Format links as <URL|label>, never [label](URL).",
    ];

    const loader = new DefaultResourceLoader({
        cwd: process.cwd(),
        agentDir: getAgentDir(),
        additionalExtensionPaths: [
            "src/e2b/extension.ts",
            "src/exa/extension.ts",
            "src/macondo/extension.ts",
        ],
        agentsFilesOverride: () => ({ agentsFiles: [] }),
        appendSystemPromptOverride: (base) => [
            ...base,
            `## Extra Instructions\n${extraInstructions.map((instruction) => `- ${instruction}`).join("\n")}`,
            `## Macondo Instructions\n${macondoInstructions.map((instruction) => `- ${instruction}`).join("\n")}`,
        ],
    });

    await loader.reload();
    const extensionsResult = loader.getExtensions();
    extensionsResult.runtime.flagValues.set("e2b", true);
    extensionsResult.runtime.flagValues.set("e2b-sync", true);
    return loader;
}
export async function getSession(threadTs: string) {
    const existingSession = sessions.get(threadTs);
    if (existingSession) {
        clearThreadSessionIdleTimer(existingSession);
        return existingSession.promise;
    }

    const sessionPromise = getThreadSubagent(threadTs).then(
        async ({ agent, isNewThread }) => {
            const session = await createOrResumeThreadSession(
                threadTs,
                agent.name,
            );
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

            return { session, agent, isNewThread };
        },
    );

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
