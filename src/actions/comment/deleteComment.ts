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
      include: {
        post: {
          select: {
            accountId: true,
          },
        },
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

    const removedComment = await prisma.comment.update({
      where: {
        id: comment.id,
      },
      data: {
        isRemoved: true,
        removedAt: new Date(),
      },
    });
    const commentsCount = await prisma.comment.count({
      where: {
        postId: commentExist.postId,
        isRemoved: false,
      },
    });

    revalidatePath(`/api/comment/${commentExist.postId}`);

    await publishToFollowers(
      commentExist.post.accountId,
      TypePublishSocket.COMMENT,
      {
        comment: removedComment as unknown as Comment,
        commentsCount,
      },
    );

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
