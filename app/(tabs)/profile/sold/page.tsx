import React from 'react';
import LikedProductList from "@/app/(tabs)/profile/comps/LikedProductList";
import {Prisma} from "@prisma/client";
import {getSoldProducts} from "@/app/(tabs)/profile/sold/actions";

export type likeProducts = Prisma.PromiseReturnType<
    typeof getSoldProducts
>;
async function  Page({
                         params,
                     }: {
    params: { id: number };
}) {
    const likeProducts : likeProducts | undefined =  await getSoldProducts()
    return (
        <div>
            <LikedProductList initialProducts={likeProducts}/>
        </div>
    );
}

export default Page;