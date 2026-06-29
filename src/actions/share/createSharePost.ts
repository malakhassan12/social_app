"use server";
import { getUserId } from "@/helper/getUserId";
import prisma from "@/lib/prisma";
import { Post } from "@/types/post.Types";
import { ShareResponse } from "@/types/share.Types";
import { revalidatePath } from "next/cache";

const createSharePost = async (post: Post) => {
  const userId = (await getUserId()) as string;

  if (!userId) {
    return {
      success: false,
      errors: {
        message: "Unauthorized",
      },
    };
  }

  let res: ShareResponse;

  const share = await prisma.share.findFirst({
    where: {
      postId: post?.id,
      shareToId: userId,
    },
  });

  if (share) {
    await prisma.share.delete({
      where: {
        id: share.id,
      },
    });

    res = {
      success: true,
      shared: false,
    };
  } else {
    await prisma.share.create({
      data: {
        postId: post?.id,
        shareFromId: post?.author?.id,
        shareToId: userId,
      },
    });
    res = {
      success: true,
      shared: true,
    };
  }
  revalidatePath(`/api/post/${post?.id}`);

  return res;
};

export default createSharePost;
