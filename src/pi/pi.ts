import {
    AgentSession,
    AuthStorage,
    createAgentSession,
    ModelRegistry,
    SessionManager,
    DefaultResourceLoader,
    getAgentDir,
} from "@earendil-works/pi-coding-agent"
import { createModels } from "@earendil-works/pi-ai"
// Set up credential storage and model registry
const authStorage = AuthStorage.create()
const modelRegistry = ModelRegistry.create(authStorage)
const models = createModels({})
const sessions = new Map<string, Promise<AgentSession>>()
let resourceLoaderPromise: Promise<DefaultResourceLoader> | undefined

function threadSessionDir(threadTs: string) {
    return `threads/${threadTs.replace(/[^a-zA-Z0-9._-]/g, "_")}`
}

async function createOrResumeThreadSession(threadTs: string) {
    let manager = SessionManager.continueRecent(process.cwd(), threadSessionDir(threadTs))

    const { session } = await createAgentSession({
        sessionManager: manager,
        authStorage,
        modelRegistry,
        resourceLoader: await getResourceLoader(),
    })

    return session
}

async function getResourceLoader() {
    // todo macondoise
    if (resourceLoaderPromise) return resourceLoaderPromise

    resourceLoaderPromise = (async () => {
        let extraInstructions = [
            "You must use Slack mrkdwn formatting for your responses.",
        ]

        const loader = new DefaultResourceLoader({
            cwd: process.cwd(),
            agentDir: getAgentDir(),
            appendSystemPromptOverride: (base) => [
                ...base,
                `## Extra Instructions\n${extraInstructions.map((instruction) => `- ${instruction}`).join("\n")}`,
            ],
        })

        await loader.reload()
        return loader
    })()

    return resourceLoaderPromise
}
export async function getSession(threadTs: string) {
    let existingSession = sessions.get(threadTs)
    if (existingSession) return existingSession

    const sessionPromise = createOrResumeThreadSession(threadTs).then((session) => {
        const model = modelRegistry.find("openrouter", "minimax/minimax-m2.7")
        if (!model) throw new Error("Model not found")
        session.setModel(model)



        return session
    })

    sessions.set(threadTs, sessionPromise)
    sessionPromise.catch(() => sessions.delete(threadTs))

    return sessionPromise
}
