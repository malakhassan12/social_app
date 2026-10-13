"use server";

import prisma from "@/lib/prisma";

const updateChattingMessages = async (accountId: string, checked: boolean) => {
  try {
    if (!accountId) {
      return {
        success: false,
        message: "Account ID is required",
      };
    }

    const account = await prisma.account.findUnique({
      where: {
        id: accountId,
      },
      select: {
        id: true,
      },
    });

    if (!account) {
      return {
        success: false,
        message: "Account not found",
      };
    }

    await prisma.account.update({
      where: {
        id: accountId,
      },
      data: {
        isOpenMessages: checked,
      },
    });

    return {
      success: true,
      message: checked
        ? "Messages are now allowed"
        : "Messages are now disabled",
    };
  } catch (error) {
    console.error("updateChattingMessages error:", error);

    return {
      success: false,
      message: "Failed to update messages setting",
    };
  }
};

export default updateChattingMessages;
