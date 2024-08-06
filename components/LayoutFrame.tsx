"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {cls} from "@/lib/utils";

interface LayoutProps {
    title?: string;
    productName? :string;
    canGoBack?: boolean;
    hasTabBar?: boolean;
    children: React.ReactNode;
    seoTitle?:string;
}

export default function Layout({
                                   title, productName,
                                   canGoBack,
                                   hasTabBar,
                                   children,
                                   seoTitle,
                               }: LayoutProps) {
    const router = useRouter();
    const onClick = () => {
        router.back();
    };

    return (
        <div>
            <div className="bg-blue-500 w-full h-12 max-w-2xl justify-center text-lg py-8 px-10 font-medium  fixed text-white top-0  flex items-center">
                {canGoBack ? (
                    <button onClick={onClick} className="absolute left-4">
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
                            ></path>
                        </svg>
                    </button>
                ) : null}
                <div className = "grid justify-items-center">
                    {title ? (
                        <div className={cls(canGoBack ? "mx-auto text-md" : "", "")}>{title}</div>
                    ) : null}
                    {productName ? (
                        <div className={cls(canGoBack ? "mx-auto text-xs" : "", "")}>{productName}</div>
                    ) : null}
                </div>
            </div>
            <div className={cls("pt-16", hasTabBar ? "pb-24" : "")}>{children}</div>
        </div>
    )
        ;
}