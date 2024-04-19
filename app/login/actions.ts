"use server";
import bcrypt from "bcrypt";
import db from "@/lib/db";
import { z } from "zod";
import sessionSave from "@/lib/sessionSave";

const checkEmailExists = async (email: string) => {
    const user = await db.user.findUnique({
        where: {
            email,
        },
        select: {
            id: true,
        },
    });
    // if(user){
    //   return true
    // } else {
    //   return false
    // }
    return Boolean(user);
};


const formSchema = z.object({
    email: z
        .string()
        .email()
        .toLowerCase()
        .refine(checkEmailExists, "An account with this email does not exist."),
    password: z.string({
        required_error: "Password is required",
    }),
    // .min(PASSWORD_MIN_LENGTH),
    // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
});

export async function logIn(prevState: any, formData: FormData) {
    const data = {
        email: formData.get("email"),
        password: formData.get("password"),
    };
    const result = await formSchema.spa(data);
    if (!result.success) {
        return result.error.flatten();
    } else {
        const user = await db.user.findUnique({
            where: {
                email: result.data.email,
            },
            select: {
                id: true,
                password: true,
            },
        });
        const ok = await bcrypt.compare(
            result.data.password,
            user!.password ?? "xxxx"
        );
        if (ok) {
            await sessionSave(user!.id);
        } else {
            return {
                fieldErrors: {
                    password: ["Wrong password."],
                    email: [],
                },
            };
        }
    }
}