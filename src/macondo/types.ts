import { z } from "zod";

export const fruitSchema = z.enum([
    "Mango",
    "Pineapple",
    "Papaya",
    "Cocoa", // software
    "Guava",
    "Coconut",
    "Watermelon",
    "Avocado", // hardware
]);
export type fruit = z.infer<typeof fruitSchema>;

export const SlackUserIdSchema = z.string().regex(/^U[A-Z0-9]{8,10}$/);
export type SlackUserId = z.infer<typeof SlackUserIdSchema>;

export const userSchema = z.object({
    id: z.uuid(),
    image: z.url(),
    username: z.string(),
    slack_id: SlackUserIdSchema,
});
export type user = z.infer<typeof userSchema>;

export const journalSchema = z.object({
    id: z.number(),
    short_brief: z.string(),
    long_brief: z.string(),
    hours: z.number(),
    created_at: z.string().datetime(),
    archived: z.boolean(),
    archived_at: z.union([z.string().datetime(), z.null()]),
    content_language: z.string(),
    author_id: z.string().uuid(),
    author_username: z.string(),
    author_slack_id: SlackUserIdSchema,
    author_image: z.string().url(),
});
export type journal = z.infer<typeof journalSchema>;

export const projectSchema = z.object({
    id: z.number(),
    user_id: z.string().uuid(),
    name: z.string(),
    type: z.enum(["software", "hardware"]),
    description: z.string(),
    fruit: fruitSchema,
    demo_url: z.url(),
    thumbnail_url: z.string().url(),
    repository_url: z.string().url(),
    hackatime_projects: z.array(z.string()),
    is_fork: z.boolean(),
    project_streak_days: z.number(),
    last_worked_date: z.date(),
    next_ship_used_ai: z.string(),
    next_ship_ai_usage_description: z.string().optional(),
    next_ship_is_update: z.boolean(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    owner: userSchema,
    journals: journalSchema.array(),
});
export type project = z.infer<typeof projectSchema>;
