"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import {revalidatePath, revalidateTag} from "next/cache";
import {unstable_cache as nextCache} from "next/dist/server/web/spec-extension/unstable-cache";

export async function likePost(postId: number) {
  await new Promise((r) => setTimeout(r, 10000));
  const session = await getSession();
  try {
    await db.like.create({
      data: {
        postId,
        userId: session.id!,
      },
    });
    revalidateTag(`like-status-${postId}`);
  } catch (e) {}
}

export async function dislikePost(postId: number) {
  await new Promise((r) => setTimeout(r, 10000));
  try {
    const session = await getSession();
    await db.like.delete({
      where: {
        id: {
          postId,
          userId: session.id!,
        },
      },
    });
    revalidateTag(`like-status-${postId}`);
  } catch (e) {}
}

export async function createComment(payload: string, postId: number) {
  const user = await getSession();
  if (!user.id) return;
  const newComment = await db.comment.create({
    data: {
      userId: user.id,
      payload,
      postId: postId,
    },
  });
  revalidateTag(`comments-${postId}`);
  return newComment;
}

export async function updateComment(payload: string, commentId: number) {
  const user = await getSession();
  if (!user.id) return;
  const newComment = await db.comment.update({
    where:{
      id:commentId
    },
    data: {
      payload:payload,
    },
  });
  revalidateTag(`comments`);
  return newComment;
}


export async function getComments(postId: number) {
  const comments = await db.comment.findMany({
    where: {
      postId: postId,
    },
    include: {
      user: {
        select: { name: true, avatar: true },
      },
    },
  });
  return comments;
}

export async function getCachedComments(postId: number) {
  const cachedComments = nextCache(getComments, ["comments"], {
    tags: [`comments-${postId}`,"comments"],
  });
  return cachedComments(postId);
}


export async function getPost(id: number) {
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

export const getCachedPost = nextCache(getPost, ["post-detail"], {
  tags: ["post-detail"],
});

export async function getCachedLikeStatus(postId: number) {
  const session = await getSession()
  const userId = session.id
  const cachedOperation = nextCache(getLikeStatus, ["product-like-status"], {
    tags: [`like-status-${postId}`],
  });
  return cachedOperation(postId,userId!);
}

export async function getMe() {
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

export async function getLikeStatus(postId: number, userId: number) {
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

export async function deletePost (id: number, isOwner: boolean) {
  if (!isOwner) return;
  const post = await db.post.delete({
    where: {
      id,
    },
    select: {
      title:true,
    },
  });
  revalidatePath("/post");
  return post
}

export async function deleteComment (postId: number, commentId: number, isOwner: boolean) {
  if (!isOwner) return;
  const comment = await db.comment.delete({
    where: {
      id:commentId,
    },
    select: {
      user: true
    }
  });
  revalidatePath(`/post/${postId}`);
  revalidateTag("comments");
  return comment
}