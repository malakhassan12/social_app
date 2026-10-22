"use server";

import { getAccountId } from "@/helper/account/getAccountId";
import prisma from "@/lib/prisma";
import { Comment } from "@/types/comment.Types";
import {
  CommentErrors,
  validateCreateComment,
} from "@/utils/commentValidation";
import { revalidatePath } from "next/cache";
import publishToFollowers from "../socket/publish-to-followers";
import { TypePublishSocket } from "@/lib/socket/socket.types";

const updateComment = async (comment: Comment, formData: FormData) => {
  const accountId = await getAccountId();

  if (!accountId) {
    return {
      success: false,
      errors: {
        message: "Unauthorized",
      },
    };
  }

  const content = formData.get("content") as string;

  const errors: CommentErrors = {};

  validateCreateComment(comment?.postId, content, errors);

  if (Object.keys(errors).length) {
    return {
      success: false,
      errors,
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

    const commentUpdated = await prisma.comment.update({
      where: {
        id: comment.id,
        postId: comment?.postId,
      },
      data: {
        content,
      },
      include: {
        author: {
          select: {
            id : true,
            username: true,
            image: true,
          },
        },
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
        comment: commentUpdated as unknown as Comment,
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

export { updateComment };
