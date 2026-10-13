"use server";

import { NotificationType } from "@/generated/prisma/enums";
import { getAccountId } from "@/helper/account/getAccountId";
import prisma from "@/lib/prisma";
import { getIo } from "@/lib/socket/getIo";
import { NOTIREQUEST } from "@/types/notification.Types";
import { revalidatePath } from "next/cache";

const createNotification = async (notification: NOTIREQUEST) => {
  const accountId = await getAccountId();

  if (!accountId) {
    return {
      success: false,
      errors: {
        message: "Unauthorized",
      },
    };
  }

  try {
    let creatorId = notification.creatorId;

    if (notification.notificationType == NotificationType.PUBLISHED) {
      creatorId = accountId;
    }
    await prisma.notification.create({
      data: {
        title: notification.title,

        content: notification.content,

        notificationType: notification.notificationType,

        receiverId: notification.receiverId,

        creatorId: creatorId,

        postId: notification.postId,
      },
    });

    const io = getIo();

    io.to(`account:${notification.receiverId}`).emit("publish:notification");
    revalidatePath("/notification");

    return {
      success: true,
      message: "Notification created successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
};

export { createNotification };
