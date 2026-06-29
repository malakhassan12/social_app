"use server";

import { getUserId } from "@/helper/getUserId";
import prisma from "@/lib/prisma";
import { LikeResponse } from "@/types/like.Types";
import { revalidatePath } from "next/cache";

const createLikeOnComment = async (commentId: string) => {
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

  const like = await prisma.commentLike.findUnique({
    where: {
      userId_commentId: {
        userId,
        commentId,
      },
    },
  });

  if (like) {
    await prisma.commentLike.delete({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
    });


    res = {
      success: true,
      liked: false,
    };


  } else {
    await prisma.commentLike.create({
      data: {
        userId,
        commentId,
      },
    });
    res = {
      success: true,
      liked: true,
    };
  }

 
  revalidatePath("/");


  return res;
};

export { createLikeOnComment };
