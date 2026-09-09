"use server";

import prisma from "@/lib/prisma";
import { NOTIREQUEST } from "@/types/notification.Types";
import { revalidatePath } from "next/cache";
import { createNotification } from "../notification/createNotification";
import {
  FollowRequestStatus,
  NotificationType,
} from "@/generated/prisma/enums";
import { getAccountId } from "@/helper/getAccountId";
import { getIo } from "@/lib/socket/getIo";

const acceptFollowRequest = async (followerId: string) => {
  const accountId = await getAccountId();

  if (!accountId) {
    return {
      success: false,
      errors: {
        message: "Unauthorized",
      },
    };
  }

  const request = await prisma.followRequest.findUnique({
    where: {
      requesterId_receiverId: {
        requesterId: followerId,
        receiverId: accountId,
      },
    },
  });

  if (!request) {
    revalidatePath("/explore");

    return {
      success: false,
      error: {
        message: "Request not found",
      },
    };
  }

  if (request.status === FollowRequestStatus.ACCEPTED) {
    revalidatePath("/explore");

    return {
      success: false,
      error: {
        message: "Already accepted",
      },
    };
  }

  await prisma.$transaction(async (tx) => {
    await tx.followRequest.update({
      where: {
        requesterId_receiverId: {
          requesterId: followerId,
          receiverId: accountId,
        },
      },
      data: {
        status: FollowRequestStatus.ACCEPTED,
      },
    });

    await tx.follower.createMany({
      data: [
        {
          followerId: accountId,
          followingId: followerId,
        },
        {
          followerId: followerId,
          followingId: accountId,
        },
      ],
      skipDuplicates: true,
    });
  });

  const notification: NOTIREQUEST = {
    title: "New Friend",
    content: "became a friend with you",
    creatorId: accountId, // Iam make the action
    receiverId: followerId, //  the notification sended to the specific user
    notificationType: NotificationType.FRIEND,
  };
  await createNotification(notification);


  const io = getIo();
  io.to(`account:${followerId}`).emit("publish:explore");

  revalidatePath("/explore");

  return {
    success: true,
  };
};

export { acceptFollowRequest };
