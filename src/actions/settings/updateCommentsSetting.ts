"use server";

import prisma from "@/lib/prisma";
import publishToFollowers from "../socket/publish-to-followers";
import { TypePublishSocket } from "@/lib/socket/socket.types";

const updateCommentsSetting = async (accountId: string, formData: FormData) => {
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

    const rawAllowAllComments = formData.get("allowAllComments");

    const allowAllComments = rawAllowAllComments === "on";

    console.log(
      "Form data open comments: ",
      rawAllowAllComments,
      typeof rawAllowAllComments,
    );

    /*
    
    Form data open comments:  null object
    Form data open comments:  on string

    */

    // =====================================================
    // Get current account
    // =====================================================

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

    await prisma.post.updateMany({
      where: {
        accountId,
      },
      data: {
        isOpenComments: allowAllComments,
      },
    });

    await publishToFollowers(accountId, TypePublishSocket.POST, {
      postEvent: {
        action: "disable-comments:posts",
        accountId,
        isOpenComments: allowAllComments,
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
    console.error("updateCommentsSetting error:", error);

    return {
      success: false,
      message: "Failed to update comments setting",
    };
  }
};

export default updateCommentsSetting;
