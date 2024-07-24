"use server";

import getSession from "@/lib/session";
import db from "@/lib/db";
import {revalidatePath, revalidateTag} from "next/cache";
import { redirect } from "next/navigation";
import {productSchema} from "@/app/product/add/schema";
import fs from "fs/promises";

export async  function editProduct   ( formData: FormData)  {
    const data = {
        productId: formData.get("productId"),
        photo: formData.get("image"),
        title: formData.get("title"),
        price: formData.get("price"),
        description: formData.get("description"),
    };
    if (data.photo instanceof File) {
        const photoData = await data.photo.arrayBuffer();
        await fs.appendFile(`./public/${data.photo.name}`, Buffer.from(photoData));
        data.photo = `/${data.photo.name}`;
    }
    const result = productSchema.safeParse(data);
    if (!result.success) {
        return result.error.flatten();
    } else {
        const session = await getSession();
        if (session.id) {
            const product = await db.product.update({
                where: {
                    id: Number(data.productId) ,
                },
                data: {
                    title: result.data.title,
                    description: result.data.description,
                    price: result.data.price,
                    image: result.data.photo,
                    user: {
                        connect: {
                            id: session.id,
                        },
                    },
                },
            });
            revalidateTag("product");
            redirect(`/products/${product.id}`);
        }
    }
}

export async function onDelete (id: number, isOwner: boolean) {
    if (!isOwner) return;
    const product = await db.product.delete({
        where: {
            id,
        },
        select: {
            title:true,
        },
    });
    revalidatePath("/home");
    revalidateTag("product-detail");
    return product
};