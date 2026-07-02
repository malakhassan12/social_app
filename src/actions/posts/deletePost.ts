"use server";

import { getUserId } from "@/helper/getUserId";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const deletePost = async (postId: string) => {
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
    await prisma.post.delete({
      where: {
        id: postId,
      },
    });
    revalidatePath(`/api/post`);

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
    };
  }
};
