"use client"

import Link from "next/link";
import Button from "@/components/button";
import {useState} from "react";
import Image from "next/image";

interface ItemProps {
    id: number;
    title: string;
    image:string;
    price: number;
}

export default  function Item({id,title,image,price}: ItemProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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
                {isMenuOpen && <div
                    className="min-w-[70px] p-1 absolute font-[14px] rounded-lg  bg-white shadow-md flex flex-col gap-2 transition-all duration-300 left-[60px] items-center">
                    <div >
                        <div className="w-100 mb-1">
                            <Button    text="수정"  />
                        </div>
                        <div className="w-100">
                            <Button text="삭제"  />
                        </div>
                    </div>
                </div>}
            </div>
        </div>
    );
}