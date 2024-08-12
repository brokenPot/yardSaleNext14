"use client";

import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import {
    HandThumbUpIcon as OutlineHandThumbUpIcon,
    HandThumbDownIcon as OutlineHandThumbDownIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import avatar from '@/avatar.gif'
import {useState} from "react";
import CommentControl from "@/components/comment-control";
import {EditComment} from "@/components/edit-comment";

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
}

export default function Comments({
                                     id,
                                     postId,
                                     payload,
                                     userId,
                                     user,
                                     sessionId,
                                     createdAt,
                                 }: CommentProps) {
    const [modal, setModal] = useState(false);
    const [editModal, setEditModal] = useState(false);

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
                <div className="flex items-center gap-3 *:size-5 *:cursor-pointer">
                    <OutlineHandThumbUpIcon />
                    <OutlineHandThumbDownIcon />
                </div>
            </div>
        </div>
    );
}