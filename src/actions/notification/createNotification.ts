"use server";

import { NotificationType } from "@/generated/prisma/enums";
import { getUserId } from "@/helper/getUserId";
import prisma from "@/lib/prisma";
import { NOTIREQUEST } from "@/types/notification.Types";
import { revalidatePath } from "next/cache";

const createNotification = async (notification: NOTIREQUEST) => {
  const userId = await getUserId();

  if (!userId) {
    return {
      message: "Unauthorized",
      success: false,
    };
  }

  try {
    let creatorId = notification.creatorId;

    if (notification.notificationType == NotificationType.PUBLISHED) {
      creatorId = userId;
    }
    await prisma.notification.create({
      data: {
        title: notification.title,

        content: notification.content,

        notificationType: notification.notificationType,

        userId: notification.userId,

        creatorId: creatorId,

        postId: notification.postId,
      },
    });
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
