"use server";

import prisma from "@/lib/prisma";
import { getUserId } from "@/helper/getUserId";
import { validateCreateComment } from "@/utils/commentValidation";
import { revalidatePath } from "next/cache";
import { createNotification } from "../notification/createNotification";
import { NOTIREQUEST } from "@/types/notification.Types";
import { NotificationType } from "@/generated/prisma/enums";

export async function createComment(postId: string, formData: FormData) {
  const userId = await getUserId();

  if (!userId) {
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

  await prisma.comment.create({
    data: {
      content,
      postId,
      authorId: userId,
    },
  });

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
      title: "New Comment",
      content: `made a comment on your post`,
      creatorId: userId,
      userId: post.authorId,
      notificationType: NotificationType.COMMENT,
    };

    await createNotification(notification);
  }

  revalidatePath(`/api/comment/${postId}`);
  return {
    success: true,
  };
}
