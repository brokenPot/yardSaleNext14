"use server";

import getSession from "@/lib/session";
import db from "@/lib/db";

export async function getLikeProducts() {
    const session = await getSession();
    if (session.id) {
        const productLikes = await db.productLike.findMany({
            where: {
                userId:  session.id,
            },
            select:{
                product:{
                    select:{
                        title: true,
                        price: true,
                        createdAt: true,
                        image: true,
                        id: true,
                    }
                }
            }
        });
        // 데이터 구조 변환
        const filteredProductLikes = productLikes.map(product => ({
            ...product.product,
            likes: productLikes.filter(likedProduct => likedProduct.product.id === product.product.id).length
        }));
        return filteredProductLikes;
    }
}