"use server";

import db from "@/lib/db";
import {unstable_cache as nextCache} from "next/dist/server/web/spec-extension/unstable-cache";

export async function getProduct(id: number) {
    console.log("product");
    const product = await db.product.findUnique({
        where: {
            id,
        },
        include: {
            user: {
                select: {
                    name: true,
                    avatar: true,
                },
            },
        },
    });
    return product;
}

export const getCachedProduct = nextCache(getProduct, ["product-detail"], {
    tags: ["product-detail"],
});

export async function getProductTitle(id: number) {
    const product = await db.product.findUnique({
        where: {
            id,
        },
        select: {
            title: true,
        },
    });
    return product;
}

export const getCachedProductTitle = nextCache(getProductTitle, ["product-title"], {
    tags: ["product-title"],
});
