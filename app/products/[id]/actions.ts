"use server";

import db from "@/lib/db";
import {unstable_cache as nextCache} from "next/dist/server/web/spec-extension/unstable-cache";

export async function getProduct(id: number) {
    // nextJs의 fetch는 자동으로 cache된다. 태그 옵션도 설정 가능하다.
    // fetch("https://api.com", {
    //     next: {
    //         revalidate: 60,
    //         tags: ["hello"],
    //     },
    // });
    const product = await db.product.findUnique({
        where: {
            id,
        },
        include: {
            user: {
                select: {
                    id:true,
                    name: true,
                    avatar: true,
                    chat_rooms: true,
                },
            },
            ChatRoom: {
                select: {
                    id: true,
                    users: {
                        select: {
                            id: true,
                        },
                    },
                },
            },
        },
    });
    return product;
}

// getProduct 함수에 인자를 적지 않아도 알아서 넘겨준다.
// 캐시 저장  불러오는 기준이 되는 key는 유니크해야한다.
export const getCachedProduct = nextCache(getProduct, ["product-detail"], {
    tags: ["product-detail","xxxx"],
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
    tags: ["product-title","xxxx"],
});


interface ChatRoomResponse {
    id: string;
    users: {
        id: number;
    }[];
}

export async function FindRoomWithBothUsers(
    chatRooms: ChatRoomResponse[],
    sellerId: number,
    buyerId: number
) {
    return chatRooms.filter((room) => {
        // room.users 배열에서 판매자 ID와 구매자 ID가 모두 존재하는지 확인
        const hasSeller = room.users.some((user) => user.id === sellerId);
        const hasBuyer = room.users.some((user) => user.id === buyerId);
        return hasSeller && hasBuyer;
    });
}


export async function generateStaticParams() {
    const products = await db.product.findMany({
        select: {
            id: true,
        },
    });
    return products.map((product) => ({id: product.id + ""}));
}