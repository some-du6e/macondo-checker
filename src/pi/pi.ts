import { AuthStorage, createAgentSession, ModelRegistry, SessionManager } from "@earendil-works/pi-coding-agent";
import { createModels } from "@earendil-works/pi-ai";
// Set up credential storage and model registry
const authStorage = AuthStorage.create();
const modelRegistry = ModelRegistry.create(authStorage);
const models = createModels({});

const { session } = await createAgentSession({
  sessionManager: SessionManager.inMemory(),
  authStorage,
  modelRegistry,
});

// Find model from registry (doesn't check if API key exists)
const model = modelRegistry.find("openrouter", "minimax/minimax-m2.7");
if (!model) throw new Error("Model not found");
session.setModel(model);

session.subscribe((event : any) => {
  if (event.type === "message_update" && event.assistantMessageEvent.type === "text_delta") {
    process.stdout.write(event.assistantMessageEvent.delta);
  }
});

export {session}