"use server";

import { getUserId } from "@/helper/getUserId";
import prisma from "@/lib/prisma";
import { FollowResponse } from "@/types/follow.Types";
import { revalidatePath } from "next/cache";

const rejectFollow = async (followerId: string) => {
  const userId = await getUserId();

  if (!userId) {
    return {
      success: false,
      followed: false,
      error: {
        message: "Unauthorized",
      },
    };
  }

  const request = await prisma.follower.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId: userId,
      },
    },
  });

  if (!request) {
    return {
      success: false,
      followed: false,
      error: {
        message: "Request not found",
      },
    };
  }

  await prisma.follower.delete({
    where: {
      followerId_followingId: {
        followerId,
        followingId: userId,
      },
    },
  });

  const res: FollowResponse = {
    success: true,
    followed: false,
  };

  revalidatePath("/explore");

  return res;
};

export { rejectFollow };
