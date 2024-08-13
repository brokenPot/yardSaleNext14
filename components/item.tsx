"use client"

import Link from "next/link";
import React, {useState} from "react";
import Image from "next/image";
import {onDelete} from "@/app/products/[id]/edit/actions";
import FormButton from "@/components/form-btn";

interface ItemProps {
    id: number;
    title: string;
    image:string;
    price: number;
    isOwner:boolean;
}

export default  function Item({id,title,image,price,isOwner}: ItemProps) {
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleDelete = async () => {
        const ok = window.confirm("상품을 삭제하시겠습니까?");
        if (!ok) return;
        setDeleteLoading(true);
        const deletedProduct= await onDelete(id, isOwner);
        window.confirm(`${deletedProduct?.title}가 삭제됐습니다.`);
        setDeleteLoading(false);
        window.location.href = "/home";
    };

    return (
        <div className="flex px-4 pt-5 cursor-pointer justify-between">
                <Link href={`/products/${id}`}>
                    <div className="flex space-x-4">
                        <Image
                            src={image}
                            width={50}
                            height={50}
                            style={{ width: 50, height: 50 }}
                            alt={title}
                            priority
                        />
                        <div className="pt-2 flex flex-col">
                            <h3 className="text-sm font-medium text-white">{title}</h3>
                            <span className="font-medium mt-1 text-white">${price}</span>
                        </div>
                    </div>
                </Link>
            <div className="w-10  flex flex-col justify-between items-end relative">
                {isOwner && <div
                    className="min-w-[100px] h-15 p-1 absolute font-[14px] rounded-lg  bg-white shadow-md flex  gap-2 transition-all duration-300 items-center">
                            <Link
                                className="bg-blue-500 px-1 py-2 rounded-md text-white"
                                href={`/products/${id}/edit`}
                            >
                                수정
                            </Link>
                        <form action={handleDelete}>
                            <FormButton text={deleteLoading ? "삭제중.." : "삭제"}/>
                        </form>
                </div>}
            </div>
        </div>
    );
}