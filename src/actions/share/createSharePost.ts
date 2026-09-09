"use server";
import { getAccountId } from "@/helper/getAccountId";
import prisma from "@/lib/prisma";
import { NOTIREQUEST } from "@/types/notification.Types";
import { Post } from "@/types/post.Types";
import { ShareResponse } from "@/types/share.Types";
import { revalidatePath } from "next/cache";
import { createNotification } from "../notification/createNotification";
import { NotificationType } from "@/generated/prisma/enums";
import { getIo } from "@/lib/socket/getIo";

const createSharePost = async (post: Post) => {
  const accountId = await getAccountId();

  if (!accountId) {
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
      shareToId: accountId,
    },
  });

  let shareFromId;

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
    shareFromId = share.shareFromId;
  } else {
    const share = await prisma.share.create({
      data: {
        postId: post?.id,
        shareFromId: post?.author?.id,
        shareToId: accountId,
      },
    });
    res = {
      success: true,
      shared: true,
    };

    shareFromId = share.shareFromId;

    if (accountId !== share.shareFromId) {
      const notification: NOTIREQUEST = {
        title: "New Share",
        content: "shared your post",
        creatorId: accountId,
        receiverId: share.shareFromId,
        notificationType: NotificationType.SHARE,
      };

      await createNotification(notification);
    }
  }
  const io = getIo();

  io.to(`account:${shareFromId}`).emit("publish:post");

  revalidatePath(`/api/post/${post?.id}`);

  return res;
};

export default createSharePost;
