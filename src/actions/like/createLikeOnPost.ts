"use server";

import { NotificationType } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { LikeResponse } from "@/types/like.Types";
import { NOTIREQUEST } from "@/types/notification.Types";
import { revalidatePath } from "next/cache";
import { createNotification } from "../notification/createNotification";
import { getAccountId } from "@/helper/getAccountId";
import publishToFollowers from "../socket/publish-to-followers";
import { TypePublishSocket } from "@/lib/socket/socket.types";
import { getIo } from "@/lib/socket/getIo";

const createLikeOnPost = async (postId: string) => {
  const accountId = await getAccountId();

  if (!accountId) {
    return {
      success: false,
      errors: {
        message: "Unauthorized",
      },
    };
  }

  let res: LikeResponse;

  const like = await prisma.postLike.findUnique({
    where: {
      accountId_postId: {
        accountId,
        postId,
      },
    },
  });

  if (like) {
    await prisma.postLike.delete({
      where: {
        accountId_postId: {
          accountId,
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
        accountId,
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
        accountId: true,
      },
    });

    if (post?.accountId) {
      if (accountId !== post.accountId) {
        const notification: NOTIREQUEST = {
          title: "New Like",
          content: `liked your post`,
          creatorId: accountId, // Iam make the action
          receiverId: post.accountId, // the notification sent to the specific user
          notificationType: NotificationType.LIKE,
        };
        createNotification(notification);
      }
      const io = getIo();

      await publishToFollowers(post.accountId, TypePublishSocket.POST);
      console.log("📡 SOCKET EMIT", {
        event: "post-liked",
        postId,
        socketCount: io.engine.clientsCount,
      });
    }
  }

  revalidatePath(`/`);

  return res;
};

export { createLikeOnPost };
