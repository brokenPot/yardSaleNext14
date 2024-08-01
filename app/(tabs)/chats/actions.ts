import db from "@/lib/db";
import getSession from "@/lib/session";
import { unstable_cache as nextCache } from "next/cache";

export async function getAllChatRoom() {
    const session = await getSession();
    const rooms = await db.chatRoom.findMany({
        where: {
            users: {
                some: {
                    id: {
                        in: [session.id!],
                    },
                },
            },
        },
        include: {
            // users: {
            //     where: {
            //         NOT: {
            //             id: session.id,
            //         },
            //     },
            // },
            users:true,
            product: {
                select: {
                    title: true,
                    image: true,
                },
            },
            messages: {
                select: {
                    payload: true,
                    id: true,
                    created_at: true,
                },
                orderBy: {
                    created_at: "desc",
                },
            },
        },
    });

    return rooms;
}

//안읽은 메세지 갯수 세기
//나의 메세지 제외, 다른 사람의 메세지만 세기
// export async function countUnreadMessages() {
//     const session = await getSession();
//     const unreadCount = await db.message.count({
//         where: {
//             userId: {
//                 not: session.id,
//             },
//             isRead: false,
//         },
//     });
//
//     return unreadCount;
// }
//
export const getAllChatRoomCache = nextCache(getAllChatRoom, ["chatRoom-all"], {
    tags: ["chatRoom-all"],
});