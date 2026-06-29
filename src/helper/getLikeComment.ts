"use server";

import { getUserId } from "@/helper/getUserId";
import prisma from "@/lib/prisma";

const getLikeComment = async (commentId: string) => {
  const userId = (await getUserId()) as string;

  const like = await prisma.commentLike.findUnique({
    where: {
      userId_commentId: {
        userId,
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
