"use server";

import { getUserId } from "@/helper/getUserId";
import prisma from "@/lib/prisma";
import { FollowResponse } from "@/types/follow.Types";
import { NOTIREQUEST } from "@/types/notification.Types";
import { revalidatePath } from "next/cache";
import { createNotification } from "../notification/createNotification";
import { NotificationType } from "@/generated/prisma/enums";

const acceptFollow = async (followerId: string) => {
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
    revalidatePath("/explore");

    return {
      success: false,
      followed: false,
      error: {
        message: "Request not found",
      },
    };
  }

  if (request.status === "ACCEPTED") {
    revalidatePath("/explore");

    return {
      success: false,
      followed: true,
      error: {
        message: "Already accepted",
      },
    };
  }

  await prisma.follower.update({
    where: {
      followerId_followingId: {
        followerId,
        followingId: userId,
      },
    },
    data: {
      status: "ACCEPTED",
    },
  });

  

  const notification: NOTIREQUEST = {
    title: "Accepted Follower",
    content: `accepted your follow`,
    creatorId: userId, // Iam make the action
    userId: followerId, //  the notification sended to the specific user
    notificationType: NotificationType.FOLLOW,
  };
  createNotification(notification);

  revalidatePath("/explore");

  const res: FollowResponse = {
    success: true,
    followed: true,
  };

  return res;
};

export { acceptFollow };
