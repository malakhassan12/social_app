"use server";

import prisma from "@/lib/prisma";

const updateChattingGroups = async (accountId: string, checked: boolean) => {
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
        isOpenGroup: checked,
      },
    });

    return {
      success: true,
      message: checked
        ? "Group additions are now allowed"
        : "Group additions are now disabled",
    };
  } catch (error) {
    console.error("updateChattingGroups error:", error);

    return {
      success: false,
      message: "Failed to update group setting",
    };
  }
};

export default updateChattingGroups;
