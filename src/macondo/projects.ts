import { projectSchema } from "./types";

const DEFAULT_MACONDO_BASE_URL = "https://macondo.hackclub.com";
const MAX_RESPONSE_CHARS = 1_000_000;
const REQUEST_TIMEOUT_MS = 15_000;

function getMacondoBaseUrl() {
    return new URL(DEFAULT_MACONDO_BASE_URL);
}

export function getMacondoApiUrl(path: string) {
    const baseUrl = getMacondoBaseUrl();
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const url = new URL(normalizedPath, baseUrl);

    if (url.origin !== baseUrl.origin || !url.pathname.startsWith("/api/")) {
        throw new Error("Macondo API paths must stay under /api/");
    }

    return url;
}

export async function getMacondoApi(path: string, signal?: AbortSignal) {
    const timeoutSignal = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
    const requestSignal = signal
        ? AbortSignal.any([signal, timeoutSignal])
        : timeoutSignal;
    const url = getMacondoApiUrl(path);
    const response = await fetch(url, {
        headers: {
            Accept: "application/json",
            "User-Agent": "macondo-checker",
        },
        signal: requestSignal,
    });
    const body = await response.text();

    if (body.length > MAX_RESPONSE_CHARS) {
        throw new Error("Macondo API response was too large");
    }

    if (!response.ok) {
        const summary = body.replace(/\s+/g, " ").trim().slice(0, 300);
        throw new Error(
            `Macondo API returned ${response.status}${summary ? `: ${summary}` : ""}`,
        );
    }

    if (!body) return null;

    try {
        return JSON.parse(body) as unknown;
    } catch {
        return body;
    }
}

export async function getProject(id: number, signal?: AbortSignal) {
    if (!Number.isInteger(id) || id <= 0) {
        throw new Error("Project id must be a positive integer");
    }

    return projectSchema.parse(
        await getMacondoApi(`/api/projects/${id}`, signal),
    );
}
