"use server";

import getSession from "@/lib/session";
import db from "@/lib/db";
import fs from "fs/promises";
import {redirect} from "next/navigation";
import {z} from "zod";

const checkUsername = (name: string) => !name.includes("dumb");

const formSchema = z
    .object({
        userId:z.number(),
        name: z
            .string({
                invalid_type_error: "Username must be a string!",
                required_error: "Where is my username???",
            })
            .toLowerCase()
            .trim()
            .refine(checkUsername, "No dumbs allowed!"),
        avatar: z.any(),
        phone: z.string({
            required_error: "Where is your phone number??",
        }),
        email: z.string().email().toLowerCase(),
        // password: z.string().min(PASSWORD_MIN_LENGTH)
        //     .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
        // confirm_password: z.string().min(PASSWORD_MIN_LENGTH),
    })
    // 이름 중복 체크
    // 일반 refine과는 다르게 superRefine은 이후 검사를 중단시키고 반환.
    // DB를 불필요하게 불러오는 경우를 예방 가능하다.
    .superRefine(async ({ name,userId }, ctx) => {
        const user = await db.user.findUnique({
            where: {
                name,
            },
            select: {
                id: true,
            },
        });
        if (user && user!.id !== userId) {
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
    .superRefine(async ({ email,userId }, ctx) => {
        const user = await db.user.findUnique({
            where: {
                email,
            },
            select: {
                id: true,
            },
        });
        if (user && user!.id !== userId) {
            ctx.addIssue({
                code: "custom",
                message: "This email is already taken",
                path: ["email"],
                fatal: true,
            });
            return z.NEVER;
        }
    })
    // 전화번호 중복 체크
    .superRefine(async ({ phone,userId }, ctx) => {
        const user = await db.user.findUnique({
            where: {
                phone,
            },
            select: {
                id: true,
            },
        });
        if (user && user!.id !== userId) {
            ctx.addIssue({
                code: "custom",
                message: "This phone number is already in use by another user",
                path: ["phone"],
                fatal: true,
            });
            return z.NEVER;
        }
    })
export async  function editUser (_:any, formData: FormData)  {
    const session = await getSession();
    const data = {
        userId: session.id,
        avatar: formData.get("avatar"),
        name: formData.get("name"),
        phone: formData.get("phone"),
        email: formData.get("email"),
    };

    if (data.avatar instanceof File) {
        if(data.avatar.name==='undefined'){
            data.avatar = null;
        }else{
            const photoData = await data.avatar.arrayBuffer();
            await fs.appendFile(`./public/${data.avatar.name}`, Buffer.from(photoData));
            data.avatar = `/${data.avatar.name}`;
        }
    }
    const result =  await formSchema.spa(data);
    if (!result.success) {
        return result.error.flatten();
    } else {
        if (session.id) {
            await db.user.update({
                where: {
                    id: Number(session.id) ,
                },
                data: {
                    name: result.data.name,
                    phone: result.data.phone,
                    email: result.data.email,
                    avatar: result.data.avatar,
                },
            });
            redirect(`/profile`);
        }
    }
}
