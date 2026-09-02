"use server";

import { getAccountId } from "@/helper/getAccountId";
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
    await prisma.comment.delete({
      where: { id: comment?.id },
    });

    revalidatePath(`/api/comment/${comment?.postId}`);

    await publishToFollowers(accountId, TypePublishSocket.COMMENT);

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
