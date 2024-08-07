import { z } from "zod";

export const postSchema = z.object({
    id: z.coerce.number().optional(),
    title: z.string({
        required_error: "Title is required",
    }),
    description: z.string({
        required_error: "Description is required",
    }),
});

export type PostType = z.infer<typeof postSchema>;