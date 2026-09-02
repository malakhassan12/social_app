"use server";

import prisma from "@/lib/prisma";
import { getAccountId } from "./getAccountId";

const getLikeComment = async (commentId: string) => {
  const accountId = (await getAccountId()) as string;

  if (!accountId) {
    return {
      success: false,
      errors: {
        message: "Unauthorized",
      },
    };
  }
  const like = await prisma.commentLike.findUnique({
    where: {
      accountId_commentId: {
        accountId,
        commentId,
      },
    },
  });

  const likes = await prisma.commentLike.findMany({
    where: {
      commentId,
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

export { getLikeComment };
