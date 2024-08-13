
import React from 'react';
import Item from "@/components/item";
import {getUserInfo} from "@/app/profile/[id]/actions";
import Link from "next/link";

async function  Page({
                         params,
                     }: {
    params: { id: number };
}) {
    const data = await getUserInfo(params.id);

    return (
        <div className="py-10 px-4">
            <div
                className="p-5  w-full bg-neutral-800  flex justify-items-start align-middle max-w-screen-sm z-50 mb-3">
                <Link
                    className="bg-blue-500 px-5 py-2.5 rounded-md text-white font-semibold z-1"
                    href={`/home`}
                >
                    뒤로가기
                </Link>
            </div>
            <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-slate-500 rounded-full"/>
                <div className="flex flex-col">
                    <span className="font-medium text-white">{data?.name}</span>
                    <span
                        className="font-medium text-white">{"가입일자 : " + data?.createdAt.toISOString().split('T')[0]}</span>
                </div>
            </div>
            <div className="pt-5">
                <span className="font-bold text-white">판매 중</span>
                <hr className="h-px my-2 bg-gray-700 border-0"/>
            </div>
            {data?.products?.length! > 0 ?
                (data?.products?.map((product: any) => (
                    <Item
                        key={product.id}
                        id={product.id}
                        title={product.title}
                        image={product.image}
                        price={product.price}
                    />
                )))
                : <div>판매하는 상품이 없습니다</div>}
            <div className="pt-6">
                <span className="font-bold text-white">판매자 리뷰</span>
                <hr className="h-px my-2 bg-gray-700 border-0"/>
            </div>
        </div>);
}

export default Page;