import getSession from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { EyeIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { notFound } from "next/navigation";
import dog from "@/public/dog.jpg"
import LikeButton from "@/app/posts/[id]/comps/like-button";
import {getCachedComments, getCachedPost, getMe,getCachedLikeStatus} from "@/app/posts/[id]/actions";
import {CommentList} from "@/app/posts/[id]/comps/commentList";
import Link from "next/link";
import PostDeleteButton from "@/app/posts/[id]/comps/PostDeleteButton";
import {getIsOwner} from "@/app/products/[id]/actions";
import ShowThumbsUpComp from "@/app/posts/[id]/comps/showThumbsUpComp";

export default async function PostDetail({params,}: {
    params: { id: string };
}) {
    const id = Number(params.id);
    if (isNaN(id)) {
        return notFound();
    }
    const post = await getCachedPost(id);
    if (!post) {
        return notFound();
    }

    const { likeCount, isLiked } = await getCachedLikeStatus(id);
    const allComments = await getCachedComments(post.id);
    const me = await getMe();
    const session = await getSession();

    const isOwner = await getIsOwner(post.userId);
    return (
        <div className="p-5 text-white">
            <div
                className="p-5 w-full bg-neutral-800 flex justify-between align-middle max-w-screen-sm z-50">
                <Link
                    className="bg-blue-500 px-5 py-2.5 rounded-md text-white font-semibold z-1"
                    href={`/life`}
                >
                    뒤로가기
                </Link>
                {isOwner && (<Link
                    className="bg-blue-500 px-5 py-2.5 rounded-md text-white font-semibold z-1"
                    href={`/posts/${id}/edit`}
                >
                    수정하기
                </Link>)}
                {isOwner && (<PostDeleteButton id={post.id} isOwner={isOwner}/>)}
            </div>
            <div className="flex items-center gap-2 mb-2">
                <Image
                    width={28}
                    height={28}
                    className="size-7 rounded-full"
                    src={dog}
                    alt={post.user.name}
                    unoptimized
                />
                <div>
                    <span className="text-sm font-semibold">{post.user.name}</span>
                    <div className="text-xs">
                        <span>{formatToTimeAgo(post.created_at.toString())}</span>
                    </div>
                </div>
            </div>
            <h2 className="text-lg font-semibold">{post.title}</h2>
            <p className="mb-5">{post.description}</p>
            <div className="flex flex-col gap-5 items-start">
                <div className="flex items-center gap-2 text-neutral-400 text-sm">
                    <EyeIcon className="size-5"/>
                    <span>조회 {post.views}</span>
                </div>

                {isOwner ? (<ShowThumbsUpComp likeCount={likeCount} />) : (<LikeButton isLiked={isLiked} likeCount={likeCount} targetId={id}/>)}

                <CommentList postId={post.id} sessionId={session.id!} allComments={allComments} me={me}/>
            </div>
        </div>
    );
}