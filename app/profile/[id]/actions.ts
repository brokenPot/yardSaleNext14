import db from "@/lib/db";

export async function getUserInfo(userId:number) {
    const user = await db.user.findUnique({
        where: {
            id: Number(userId),
        },
        select: {
            id:true,
            avatar:true,
            name:true,
            createdAt:true,
            products:true,
        },
    });
    return user;
}