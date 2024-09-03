"use client"

import Link from "next/link";
import React, {  useState} from "react";
import Image from "next/image";
import {onDelete} from "@/app/products/[id]/edit/actions";
import FormButton from "@/components/form-btn";
import {CiMenuKebab} from "react-icons/ci";

interface ItemProps {
    id: number;
    title: string;
    image:string;
    price: number;
    isOwner:boolean;
    isSold:boolean
}

export default  function Item({id,title,image,price,isOwner,isSold}: ItemProps) {
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMouseEnter = () => {
        setIsMenuOpen(true);
    };

    const handleMouseLeave = () => {
        setIsMenuOpen(false);
    };

    const handleDelete = async () => {
        const ok = window.confirm("상품을 삭제하시겠습니까?");
        if (!ok) return;
        setDeleteLoading(true);
        const deletedProduct= await onDelete(id, isOwner);
        window.confirm(`${deletedProduct?.title}가 삭제됐습니다.`);
        setDeleteLoading(false);
        window.location.href = "/home";
    };

 // isSold
    return (
        <div
            onMouseLeave={handleMouseLeave}
            className="flex px-4 h-38 cursor-pointer justify-between  mb-2" >
                <Link href={`/products/${id}`}>
                    <div className="flex space-x-4">
                        <div className="relative   overflow-hidden">
                            <Image
                                className={`object-cover ${isSold ? "opacity-20" : ""}`}
                                src={image}
                                width={50}
                                height={50}
                                style={{width: 50, height: 50}}
                                alt={title}
                                priority
                            />
                            {isSold ? <div className="absolute  top-1/4 left-1/4 font-bold text-xs text-white ">판매 완료</div> : null}
                        </div>
                        <div className="pt-2 flex flex-col">
                            <h3 className="text-sm font-medium text-white">{title}</h3>
                            <span className="font-medium mt-1 text-white">${price}</span>
                        </div>
                    </div>
                </Link>
            <div className="w-10  flex items-center justify-end relative  flex">
                {isOwner &&
                    <CiMenuKebab
                        onMouseEnter={handleMouseEnter}
                        size="24" color="#3b82f6" className="flex items-center space-y-10"/>
                }
                {isMenuOpen &&
                        <div
                        className="min-w-[100px] p-1 absolute font-[14px] rounded-lg  bg-white shadow-md flex  gap-2 transition-all duration-300 items-center">
                                <Link
                                    className="bg-blue-500 px-1 py-2 rounded-md text-white"
                                    href={`/products/${id}/edit`}
                                >
                                    수정
                                </Link>
                            <form action={handleDelete}>
                                <FormButton text={deleteLoading ? "삭제중.." : "삭제"}/>
                            </form>
                    </div>
                }
            </div>
        </div>
    );
}
