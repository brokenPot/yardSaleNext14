"use server";

import getSession from "@/lib/session";
import db from "@/lib/db";
import {redirect} from "next/navigation";
import {postSchema} from "@/app/life/add/schema";

export async  function updatePost   ( formData: FormData)  {
    const data = {
        id: formData.get("id"),
        title: formData.get("title"),
        description: formData.get("description"),
    };
    const result = postSchema.safeParse(data);
    if (!result.success) {
        return result.error.flatten();
    } else {
        const session = await getSession();
        if (session.id) {
            const post = await db.post.update({
                where: {
                    id: Number(data.id) ,
                },
                data: {
                    title: result.data.title,
                    description: result.data.description,
                },
            });
            redirect(`/posts/${post.id}`);
        }
    }
}
