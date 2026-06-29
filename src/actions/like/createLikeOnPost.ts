"use server";

import { getUserId } from "@/helper/getUserId";
import prisma from "@/lib/prisma";
import { LikeResponse } from "@/types/like.Types";
import { revalidatePath } from "next/cache";





const createLikeOnPost = async (postId: string) => {
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

  const like = await prisma.postLike.findUnique({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
  });

  if (like) {
    await prisma.postLike.delete({
      where: {
        userId_postId: {
          userId,
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
        userId,
        postId,
      },
    });
    res = {
      success: true,
      liked: true,
    };
  }

 

  revalidatePath(`/`);


  return res;
};

export { createLikeOnPost };
