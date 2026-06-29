"use server";

import { getUserId } from "@/helper/getUserId";
import prisma from "@/lib/prisma";

const getShare = async (postId: string) => {
  const userId = (await getUserId()) as string;

  const share = await prisma.share.findFirst({
    where: {
      postId: postId,
      shareToId: userId,
    },
  });

  const shares = await prisma.share.findMany({
    where: {
      postId,
    },
  });

  if (!share) return { isShared: false, sharedCount: shares.length };

  return { isShared: true, sharedCount: shares.length };
};

export { getShare };
