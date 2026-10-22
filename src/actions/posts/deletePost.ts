"use server";

import { getAccountId } from "@/helper/account/getAccountId";
import prisma from "@/lib/prisma";
import publishToFollowers from "../socket/publish-to-followers";
import { TypePublishSocket } from "@/lib/socket/socket.types";

export const deletePost = async (postId: string) => {
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
    const post = await prisma.post.findFirst({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return {
        success: false,
        errors: {
          message: "Not exist post ",
        },
      };
    }

    if (post.accountId !== accountId) {
      return {
        success: false,
        errors: {
          message: "Not authorize to delete that post ",
        },
      };
    }

    await prisma.post.update({
      where: {
        id: postId,
      },
      data:{
        isRemoved : true
      }
    });
    await publishToFollowers(accountId, TypePublishSocket.POST, {
      postEvent: {
        action: "deleted",
        postId,
      },
    });

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
    };
  }
};
