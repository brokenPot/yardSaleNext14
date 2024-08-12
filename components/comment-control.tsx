import React, {Dispatch, SetStateAction} from 'react';
import {deleteComment} from "@/app/posts/[id]/actions";

interface CommentProps {
    postId:number;
    commentId:number;
    isOwner:boolean;
    setEditModal:  Dispatch<SetStateAction<boolean>>;
    setModal:  Dispatch<SetStateAction<boolean>>;

}

function CommentControl({postId , commentId , isOwner,setEditModal,setModal }:CommentProps) {

    const handleDelete = async () => {
        const ok = window.confirm("댓글을 삭제하시겠습니까?");
        if (!ok) return;
        const commentUser= await deleteComment(postId, commentId, isOwner);
        if(commentUser){
            window.confirm(`${commentUser.user.name}의 댓글이 삭제됐습니다.`);
        }
    };

    const handleUpdate = async () => {
        setEditModal((prevState) => !prevState );
        setModal((prevState) => !prevState );
    };

    return (
        <div
            className={'absolute primary-btn flex w-3/12 py-1 items-center justify-evenly  bg-blue-300 -right-10 -top-12'}>
            <button className="bg-blue-500 px-2.5 py-2.5 rounded-md text-white font-semibold cursor-pointer"
                    onClick={handleDelete}>
                삭제
            </button>
            <button className="bg-blue-500 px-2.5 py-2.5 rounded-md text-white font-semibold cursor-pointer"
                    onClick={handleUpdate}>
                수정
            </button>
        </div>
    );
}

export default CommentControl;