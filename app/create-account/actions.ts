"use server";
import { z } from "zod";
import {PASSWORD_MIN_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_ERROR} from "@/app/lib/constants";
const passwordRegex = new RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/
);

const formSchema = z.object({
    username:z.string().min(3,"Have to type over 3 letters").max(10,"Have to type less 10 letters").trim()
        .toLowerCase()
        .transform((username) => `🔥 ${username}`).refine(
            (username) => !username.includes("potato"),
            "No potatoes allowed!"
        ),
    email: z.string().email().toLowerCase(),
    password: z
        .string()
        .min(PASSWORD_MIN_LENGTH)
        .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirm_password: z.string().min(PASSWORD_MIN_LENGTH),
}).superRefine(({ password, confirm_password }, ctx) => {
    if (password !== confirm_password) {
        ctx.addIssue({
            code: "custom",
            message: "Two passwords should be equal",
            path: ["confirm_password"],
        });
    }
});

export async function createAccount(prevState: any, formData: FormData) {
    const data = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirm_password: formData.get("confirmPassword"),
    };
    const result = formSchema.safeParse(data);
    if (!result.success) {
        return result.error.flatten();
    }else {
        console.log(result.data);
    }
}

