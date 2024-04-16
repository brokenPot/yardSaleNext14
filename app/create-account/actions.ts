"use server";
import {PASSWORD_MIN_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_ERROR} from "@/lib/constants";
const passwordRegex = new RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/
);
import db from "@/lib/db";
import { z } from "zod";


const checkUsername = (name: string) => !name.includes("potato");
const checkPasswords = ({
                            password,
                            confirm_password,
                        }: {
    password: string;
    confirm_password: string;
}) => password === confirm_password;

const checkUniqueUsername = async (name: string) => {
    const user = await db.user.findUnique({
        where: {
            name,
        },
        select: {
            id: true,
        },
    });
    // if (user) {
    //   return false;
    // } else {
    //   return true;
    // }
    return !Boolean(user);
};

const checkUniqueEmail = async (email: string) => {
    const user = await db.user.findUnique({
        where: {
            email,
        },
        select: {
            id: true,
        },
    });
    return Boolean(user) === false;
};

const formSchema = z.object({
    name:z.string().min(3,"Have to type over 3 letters").max(10,"Have to type less 10 letters")
        .toLowerCase().trim()
        .refine(checkUsername, "No potatoes allowed!")
        .refine(checkUniqueUsername, "This username is already taken"),
    email: z.string().email().toLowerCase().refine(
        checkUniqueEmail,
        "There is an account already registered with that email."
    ),
    password: z
        .string()
        .min(PASSWORD_MIN_LENGTH),
    confirm_password: z.string().min(PASSWORD_MIN_LENGTH),
}).refine(checkPasswords, {
    message: "Both passwords should be the same!",
    path: ["confirm_password"],
});

export async function createAccount(prevState: any, formData: FormData) {
    const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirm_password: formData.get("confirmPassword"),
    };
    const result = await  formSchema.safeParseAsync(data);
    if (!result.success) {
        return result.error.flatten();
    }else {
        console.log(result.data);
    }
}

