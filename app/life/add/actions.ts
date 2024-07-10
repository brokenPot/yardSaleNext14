"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import {postSchema} from "@/app/life/add/schema";

export async function uploadPost(_: any,  formData: FormData) {
    const user = await getSession();
    if (!user.id) return;
    const data = {
        title: formData.get("title"),
        description: formData.get("description"),
    };
    const result = postSchema.safeParse(data);
    if (!result.success) {
        return result.error.flatten();
    } else {
        const session = await getSession();
        if (session.id) {
            const post = await db.post.create({
                data: {
                    userId: user.id,
                    title: result.data.title,
                    description: result.data.description,
                },
            });
            redirect(`/posts/${post.id}`);
        }
    }
}