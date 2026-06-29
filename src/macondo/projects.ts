import { projectSchema } from "./types";

async function getProject(id: number) {
    let BASE_URL = process.env.BASE_URL || "https://macondo.hackclub.com";

    let res = fetch(`${BASE_URL}/api/projects/${id}`);
}
