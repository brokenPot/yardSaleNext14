"use client";

import { HeartIcon } from "@heroicons/react/24/solid";
import { HeartIcon as OutlineHeartIcon } from "@heroicons/react/24/outline";
import {useOptimistic, useTransition} from "react";
import {dislikeProduct, likeProduct} from "@/app/products/[id]/actions";

interface LikeButtonProps {
    isLiked: boolean;
    likeCount: number;
    targetId: number;
}

export default function ProductLikeButton({
                                       isLiked,
                                       likeCount,
                                       targetId,
                                   }: LikeButtonProps) {
    const [, startTransition] = useTransition();
    // 불러오기전 화면상으로 수정된 정보를 미리 보여줌.
    const [state, reducerFn] = useOptimistic(
        { isLiked, likeCount },
        (previousState, ) => ({
            isLiked: !previousState.isLiked,
            likeCount: previousState.isLiked
                ? previousState.likeCount - 1
                : previousState.likeCount + 1,
        })
    );
    const onClick = async () => {
        startTransition( async ()=>{
            reducerFn(undefined);
            if (isLiked) {
                await dislikeProduct(targetId);
            } else {
                await likeProduct(targetId);
            }
        })
    };
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 text-neutral-400 text-sm border border-neutral-400 rounded-full p-2  transition-colors ${
                state.isLiked
                    ? "bg-orange-500 text-white border-orange-500"
                    : "hover:bg-neutral-800"
            }`}
        >
            {state.isLiked ? (
                <HeartIcon className="size-5" />
            ) : (
                <OutlineHeartIcon className="size-5" />
            )}
            {state.isLiked ? (
                <span> {state.likeCount}</span>
            ) : (
                <span>좋아요 ({state.likeCount})</span>
            )}
        </button>
    );
}