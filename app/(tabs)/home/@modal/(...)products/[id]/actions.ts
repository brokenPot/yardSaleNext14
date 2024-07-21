"use server";

import db from "@/lib/db";

export async function getProduct(id: number) {
    const product = await db.product.findUnique({
        where: {
            id: id,
        },
        select: {
            image: true,
            title: true,
            description:true,
            user:true
        },
    });
    return product;
}