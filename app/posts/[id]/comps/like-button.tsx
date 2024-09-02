"use client";

import { HandThumbUpIcon } from "@heroicons/react/24/solid";
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from "@heroicons/react/24/outline";
import {useOptimistic, useTransition} from "react";
import { dislikePost, likePost } from "@/app/posts/[id]/actions";

interface LikeButtonProps {
    isLiked: boolean;
    likeCount: number;
    targetId: number;
}

export default function LikeButton({
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
                await dislikePost(targetId);
            } else {
                await likePost(targetId);
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
                <HandThumbUpIcon className="size-5" />
            ) : (
                <OutlineHandThumbUpIcon className="size-5" />
            )}
            {state.isLiked ? (
                <span> {state.likeCount}</span>
            ) : (
                <span>공감하기 ({state.likeCount})</span>
            )}
        </button>
    );
}