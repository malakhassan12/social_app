"use server";

import { getAccountId } from "@/helper/getAccountId";
import prisma from "@/lib/prisma";
import { Comment } from "@/types/comment.Types";
import {
  CommentErrors,
  validateCreateComment,
} from "@/utils/commentValidation";
import { revalidatePath } from "next/cache";
import publishToFollowers from "../socket/publish-to-followers";
import { TypePublishSocket } from "@/lib/socket/socket.types";

const updateComment = async (comment: Comment, formData: FormData) => {
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

  const errors: CommentErrors = {};

  validateCreateComment(comment?.postId, content, errors);

  if (Object.keys(errors).length) {
    return {
      success: false,
      errors,
    };
  }

  try {
    await prisma.comment.update({
      where: {
        id: comment.id,
        postId: comment?.postId,
      },
      data: {
        content,
      },
    });
    revalidatePath(`/api/comment/${comment?.postId}`);

    await publishToFollowers(accountId, TypePublishSocket.COMMENT);

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
    };
  }
};

export { updateComment };
