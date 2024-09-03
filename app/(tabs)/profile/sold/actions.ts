"use server";

import getSession from "@/lib/session";
import db from "@/lib/db";

export async function getSoldProducts() {
    const session = await getSession();
    if (session.id) {
        const soldProducts = await db.product.findMany({
            where: {
                userId:  session.id,
                isSold:true
            },
                    select:{
                        title: true,
                        price: true,
                        createdAt: true,
                        image: true,
                        id: true,
                        isSold:true,
                    }

        });
        return soldProducts;
    }
}