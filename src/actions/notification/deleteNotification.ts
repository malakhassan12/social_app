"use server";
import { getUserId } from "@/helper/getUserId";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const deleteNoti = async (notificationId: string) => {
  const userId = await getUserId();

  if (!userId) {
    return {
      message: "Unauthorized",
      success: false,
    };
  }

  try {
    await prisma.notification.delete({
      where: { id: notificationId },
    });
    revalidatePath("/notification");

    return {
      success: true,
      message: "Deleted notification successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
};

export { deleteNoti };
