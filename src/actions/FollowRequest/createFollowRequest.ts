"use server";

import {
  FollowRequestStatus,
  NotificationType,
} from "@/generated/prisma/enums";
import { getAccountId } from "@/helper/getAccountId";
import prisma from "@/lib/prisma";
import { FormState } from "@/types/form.Types";
import { NOTIREQUEST } from "@/types/notification.Types";
import { revalidatePath } from "next/cache";
import { createNotification } from "../notification/createNotification";
import { getIo } from "@/lib/socket/getIo";

const createFollowRequest = async (receiverId: string): Promise<FormState> => {
  const accountId = await getAccountId();

  if (!accountId) {
    return {
      success: false,
      errors: {
        message: "Unauthorized",
      },
    };
  }

  // Prevent following yourself
  if (accountId === receiverId) {
    return {
      success: false,
      errors: {
        message: "You cannot follow yourself",
      },
    };
  }

  // Check existing request
  const existingRequest = await prisma.followRequest.findUnique({
    where: {
      requesterId_receiverId: {
        requesterId: accountId,
        receiverId,
      },
    },
  });

  // ==============================
  // PENDING → Cancel request
  // ==============================

  if (existingRequest?.status === FollowRequestStatus.PENDING) {
    await prisma.followRequest.delete({
      where: {
        id: existingRequest.id,
      },
    });

    revalidatePath("/explore");

    return {
      success: true,
    };
  }

  // ==============================
  // ACCEPTED → Unfollow
  // ==============================

  if (existingRequest?.status === FollowRequestStatus.ACCEPTED) {
    await prisma.$transaction([
      prisma.follower.deleteMany({
        where: {
          followerId: accountId,
          followingId: receiverId,
        },
      }),

      prisma.followRequest.delete({
        where: {
          id: existingRequest.id,
        },
      }),
    ]);

    revalidatePath("/explore");

    return {
      success: true,
    };
  }

  // ==============================
  // REJECTED → create new request
  // ==============================

  await prisma.followRequest.upsert({
    where: {
      requesterId_receiverId: {
        requesterId: accountId,
        receiverId,
      },
    },

    update: {
      status: FollowRequestStatus.PENDING,
    },

    create: {
      requesterId: accountId,
      receiverId,
      status: FollowRequestStatus.PENDING,
    },
  });

  const notification: NOTIREQUEST = {
    title: "New Follower",
    content: "Someone started following you",
    creatorId: accountId,
    receiverId,
    notificationType: NotificationType.FRIEND,
  };

  await createNotification(notification);

  const io = getIo();

  io.to(`account:${receiverId}`).emit("publish:explore");

  revalidatePath("/explore");

  return {
    success: true,
  };
};

export default createFollowRequest;
