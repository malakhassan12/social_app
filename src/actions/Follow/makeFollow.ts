"use server";

import { AccountType, NotificationType } from "@/generated/prisma/enums";
import { getAccountId } from "@/helper/getAccountId";
import prisma from "@/lib/prisma";
import { FormState } from "@/types/form.Types";
import { revalidatePath } from "next/cache";

import { createNotification } from "../notification/createNotification";
import { NOTIREQUEST } from "@/types/notification.Types";
import { getIo } from "@/lib/socket/getIo";

const makeFollow = async (followingId: string): Promise<FormState> => {
  // 1️⃣ Get currently selected account
  const accountId = await getAccountId();

  if (!accountId) {
    return {
      success: false,
      errors: {
        message: "Unauthorized",
      },
    };
  }

  // 2️⃣ Prevent following yourself
  if (accountId === followingId) {
    return {
      success: false,
      errors: {
        message: "You can't follow yourself",
      },
    };
  }

  // 3️⃣ Check target account
  const targetAccount = await prisma.account.findUnique({
    where: {
      id: followingId,
    },
    select: {
      id: true,
      type: true,
    },
  });

  if (!targetAccount) {
    return {
      success: false,
      errors: {
        message: "Account not found",
      },
    };
  }

  // 4️⃣ Private account
  if (targetAccount.type === AccountType.PRIVATE) {
    return {
      success: false,
      errors: {
        message: "This account is private",
      },
    };
  }

  // 5️⃣ Check existing follow
  const existing = await prisma.follower.findUnique({
    where: {
      followerId_followingId: {
        followerId: accountId,
        followingId,
      },
    },
  });

  // 6️⃣ Already following → Unfollow
  if (existing) {
    await prisma.follower.delete({
      where: {
        id: existing.id,
      },
    });

    revalidatePath("/explore");

    return {
      success: true,
      data: {
        followed: false,
      },
    };
  }

  // 7️⃣ Create follow
  await prisma.follower.create({
    data: {
      followerId: accountId,
      followingId,
    },
  });

  // 8️⃣ Create notification
  const notification: NOTIREQUEST = {
    title: "New Follower",
    content: "started following you",
    creatorId: accountId,
    receiverId: followingId,
    notificationType: NotificationType.FOLLOW,
  };

  await createNotification(notification);

  const io = getIo();

  io.to(`account:${followingId}`).emit("publish:explore");

  // 9️⃣ Revalidate server-rendered data
  revalidatePath("/explore");

  return {
    success: true,
  };
};

export { makeFollow };
