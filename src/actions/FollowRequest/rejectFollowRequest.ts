"use server";

import prisma from "@/lib/prisma";

import { revalidatePath } from "next/cache";

import { createNotification } from "../notification/createNotification";

import {
  FollowRequestStatus,
  NotificationType,
} from "@/generated/prisma/enums";

import { getAccountId } from "@/helper/account/getAccountId";

import { FormState } from "@/types/form.Types";
import { getIo } from "@/lib/socket/getIo";

const rejectFollowRequest = async (followerId: string): Promise<FormState> => {
  const accountId = await getAccountId();

  if (!accountId) {
    return {
      success: false,
      errors: {
        message: "Unauthorized",
      },
    };
  }

  if (accountId === followerId) {
    return {
      success: false,
      errors: {
        message: "Invalid request",
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
    return {
      success: false,
      errors: {
        message: "Request not found",
      },
    };
  }

  await prisma.followRequest.update({
    where: {
      requesterId_receiverId: {
        requesterId: followerId,
        receiverId: accountId,
      },
    },
    data: {
      status: FollowRequestStatus.REJECTED,
    },
  });
  await createNotification({
    title: "Friendship Request Rejected",
    content: "rejected your connection request",
    creatorId: accountId,
    receiverId: followerId,
    notificationType: NotificationType.FRIEND,
  });

  const io = getIo();
  io.to(`account:${followerId}`).emit("publish:explore");

  revalidatePath("/explore");

  return {
    success: true,
  };
};

export { rejectFollowRequest };
