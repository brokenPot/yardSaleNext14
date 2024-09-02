"use server";

import db from "@/lib/db";
import {unstable_cache as nextCache} from "next/dist/server/web/spec-extension/unstable-cache";
import getSession from "@/lib/session";
import {revalidateTag} from "next/cache";
import {notFound} from "next/navigation";

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
                    roadAddress:true
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

export async function getProductLikesStatus(productId: number, userId: number) {
    const isLiked = await db.productLike.findUnique({
        where: {
            id: {
                productId,
                userId: userId,
            },
        },
    });
    const likeCount = await db.productLike.count({
        where: {
            productId,
        },
    });
    return {
        likeCount,
        isLiked: Boolean(isLiked),
    };
}

export async function getCachedProductLikesStatus(productId: number) {
    const session = await getSession()
    const userId = session.id
    const cachedOperation = nextCache(getProductLikesStatus, ["product-like-status"], {
        tags: [`like-status-${productId}`],
    });
    return cachedOperation(productId,userId!);
}

export async function likeProduct(productId: number) {
    const session = await getSession();
    try {
        await db.productLike.create({
            data: {
                productId,
                userId: session.id!,
            },
        });
        revalidateTag(`like-status-${productId}`);
    } catch (e) {}
}

export async function dislikeProduct(productId: number) {
    try {
        const session = await getSession();
        await db.productLike.delete({
            where: {
                id: {
                    productId,
                    userId: session.id!,
                },
            },
        });
        revalidateTag(`like-status-${productId}`);
    } catch (e) {}
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


// export const getCachedProductTitle = nextCache(getProductTitle, ["product-title"], {
//     tags: ["product-title", "product-detail"],
// });

export async function getIsOwner(userId: number) {
    const session = await getSession();
    return session.id === userId;
}

export async function generateMetadata(id: number) {
    const product = await getCachedProductTitle(id);
    return {
        title: product?.title,
    };
}

export async function fetchProductDetails(id: number) {
    if (isNaN(id)) {
        return notFound();
    }
    const product = await getProduct(id);
    if (!product) {
        return notFound();
    }
    const { likeCount, isLiked } = await getCachedProductLikesStatus(id);
    const isOwner = await getIsOwner(product.userId);

    return { product, likeCount, isLiked, isOwner };
}

export async function revalidateProductTitle() {
    revalidateTag("product-title");
}

