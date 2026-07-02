"use server";

import { getUserId } from "@/helper/getUserId";
import prisma from "@/lib/prisma";
import { Comment } from "@/types/comment.Types";
import {
  CommentErrors,
  validateCreateComment,
} from "@/utils/commentValidation";
import { revalidatePath } from "next/cache";

const updateComment = async (comment: Comment, formData: FormData) => {
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
