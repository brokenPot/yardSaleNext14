"use client";

import Image from "next/image";
import Link from "next/link";
import {formatToTimeAgo, formatToWon} from "@/lib/utils";

export interface ListProductProps {
    title: string;
    price: number;
    createdAt: Date;
    image: string;
    id: number;
}

export default function ListProduct({
                                        title,
                                        price,
                                        createdAt,
                                        image,
                                        id,
                                    }: ListProductProps) {
    // console.log(id)
    // console.log(title)
    // console.log(price)
    // console.log(image)
    return (
        <Link href={`/products/${id}`} className="flex gap-5">
            <div className="relative size-28 rounded-md overflow-hidden">
                <Image fill src={image} className="object-cover" alt={title} unoptimized priority sizes="(max-width: 600px) 10vw, (max-width: 1200px) 10vw, 10vw"/>
            </div>
            <div className="flex flex-col gap-1 *:text-white">
                <span className="text-lg">{title}</span>
                <span className="text-sm text-neutral-500">{formatToTimeAgo(createdAt.toString())}</span>
                <span className="text-lg font-semibold">{formatToWon(price)}원</span>
            </div>
        </Link>
    );
}
