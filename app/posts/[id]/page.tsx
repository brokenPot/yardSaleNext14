import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { EyeIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { notFound } from "next/navigation";
import { unstable_cache as nextCache } from "next/cache";
import dog from "@/public/dog.jpg"
import LikeButton from "@/components/like-button";
import {getComments} from "@/app/posts/[id]/actions";
import {CommentList} from "@/components/commentList";
import Link from "next/link";

async function getPost(id: number) {
    try {
        const post = await db.post.update({
            where: {
                id,
            },
            data: {
                views: {
                    increment: 1,
                },
            },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
                _count: {
                    select: {
                        comments: true,
                    },
                },
            },
        });
        return post;
    } catch (e) {
        return null;
    }
}

function getCachedComments(postId: number) {
    const cachedComments = nextCache(getComments, ["comments"], {
        tags: [`comments-${postId}`],
    });
    return cachedComments(postId);
}

async function getMe() {
    const mySession = await getSession();
    const me = mySession.id
        ? await db.user.findUnique({
            where: {
                id: mySession.id,
            },
            select: {
                id: true,
                avatar: true,
                name: true,
            },
        })
        : null;
    return me;
}

const getCachedPost = nextCache(getPost, ["post-detail"], {
    tags: ["post-detail"],
    revalidate: 60,
});

async function getLikeStatus(postId: number, userId: number) {
    // const session = await getSession();
    const isLiked = await db.like.findUnique({
        where: {
            id: {
                postId,
                userId: userId,
            },
        },
    });
    const likeCount = await db.like.count({
        where: {
            postId,
        },
    });
    return {
        likeCount,
        isLiked: Boolean(isLiked),
    };
}

async function getCachedLikeStatus(postId: number) {
    const session = await getSession()
    const userId = session.id
    const cachedOperation = nextCache(getLikeStatus, ["product-like-status"], {
        tags: [`like-status-${postId}`],
    });
    return cachedOperation(postId,userId!);
}
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

    return (
        <div className="p-5 text-white">
            <div
                className="p-5  w-full bg-neutral-800  flex justify-items-start align-middle max-w-screen-sm z-50">
                <Link
                    className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold z-1"
                    href={`/life`}
                >
                    뒤로가기
                </Link>
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
                <LikeButton isLiked={isLiked} likeCount={likeCount} postId={id}/>
                <CommentList postId={post.id} sessionId={session.id!} allComments={allComments} me={me}/>
            </div>
        </div>
    );
}