"use client";

import { useState } from "react";
import {deletePost} from "@/app/posts/[id]/actions";

const PostDeleteButton = ({ id, isOwner }: { id: number; isOwner: boolean }) => {
    const [isLoading, setLoading] = useState(false);
    const onClick = async () => {
        const ok = window.confirm("게시글을 삭제하시겠습니까?");
        if (!ok) return;
        setLoading(true);
        const deletedPost= await deletePost(id, isOwner);
        window.confirm(`${deletedPost?.title}가 삭제됐습니다.`);
        setLoading(false);
        window.location.href = "/life";
    };
    return (
        <button
            onClick={onClick}
            type="button"
            className="flex justify-center items-center w-3/12 h-8 bg-red-500   rounded-md text-white font-semibold  text-xs md:text-md"
        >
            {isLoading ? "삭제하는 중.." : "삭제하기"}
        </button>
    );
};

export default PostDeleteButton;