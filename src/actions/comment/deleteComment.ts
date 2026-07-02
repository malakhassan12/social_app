"use server";

import { getUserId } from "@/helper/getUserId";
import prisma from "@/lib/prisma";
import { Comment } from "@/types/comment.Types";
import { revalidatePath } from "next/cache";

const deleteComment = async (comment: Comment) => {
  const userId = await getUserId();

  if (!userId) {
    return {
      success: false,
      errors: {
        message: "Unauthorized",
      },
    };
  }

  try {
    await prisma.comment.delete({
      where: { id: comment?.id },
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

export { deleteComment };
