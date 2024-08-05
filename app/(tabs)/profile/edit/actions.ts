"use server";

import getSession from "@/lib/session";
import db from "@/lib/db";
import fs from "fs/promises";
import {userSchema} from "@/app/(tabs)/profile/edit/schema";
import {redirect} from "next/navigation";

export async  function editUser   ( formData: FormData)  {
    const data = {
        userId: formData.get("userId"),
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
    const result = userSchema.safeParse(data);
    if (!result.success) {
        return result.error.flatten();
    } else {
        const session = await getSession();
        if (session.id) {
            const user = await db.user.update({
                where: {
                    id: Number(data.userId) ,
                },
                data: {
                    name: result.data.name,
                    phone: result.data.phone,
                    email: result.data.email,
                    avatar: result.data.avatar,
                },
            });
            // revalidateTag("product");
            redirect(`/profile`);
        }
    }
}
