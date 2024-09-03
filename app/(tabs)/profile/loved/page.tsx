import React from 'react';
import {getLikeProducts} from "@/app/(tabs)/profile/loved/actions";
import {Prisma} from "@prisma/client";
import LikedProductList from "@/app/(tabs)/profile/comps/LikedProductList";

export type likeProducts = Prisma.PromiseReturnType<
    typeof getLikeProducts
>;

export default async function Page({
                         params,
                     }: {
    params: { id: number };
}) {

    const likeProducts : likeProducts | undefined =  await getLikeProducts()
    return (
        <div>
            <LikedProductList initialProducts={likeProducts}/>
        </div>
    );
}

