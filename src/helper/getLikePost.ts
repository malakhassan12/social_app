"use server";

import { getUserId } from "@/helper/getUserId";
import prisma from "@/lib/prisma";

const getLikePost = async (postId: string) => {
  const userId = (await getUserId()) as string;

  const like = await prisma.postLike.findUnique({
    where: {
      userId_postId: {
        userId,
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
