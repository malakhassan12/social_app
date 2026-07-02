"use server";

import { NotificationType } from "@/generated/prisma/enums";
import { getUserId } from "@/helper/getUserId";
import prisma from "@/lib/prisma";
import { LikeResponse } from "@/types/like.Types";
import { NOTIREQUEST } from "@/types/notification.Types";
import { revalidatePath } from "next/cache";
import { createNotification } from "../notification/createNotification";

const createLikeOnPost = async (postId: string) => {
  const userId = await getUserId();

  if (!userId) {
    return {
      success: false,
      error: {
        message: "Unauthorized",
      },
    };
  }

  let res: LikeResponse;

  const like = await prisma.postLike.findUnique({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
  });

  if (like) {
    await prisma.postLike.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    res = {
      success: true,
      liked: false,
    };
  } else {
    await prisma.postLike.create({
      data: {
        userId,
        postId,
      },
    });
    res = {
      success: true,
      liked: true,
    };

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        authorId: true,
      },
    });

    if (post?.authorId) {
      const notification: NOTIREQUEST = {
        title: "New Like",
        content: `liked your post`,
        creatorId: userId, // Iam make the action
        userId: post.authorId, // the notification sent to the specific user
        notificationType: NotificationType.LIKE,
      };
      createNotification(notification);
    }
  }

  revalidatePath(`/`);

  return res;
};

export { createLikeOnPost };
