"use server";

import prisma from "@/lib/prisma";
import { getAccountId } from "./getAccountId";

const getLikePost = async (postId: string) => {
  const accountId = (await getAccountId()) as string;

   if (!accountId) {
    return {
      success: false,
      errors: {
        message: "Unauthorized",
      },
    };
  }
  const like = await prisma.postLike.findUnique({
    where: {
      accountId_postId: {
        accountId,
        postId,
      },
    },
  });

  const likes = await prisma.postLike.findMany({
    where: {
      postId,
    },
  });

  if (like)
    return {
      isLiked: true,
      likedCount: likes?.length,
    };

  return {
    isLiked: false,
    likedCount: likes?.length,
  };
};

export { getLikePost };
