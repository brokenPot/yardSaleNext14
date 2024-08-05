import { z } from "zod";

export const userSchema = z.object({
    userId: z.coerce.number().optional(),
    name: z.string({
        required_error: "name is required",
    }),
    phone: z.string({
        required_error: "phone is required",
    }),
    email: z.string({
        required_error: "email is required",
    }),
    avatar: z.any({
        required_error: "avatar is required",
    }),
});

export type UserType = z.infer<typeof userSchema>;