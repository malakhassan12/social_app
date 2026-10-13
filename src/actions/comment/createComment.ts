"use server";

import prisma from "@/lib/prisma";
import { validateCreateComment } from "@/utils/commentValidation";
import { createNotification } from "../notification/createNotification";
import { NOTIREQUEST } from "@/types/notification.Types";
import { NotificationType } from "@/generated/prisma/enums";
import { getAccountId } from "@/helper/account/getAccountId";
import publishToFollowers from "../socket/publish-to-followers";
import { TypePublishSocket } from "@/lib/socket/socket.types";
import { Comment } from "@/types/comment.Types";

export async function createComment(postId: string, formData: FormData) {
  const accountId = await getAccountId();

  if (!accountId) {
    return {
      success: false,
      errors: {
        message: "Unauthorized",
      },
    };
  }

  const content = formData.get("content") as string;

  const errors = {};

  validateCreateComment(postId, content, errors);

  if (Object.keys(errors).length) {
    return {
      success: false,
      errors,
    };
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      postId,
      accountId,
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          image: true,
        },
      },
    },
  });

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
        title: "New Comment",
        content: `made a comment on your post`,
        creatorId: accountId,
        receiverId: post.accountId,
        notificationType: NotificationType.COMMENT,
      };

      await createNotification(notification);
    }
    await publishToFollowers(post.accountId, TypePublishSocket.COMMENT, {
      comment: comment as unknown as Comment,
    });
  }

  // revalidatePath(`/api/comment/${postId}`);
  return {
    success: true,
  };
}
