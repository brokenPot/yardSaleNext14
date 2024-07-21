"use server";

import db from "@/lib/db";

export async function getMoreProducts(page: number) {
    const products = await db.product.findMany({
        select: {
            title: true,
            price: true,
            createdAt: true,
            image: true,
            id: true,
        },
        skip: page * 1,
        take: 1,
        orderBy: {
            createdAt: "desc",
        },
    });
    return products;
}

// const getCachedProducts = nextCache(getInitialProducts, ["home-products"]); // 60초가 지난후 새로운 요청이 있다면 재 호출


export async function getInitialProducts() {
    const products = await db.product.findMany({
        select: {
            title: true,
            price: true,
            createdAt: true,
            image: true,
            id: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return products;
}