import {
  FollowRequestStatus,
  NotificationType,
} from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { getIo } from "@/lib/socket/getIo";
import { TypePublishSocket } from "@/lib/socket/socket.types";
import { Comment } from "@/types/comment.Types";
import { Post } from "@/types/post.Types";

const publishToFollowers = async (
  accountId: string,
  type?: TypePublishSocket,
  data?: {
    post?: Post;
    postEvent?: {
      action:
        | "created"
        | "updated"
        | "deleted"
        | "liked"
        | "shared"
        | "disable-comments:posts"
        | "disable-comments:post";
      postId?: string;
      accountId?: string;
      liked?: boolean;
      likesCount?: number;
      shared?: boolean;
      shareId?: string;
      sharedCount?: number;
      isOpenComments?: boolean;
    };
    comment?: Partial<Comment>;
    commentsCount?: number;
    commentLike?: {
      commentId: string;
      accountId: string;
      commentOwnerId: string;
      liked: boolean;
      likesCount: number;
    };
  },
) => {
  const followers = await prisma.follower.findMany({
    where: {
      followingId: accountId,
    },
    select: {
      followerId: true,
    },
  });

  const io = getIo();

  const receiverIds = new Set<string>();

  // Owner
  receiverIds.add(accountId);

  if (data?.postEvent?.accountId) {
    receiverIds.add(data.postEvent.accountId);
  }

  if (data?.comment?.accountId) {
    receiverIds.add(data.comment.accountId);
  }

  // Followers
  for (const follower of followers) {
    receiverIds.add(follower.followerId);
  }

  if (
    type === TypePublishSocket.POST &&
    (data?.postEvent?.action === "disable-comments:post" ||
      data?.postEvent?.action === "disable-comments:posts")
  ) {
    const friendships = await prisma.followRequest.findMany({
      where: {
        status: FollowRequestStatus.ACCEPTED,
        OR: [{ requesterId: accountId }, { receiverId: accountId }],
      },
      select: {
        requesterId: true,
        receiverId: true,
      },
    });

    for (const friendship of friendships) {
      receiverIds.add(
        friendship.requesterId === accountId
          ? friendship.receiverId
          : friendship.requesterId,
      );
    }
  }

  if (type === TypePublishSocket.COMMENT_LIKE && data?.commentLike) {
    receiverIds.add(data.commentLike.accountId);
    receiverIds.add(data.commentLike.commentOwnerId);
  }

  if (
    type === TypePublishSocket.POST &&
    data?.post &&
    (!data.postEvent || data.postEvent.action === "created")
  ) {
    const post = data.post;
    // 1. إنشاء كل الإشعارات دفعة واحدة (batch insert) بدل loop
    await prisma.notification.createMany({
      data: [...receiverIds].map((receiverId: string) => ({
        title: "New Post",
        content: "published a post",
        creatorId: accountId,
        receiverId,
        postId: post.id,
        notificationType: NotificationType.PUBLISHED,
      })),
    });
  }

  for (const receiverId of receiverIds) {
    if (type === TypePublishSocket.POST) {
      // if (data?.post) {
      //   const notification: NOTIREQUEST = {
      //     title: "New Post",
      //     content: "published a post",
      //     creatorId: accountId,
      //     receiverId,
      //     postId: data.post.id,
      //     notificationType: NotificationType.PUBLISHED,
      //   };

      //   await createNotification(notification);
      // }

      const postEvent =
        data?.postEvent ??
        (data?.post
          ? { action: "created" as const, postId: data.post.id }
          : undefined);

      if (postEvent) {
        io.to(`account:${receiverId}`).emit("publish:post", postEvent);
      }
    }

    if (type === TypePublishSocket.COMMENT) {
      io.to(`account:${receiverId}`).emit("publish:comment", {
        ...data?.comment,
        commentsCount: data?.commentsCount,
      });
    }

    if (type === TypePublishSocket.COMMENT_LIKE && data?.commentLike) {
      io.to(`account:${receiverId}`).emit(
        "publish:comment-like",
        data.commentLike,
      );
    }

    if (type === TypePublishSocket.LIKE) {
      io.to(`account:${receiverId}`).emit("publish:like");
    }
  }
};

export default publishToFollowers;
