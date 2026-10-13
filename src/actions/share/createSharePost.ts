"use server";
import { getAccountId } from "@/helper/account/getAccountId";
import prisma from "@/lib/prisma";
import { NOTIREQUEST } from "@/types/notification.Types";
import { Post } from "@/types/post.Types";
import { ShareResponse } from "@/types/share.Types";
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

  let shareId: string;

  if (share) {
    await prisma.share.delete({
      where: {
        id: share.id,
      },
    });
    shareId = share.id;

    res = {
      success: true,
      shared: false,
    };
  } else {
    const createdShare = await prisma.share.create({
      data: {
        postId: post?.id,
        shareFromId: post?.author?.id,
        shareToId: accountId,
      },
    });
    shareId = createdShare.id;
    res = {
      success: true,
      shared: true,
    };

    if (accountId !== createdShare.shareFromId) {
      const notification: NOTIREQUEST = {
        title: "New Share",
        content: "shared your post",
        creatorId: accountId,
        receiverId: createdShare.shareFromId,
        notificationType: NotificationType.SHARE,
      };

      await createNotification(notification);
    }
  }
  const io = getIo();

  io.to(`account:${accountId}`).emit("publish:post", {
    action: "shared",
    postId: post.id,
    shareId,
    shared: res.shared,
  });

  return res;
};

export default createSharePost;
