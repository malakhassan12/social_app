"use server";

import prisma from "@/lib/prisma";
import { getUserId } from "@/helper/getUserId";
import { validateCreateComment } from "@/utils/commentValidation";
import { revalidatePath } from "next/cache";

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

  revalidatePath(`/api/comment/${postId}`);
  return {
    success: true,
  };
}
