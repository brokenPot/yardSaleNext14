"use client";

import { HeartIcon } from "@heroicons/react/24/solid";

interface LikeButtonProps {
    likeCount: number;
}

export default function ShowLikeComp({
                                              likeCount,
                                          }: LikeButtonProps) {
    return (
        <div
            className={`flex items-center gap-2 text-neutral-400 text-sm border border-neutral-400 rounded-full p-2  transition-colors `}
        >

                <HeartIcon className={`size-5 ${
                    likeCount>0
                        && "text-blue-500"}
                `} />
                <span className={'text-blue-500'}>좋아요 ({likeCount})</span>
        </div>
    );
}