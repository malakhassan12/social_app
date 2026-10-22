"use server";
import { getAccountId } from "@/helper/account/getAccountId";
import prisma from "@/lib/prisma";
import { NOTIREQUEST } from "@/types/notification.Types";
import { Post } from "@/types/post.Types";
import { ShareResponse } from "@/types/share.Types";
import { createNotification } from "../notification/createNotification";
import { NotificationType } from "@/generated/prisma/enums";
import publishToFollowers from "../socket/publish-to-followers";
import { TypePublishSocket } from "@/lib/socket/socket.types";

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

  const postId = post.id;

  const postExist = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!postExist) {
    return {
      success: false,
      errors: {
        message: "Post not exist",
      },
    };
  }

  if (post.isPrivate) {
    return {
      success: false,
      errors: {
        message: "Can't make share on private account",
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
  const sharedCount = await prisma.share.count({
    where: { postId },
  });

  const postEvent = {
    action: "shared" as const,
    postId,
    accountId,
    shareId,
    shared: res.shared,
    sharedCount,
  };

  await publishToFollowers(accountId, TypePublishSocket.POST, { postEvent });

  if (postExist.accountId !== accountId) {
    await publishToFollowers(postExist.accountId, TypePublishSocket.POST, {
      postEvent,
    });
  }

  return { ...res, sharedCount };
};

export default createSharePost;
