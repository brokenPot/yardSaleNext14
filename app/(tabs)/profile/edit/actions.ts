"use server";

import getSession from "@/lib/session";
import db from "@/lib/db";
import fs from "fs/promises";
import {redirect} from "next/navigation";
import {z} from "zod";

const checkUsername = (name: string) => !name.includes("dumb");

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
        avatar: z.string({
            required_error: "Where is your avatar??",
        }),
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
    // .refine(checkPasswords, {
    //     message: "Both passwords should be the same!",
    //     path: ["confirm_password"],
    // });

export async  function editUser   (_:any, formData: FormData)  {
    const data = {
        avatar: formData.get("avatar"),
        name: formData.get("name"),
        phone: formData.get("phone"),
        email: formData.get("email"),
    };
    if (data.avatar instanceof File) {
        const photoData = await data.avatar.arrayBuffer();
        await fs.appendFile(`./public/${data.avatar.name}`, Buffer.from(photoData));
        data.avatar = `/${data.avatar.name}`;
    }
    const result =  await formSchema.spa(data);
    if (!result.success) {
        return result.error.flatten();
    } else {
        const session = await getSession();
        if (session.id) {
            const user = await db.user.update({
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
