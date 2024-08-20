"use server";

import bcrypt from "bcrypt";
import {
    PASSWORD_MIN_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";
import getSession from "@/lib/session";
import {redirect} from "next/navigation";
import fs from "fs/promises";

const checkUsername = (name: string) => !name.includes("dumb");

const checkPasswords = ({
                            password,
                            confirm_password,
                        }: {
    password: string;
    confirm_password: string;
}) => password === confirm_password;

const formSchema = z
    .object({
        name: z
            .string({
                invalid_type_error: "Username must be a string!",
                required_error: "Where is my username???",
            })
            .toLowerCase()
            .trim()
            .refine(checkUsername, "No dumbs allowed!"),
        avatar: z.string(),
        email: z.string().email().toLowerCase(),
        password: z.string().min(PASSWORD_MIN_LENGTH)
        .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
        confirm_password: z.string().min(PASSWORD_MIN_LENGTH),
    })
    // 이름 중복 체크
    // 일반 refine과는 다르게 superRefine은 이후 검사를 중단시키고 반환.
    // DB를 불필요하게 불러오는 경우를 예방 가능하다.
    .superRefine(async ({ name }, ctx) => {
        const user = await db.user.findUnique({
            where: {
                name,
            },
            select: {
                id: true,
            },
        });
        if (user) {
            ctx.addIssue({
                code: "custom",
                message: "This username is already taken",
                path: ["name"],
                fatal: true,
            });
            return z.NEVER;
        }
    })
    // 이메일 중복 체크
    .superRefine(async ({ email }, ctx) => {
        const user = await db.user.findUnique({
            where: {
                email,
            },
            select: {
                id: true,
            },
        });
        if (user) {
            ctx.addIssue({
                code: "custom",
                message: "This email is already taken",
                path: ["email"],
                fatal: true,
            });
            return z.NEVER;
        }
    })
    .refine(checkPasswords, {
        message: "Both passwords should be the same!",
        path: ["confirm_password"],
    });

export async function createAccount(_: any, formData: FormData) {
    const data = {
        avatar: formData.get("avatar"),
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirm_password: formData.get("confirm_password"),
    };
    if (data.avatar instanceof File) {
        const photoData = await data.avatar.arrayBuffer();
        await fs.appendFile(`./public/${data.avatar.name.split(".")[0]}`, Buffer.from(photoData));
        data.avatar = `/${data.avatar.name.split(".")[0]}`;
    }
    const result = await formSchema.spa(data);
    if (!result.success) {
        return result.error.flatten();
    } else {
        // 계정 생성 성공시
        // 비밀번호 암호화
        const hashedPassword = await bcrypt.hash(result.data.password, 12); // 해싱 알고리즘 12번
        const user = await db.user.create({
            data: {
                avatar:result.data.avatar,
                name: result.data.name,
                email: result.data.email,
                password: hashedPassword,
            },
            select: {
                id: true,
            },
        });
        const session = await getSession();
        session.id = user.id;
        await session.save();
        redirect("/profile");
    }
}