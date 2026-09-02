"use server";

import { getAccountId } from "@/helper/getAccountId";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
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
    await prisma.post.delete({
      where: {
        id: postId,
      },
    });
    await publishToFollowers(accountId , TypePublishSocket.POST);

    revalidatePath(`/api/post`);

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
    };
  }
};
