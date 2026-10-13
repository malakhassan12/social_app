"use server";
import { getAccountId } from "@/helper/account/getAccountId";
import prisma from "@/lib/prisma";
import { getIo } from "@/lib/socket/getIo";
import { revalidatePath } from "next/cache";

const deleteNoti = async (notificationId: string) => {
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
    const noti = await prisma.notification.findFirst({
      where: {
        id: notificationId,
      },
    });

    if (!noti) {
      return {
        success: false,
        errors: {
          message: "Not exist Notification to delete ",
        },
      };
    }

    if (noti.receiverId !== accountId) {
      return {
        success: false,
        errors: {
          message: "Not authorize to delete that notification ",
        },
      };
    }
    await prisma.notification.delete({
      where: { id: notificationId },
    });

    revalidatePath("/notification");

    const io = getIo();

    io.to(`account:${accountId}`).emit("publish:notification");

    return {
      success: true,
      message: "Deleted notification successfully",
    };
  } catch (error) {
    // console.log(error);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
};

export { deleteNoti };
