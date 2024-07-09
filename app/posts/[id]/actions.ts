"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidateTag } from "next/cache";

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

export async function getComments(postId: number) {
  "use server";
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