"use server";

import prisma from "@/lib/prisma";
import { TypePublishSocket } from "@/lib/socket/socket.types";
import publishToFollowers from "../socket/publish-to-followers";

const disableComments = async (
  postId: string,
  accountId: string,
  isOpenComments: boolean,
) => {
  try {
    // =====================================
    // 1. Check account
    // =====================================

    if (!accountId) {
      return {
        success: false,
        errors: {
          message: "Unauthorized",
        },
      };
    }

    // =====================================
    // 2. Get post
    // =====================================

    const post = await prisma.post.findFirst({
      where: {
        id: postId,
      },

      select: {
        id: true,
        accountId: true,
      },
    });

    if (!post) {
      return {
        success: false,
        errors: {
          message: "Post not found",
        },
      };
    }

    // =====================================
    // 3. Check ownership
    // =====================================

    if (accountId !== post.accountId) {
      return {
        success: false,
        errors: {
          message: "You are not allowed to modify this post",
        },
      };
    }

    // =====================================
    // 4. Toggle comments
    // =====================================

    const newIsOpenComments = !isOpenComments;

    await prisma.post.update({
      where: {
        id: postId,
      },

      data: {
        isOpenComments: newIsOpenComments,
      },
    });

    await publishToFollowers(accountId, TypePublishSocket.POST, {
      postEvent: {
        action: "disable-comments:post",
        postId: post.id,
        isOpenComments: newIsOpenComments,
      },
    });

    // =====================================
    // 5. Success
    // =====================================

    return {
      success: true,
      isOpenComments: newIsOpenComments,
      message: newIsOpenComments
        ? "Comments enabled successfully"
        : "Comments disabled successfully",
    };
  } catch (error) {
    console.error("disableComments error:", error);

    return {
      success: false,
      errors: {
        message: "Failed to update comments",
      },
    };
  }
};

export default disableComments;
