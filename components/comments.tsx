"use client";

import {EllipsisVerticalIcon, HandThumbUpIcon} from "@heroicons/react/24/solid";
import {
    HandThumbUpIcon as OutlineHandThumbUpIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import avatar from '@/avatar.gif'
import {useOptimistic, useState, useTransition} from "react";
import CommentControl from "@/components/comment-control";
import {EditComment} from "@/components/edit-comment";
import {
    dislikeComment,
    likeComment,
} from "@/app/posts/[id]/actions";

interface CommentProps {
    id: number;
    postId:number;
    payload: string;
    userId: number;
    user: {
        avatar: string | null;
        name: string;
    };
    sessionId: number;
    createdAt: string;
    isCommentLike : boolean;
    commentLike : number;
}

export default async function Comments({
                                     id,
                                     postId,
                                     payload,
                                     userId,
                                     user,
                                     sessionId,
                                     createdAt,
                                     isCommentLike,
                                     commentLike,
                                 }: CommentProps) {
    const [, startTransition] = useTransition();
    const [state, reducerFn] = useOptimistic(
        { isCommentLike, commentLike },
        (previousState, ) => ({
            isCommentLike: !previousState.isCommentLike,
            commentLike: previousState.isCommentLike
                ? previousState.commentLike - 1
                : previousState.commentLike + 1,
        })
    );

    const [modal, setModal] = useState(false);
    const [editModal, setEditModal] = useState(false);

    const onClick = async () => {
        startTransition( async ()=>{
            reducerFn(undefined);
            if (isCommentLike) {
                await dislikeComment(id,postId);
            } else {
                await likeComment(id,postId);
            }
        })
    };

    return (
        <div
            key={id}
            className="w-full mx-auto mt-2 mb-5 py-4 border-neutral-600 border-b-2 last:border-b-0 "
        >
            <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-2 ">
                    {/*{user.avatar ? (*/}
                        <Image
                            src={avatar}
                            alt={user.name}
                            width={30}
                            height={30}
                            style={{ width: 30, height: 30 }}
                        />
                    {/*) : (*/}
                    {/*    <div className="rounded-full size-8 bg-slate-400"></div>*/}
                    {/*)}*/}
                    <div>{user.name}</div>
                    <div className="text-xs text-neutral-500">{createdAt}</div>
                </div>
                <div>
                    {userId === sessionId ? (
                        <EllipsisVerticalIcon className="size-5 cursor-pointer" onClick={()=>{setModal(prevState => !prevState)}}/>
                    ) : null}
                </div>
                {modal && <CommentControl postId={postId} commentId={id} isOwner={userId === sessionId} setModal={setModal} setEditModal={setEditModal}/>}
                {editModal && <EditComment comment={payload} commentId={id}  setModal={setModal} setEditModal={setEditModal}/>}
            </div>
            <div className="flex items-center justify-between pl-4 mt-4">
                <div className="text-base text-neutral-100">{payload}</div>
                <button
                    onClick={onClick}
                    className={`flex items-center gap-2 text-neutral-400 text-sm border border-neutral-400 rounded-full p-2  transition-colors ${
                        state.isCommentLike
                            ? "bg-orange-500 text-white border-orange-500"
                            : "hover:bg-neutral-800"
                    }`}
                >
                    {state.isCommentLike ? (
                        <HandThumbUpIcon className="size-5"/>
                    ) : (
                        <OutlineHandThumbUpIcon className="size-5"/>
                    )}
                    {state.isCommentLike ? (
                        <span> {state.commentLike}</span>
                    ) : (
                        <span>추천 ({state.commentLike})</span>
                    )}
                </button>
            </div>
        </div>
    );
}