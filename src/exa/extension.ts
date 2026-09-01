import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import Exa from "exa-js";
import { Type } from "typebox";

function parsePublicUrl(value: string) {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
        throw new Error("Demo URL must use HTTP or HTTPS");
    }
    return url;
}

function normalizeUrl(value: string) {
    const url = parsePublicUrl(value);
    url.hash = "";
    url.hostname = url.hostname.toLowerCase();
    url.pathname = url.pathname.replace(/\/+$/, "") || "/";
    return url.toString();
}

export default function (pi: ExtensionAPI) {
    pi.registerTool({
        name: "verify_demo_with_exa",
        label: "Verify Demo with Exa",
        description:
            "Look up an exact public demo or publishing-platform URL with Exa when a normal HTTP check is blocked by bot protection.",
        promptSnippet:
            "Verify a bot-blocked public demo or publishing page with Exa",
        promptGuidelines: [
            "Use this only as a fallback when a quick direct HTTP check is blocked, especially by a 403, 429, CAPTCHA, or Cloudflare challenge.",
            "Pass the exact submitted demo URL. An exact Exa result can establish that a public listing exists, but it is not a functional test of the demo.",
            "A missing Exa result is not proof that a page is unpublished. Do not use it alone as a blocker.",
        ],
        parameters: Type.Object({
            url: Type.String({
                description: "Exact public demo URL submitted with the project",
                format: "uri",
            }),
        }),
        async execute(
            _toolCallId: string,
            params: { url: string },
            signal: AbortSignal,
        ) {
            const apiKey = process.env.EXA_API_KEY;
            if (!apiKey) throw new Error("EXA_API_KEY is required");

            const submittedUrl = parsePublicUrl(params.url);
            const pathPrefix = submittedUrl.pathname.replace(/\/+$/, "");
            const domainFilter = `${submittedUrl.hostname}${pathPrefix}`;
            const exa = new Exa(apiKey);

            if (signal.aborted) throw new Error("Exa lookup aborted");
            const response = await exa.search(
                `Find the public page at this exact URL and return evidence that the listing exists: ${submittedUrl.toString()}`,
                {
                    type: "auto",
                    numResults: 3,
                    includeDomains: [domainFilter],
                    contents: {
                        highlights: {
                            query: "Evidence that this exact project, demo, plugin, mod, game, or app listing exists and is publicly described",
                            maxCharacters: 2_000,
                        },
                    },
                },
            );
            if (signal.aborted) throw new Error("Exa lookup aborted");

            const normalizedSubmittedUrl = normalizeUrl(
                submittedUrl.toString(),
            );
            const results = response.results.map((result) => ({
                title: result.title,
                url: result.url,
                exactUrlMatch:
                    normalizeUrl(result.url) === normalizedSubmittedUrl,
                highlights: result.highlights,
            }));

            return {
                content: [
                    {
                        type: "text" as const,
                        text: JSON.stringify(
                            {
                                submittedUrl: submittedUrl.toString(),
                                results,
                            },
                            null,
                            2,
                        ),
                    },
                ],
                details: {
                    submittedUrl: submittedUrl.toString(),
                    resultCount: results.length,
                },
            };
        },
    });
}
