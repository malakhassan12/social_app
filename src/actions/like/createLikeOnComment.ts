"use server";

import prisma from "@/lib/prisma";
import { LikeResponse } from "@/types/like.Types";
import { createNotification } from "../notification/createNotification";
import { NotificationType } from "@/generated/prisma/enums";
import { NOTIREQUEST } from "@/types/notification.Types";
import { getAccountId } from "@/helper/account/getAccountId";
import publishToFollowers from "../socket/publish-to-followers";
import { TypePublishSocket } from "@/lib/socket/socket.types";

const createLikeOnComment = async (commentId: string) => {
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

  const like = await prisma.commentLike.findUnique({
    where: {
      accountId_commentId: {
        accountId,
        commentId,
      },
    },
  });

  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    select: {
      accountId: true,
      post: {
        select: {
          accountId: true,
        },
      },
    },
  });

  if (!comment) {
    return {
      success: false,
      errors: {
        message: "Not fount comment",
      },
    };
  }

  let liked: boolean;

  if (like) {
    await prisma.commentLike.delete({
      where: {
        accountId_commentId: {
          accountId,
          commentId,
        },
      },
    });

    liked = false;
    res = {
      success: true,
      liked: false,
    };
  } else {
    await prisma.commentLike.create({
      data: {
        accountId,
        commentId,
      },
    });
    liked = true;
    res = {
      success: true,
      liked: true,
    };

    if (comment?.accountId) {
      if (accountId !== comment.accountId) {
        const notification: NOTIREQUEST = {
          title: "New Like",
          content: `liked your comment`,
          creatorId: accountId,
          receiverId: comment.accountId,
          notificationType: NotificationType.LIKE,
        };

        await createNotification(notification);
      }
    }
  }

  const likesCount = await prisma.commentLike.count({
    where: { commentId },
  });

  await publishToFollowers(
    comment.post.accountId,
    TypePublishSocket.COMMENT_LIKE,
    {
      commentLike: {
        commentId,
        accountId,
        commentOwnerId: comment.accountId,
        liked,
        likesCount,
      },
    },
  );

  return res;
};

export { createLikeOnComment };
