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
                placeName:true,
                roadAddress:true,
                lat:true,
                lng:true,
                products:{
                    select:{
                        id:true,
                        price:true,
                        title:true,
                        image:true,
                        userId:true,
                        isSold:true,
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                }
            }
        });
        if (user) {
            return user;
        }
    }
    notFound();
}

interface AddressData{
    roadAddress: string | null;
    placeName: string | null;
    latitude: string | null;
    longitude: string | null;
}

export async function setUserAddress({roadAddress,placeName,latitude,longitude}:AddressData){
    const session = await getSession();
    if (session.id) {
        await db.user.update({
            where: {
                id: Number(session.id),
            },
            data: {
                roadAddress:roadAddress,
                placeName:placeName,
                lat:latitude ,
                lng:longitude,
            },
        });
        redirect(`/profile/edit`);
    }
}


export async function logOut(){
    const session = await getSession();
    await session.destroy();
    redirect("/");
}