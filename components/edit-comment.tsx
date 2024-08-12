"use client";

import {Dispatch, FormEvent, SetStateAction, useState} from "react";
import { updateComment} from "@/app/posts/[id]/actions";

interface CommentEditProps {
    comment:string;
    commentId:number;
    setModal:  Dispatch<SetStateAction<boolean>>;
    setEditModal:  Dispatch<SetStateAction<boolean>>;
}

export function EditComment({  comment, commentId,  setModal,setEditModal}: CommentEditProps) {
    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState(comment);
    const handleSubmit = async (payload: string, commentId: number) => {
            await updateComment(payload, commentId);
    };
    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        setLoading(true);
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const payload = formData.get("payload") as string;
        await handleSubmit(payload, commentId);
        setInputValue(""); // 입력 필드 초기화
        setLoading(false);
        setEditModal(false)
    }
    return (
        <div className="w-50 h-16 justify-evenly rounded  bg-gray-700 absolute -right-10 -top-20 p-1">
            <form
                className="flex space-x-4 justify-around items-center size-full "
                onSubmit={onSubmit}
            >
                <input
                    className="w-7/12 h-12 bg-blue-500 rounded-full focus:outline-none outline-offset-2 p-3"
                    name="payload"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)} // 입력값 변경 핸들러
                />
                <button
                    className="w-2/12 bg-blue-400 rounded text-white-400 hover:text-white-500  active:text-blue-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:animate-pulse"
                    type="submit"
                    disabled={loading}
                >
                    저장
                </button>
                <button
                    className="w-2/12 bg-blue-400 rounded text-white-400 hover:text-white-500 active:text-blue-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:animate-pulse"
                    onClick={()=>{
                        setModal(false );
                        setEditModal(false)
                    }}
                    disabled={loading}
                >
                    취소
                </button>
            </form>
        </div>
    );
}