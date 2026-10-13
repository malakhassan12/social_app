"use server";

import { getAccountId } from "@/helper/account/getAccountId";
import prisma from "@/lib/prisma";
import { Comment } from "@/types/comment.Types";
import { revalidatePath } from "next/cache";
import publishToFollowers from "../socket/publish-to-followers";
import { TypePublishSocket } from "@/lib/socket/socket.types";

const deleteComment = async (comment: Comment) => {
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
    const commentExist = await prisma.comment.findFirst({
      where: {
        id: comment.id,
      },
    });

    if (!commentExist) {
      return {
        success: false,
        errors: {
          message: "Not exist Comment ",
        },
      };
    }

    if (commentExist.accountId !== accountId) {
      return {
        success: false,
        errors: {
          message: "Not authorize to delete that comment ",
        },
      };
    }

    if (comment?.id) {
      await prisma.comment.update({
        where: {
          id: comment.id,
        },
        data: {
          isRemoved: true,
          removedAt: new Date(),
        },
      });
    }
    revalidatePath(`/api/comment/${comment?.postId}`);

    await publishToFollowers(accountId, TypePublishSocket.COMMENT, {
      comment: commentExist as unknown as Comment,
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

export { deleteComment };
