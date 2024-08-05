"use server";

import db from "@/lib/db";


import getSession from "@/lib/session";
import {notFound, redirect} from "next/navigation";

export async function getUser() {
    const session = await getSession();
    if (session.id) {
        const user = await db.user.findUnique({
            where: {
                id: session.id,
            },
            select:{
                id:true,
                createdAt:true,
                name:true,
                avatar:true,
                phone:true,
                email:true,
                products:{
                    select:{
                        id:true,
                        price:true,
                        title:true,
                        userId:true
                    }
                }
            }
        });
        if (user) {
            return user;
        }
    }
    notFound();
}

export async function logOut(){
    const session = await getSession();
    await session.destroy();
    redirect("/");
}