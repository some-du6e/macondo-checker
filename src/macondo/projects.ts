import { projectSchema } from "./types";

async function getProject(id: number) {
    let MACONDO_BASE_URL =
        process.env.MACONDO_BASE_URL || "https://macondo.hackclub.com";

    let res = fetch(`${MACONDO_BASE_URL}/api/projects/${id}`);
}
