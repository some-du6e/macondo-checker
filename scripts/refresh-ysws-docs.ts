import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const BASE_URL =
    "https://hackclub.gitbook.io/ysws-project-submission-guidelines/BLBRN8LIfoCZhFV6oMNR";
const OUTPUT_DIR = join(process.cwd(), "docs", "ysws");
const DOCUMENTS = [
    "llms.txt",
    "ysws-project-submission-guidelines.md",
    "project-exceptions.md",
    "required-submission-fields.md",
    "override-hours-spent.md",
    "override-hours-spent-justification.md",
    "duplicate-and-updated-submissions.md",
    "spot-checks.md",
    "what-makes-a-project-shipped.md",
] as const;

await mkdir(OUTPUT_DIR, { recursive: true });

await Promise.all(
    DOCUMENTS.map(async (filename) => {
        const response = await fetch(`${BASE_URL}/${filename}`);
        if (!response.ok) {
            throw new Error(
                `Failed to fetch ${filename}: ${response.status} ${response.statusText}`,
            );
        }

        const content = (await response.text()).replace(/\r\n/g, "\n");
        await writeFile(
            join(OUTPUT_DIR, filename),
            content.endsWith("\n") ? content : `${content}\n`,
        );
        console.log(`Updated docs/ysws/${filename}`);
    }),
);
