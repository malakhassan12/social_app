"use server";

import prisma from "@/lib/prisma";

const getShare = async (postId: string , accountId : string) => {

  if (!accountId) {
    return {
      success: false,
      errors: {
        message: "Unauthorized",
      },
    };
  }
  const share = await prisma.share.findFirst({
    where: {
      postId: postId,
      shareToId: accountId,
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
