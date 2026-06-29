import { readFile } from "fs/promises";

export class subagent {
    name: string;
    pfp: string;

    private constructor(name: string) {
        this.name = name;
        this.pfp = `https://github.com/identicons/${name}.png`;
    }

    static async create(name?: string): Promise<subagent> {
        if (!name) {
            const file = await readFile(
                "src/slack/codex_agent_names.txt",
                "utf-8",
            );
            const names = file.split("\n").filter((n) => n.trim());
            name = names[Math.floor(Math.random() * names.length)];
        }
        return new subagent(name!);
    }
}
