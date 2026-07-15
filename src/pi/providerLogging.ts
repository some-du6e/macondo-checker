import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

function payloadSummary(payload: unknown) {
    if (!payload || typeof payload !== "object")
        return { type: typeof payload };

    const body = payload as Record<string, unknown>;
    return {
        model: body.model,
        stream: body.stream,
        messageCount: Array.isArray(body.messages)
            ? body.messages.length
            : undefined,
        toolCount: Array.isArray(body.tools) ? body.tools.length : undefined,
        maxTokens: body.max_tokens ?? body.max_completion_tokens,
        reasoning: body.reasoning ?? body.reasoning_effort,
    };
}

export default function providerLogging(pi: ExtensionAPI) {
    pi.on("before_provider_request", (event) => {
        console.info("[pi/provider] request", {
            provider: process.env.PI_MODEL_API || "openrouter",
            baseUrl:
                process.env.PI_MODEL_API === "openrouter"
                    ? "https://openrouter.ai/api/v1"
                    : process.env.PI_MODEL_BASE_URL,
            ...payloadSummary(event.payload),
        });
    });

    pi.on("after_provider_response", (event) => {
        console.info("[pi/provider] response", {
            status: event.status,
            contentType: event.headers["content-type"],
            requestId:
                event.headers["x-request-id"] ||
                event.headers["cf-ray"] ||
                event.headers["x-amzn-requestid"],
        });
    });
}
