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
        // 숫자만큼 데이터 건너뛴다
        skip: page * 1,
        // 가져오는 데이터 수
        take: 1,
        orderBy: {
            createdAt: "desc",
        },
    });
    return products;
}

// const getCachedProducts = nextCache(getInitialProducts, ["home-products"], revalidate:30); // 30초가 지난후 새로운 요청이 있다면 재 호출
// tags를 통한 캐시 새로고침도 가능
// nextJS에서, api를 통한 fetch의 경우 nextCache 사용 필요 없이 자동으로 캐시해준다.
// 예시
// fetch("https://api.com", {
//     next: {
//         revalidate: 60,
//         tags: ["hello"],
//     },
// });

export async function getInitialProducts() {
    const products = await db.product.findMany({
        select: {
            title: true,
            price: true,
            createdAt: true,
            image: true,
            id: true,
        },
        // 버튼형 로드를 위한 코드
        take: 1,


        orderBy: {
            createdAt: "desc",
        },
    });
    return products;
}