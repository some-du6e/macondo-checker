import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { getMacondoApi, getProject } from "./projects";

function jsonToolResult(value: unknown, details: Record<string, unknown>) {
    return {
        content: [
            {
                type: "text" as const,
                text: JSON.stringify(value, null, 2),
            },
        ],
        details,
    };
}

export default function (pi: ExtensionAPI) {
    pi.registerTool({
        name: "get_macondo_project",
        label: "Get Macondo Project",
        description:
            "Fetch a public Macondo project by numeric id for support or submission review.",
        promptSnippet: "Fetch public Macondo project and ship data by id",
        promptGuidelines: [
            "Use this tool first when a user asks about or requests a review of a Macondo project URL.",
            "This tool uses only the public Macondo API and never sends an API key.",
        ],
        parameters: Type.Object({
            id: Type.Integer({
                description: "Numeric id from a Macondo project URL",
                minimum: 1,
            }),
        }),
        async execute(
            _toolCallId: string,
            params: { id: number },
            signal: AbortSignal,
        ) {
            const project = await getProject(params.id, signal);
            return jsonToolResult(project, { id: params.id });
        },
    });

    pi.registerTool({
        name: "macondo_api_get",
        label: "Macondo API GET",
        description:
            "Read a public Macondo JSON endpoint when project data alone is insufficient.",
        promptSnippet: "GET a public, read-only Macondo /api/* endpoint",
        promptGuidelines: [
            "Use this only when get_macondo_project does not provide data needed for the user's request.",
            "Only public GET requests under macondo.hackclub.com/api/ are allowed.",
            "Never request, infer, or send a Macondo API key or session cookie.",
        ],
        parameters: Type.Object({
            path: Type.String({
                description:
                    "Relative Macondo API path beginning with /api/, optionally including a query string",
                minLength: 6,
            }),
        }),
        async execute(
            _toolCallId: string,
            params: { path: string },
            signal: AbortSignal,
        ) {
            const result = await getMacondoApi(params.path, signal);
            return jsonToolResult(result, { path: params.path });
        },
    });
}
