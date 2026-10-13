"use server";

import prisma from "@/lib/prisma";


const updateCommentsSetting = async (
  accountId: string,
  formData: FormData,
) => {
  try {
    // =====================================================
    // Validation
    // =====================================================

    if (!accountId) {
      return {
        success: false,
        message: "Account ID is required",
      };
    }


    // =====================================================
    // Get FormData
    // =====================================================

    const rawAllowAllComments =
      formData.get("allowAllComments");

    const allowAllComments =
      rawAllowAllComments === "true";

    // =====================================================
    // Get current account
    // =====================================================

    const account =
      await prisma.account.findUnique({
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

    // =====================================================
    // Update Account
    // =====================================================

      await prisma.account.update({
        where: {
          id: accountId,
        },
        data: {
          isOpenComments: allowAllComments,
        },
        select: {
          id: true,
          isOpenComments: true,
        },
      });

    // =====================================================
    // Result
    // =====================================================

    return {
      success: true,
      message: allowAllComments
        ? "Comments are now allowed on all posts"
        : "Comments are now disabled on all posts",
    };
  } catch (error) {
    console.error(
      "updateCommentsSetting error:",
      error,
    );

    return {
      success: false,
      message:
        "Failed to update comments setting",
    };
  }
};

export default updateCommentsSetting;