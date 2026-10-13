import { NotificationType } from "@/generated/prisma/enums";
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
      action: "created" | "updated" | "deleted" | "liked";
      postId: string;
      accountId?: string;
      liked?: boolean;
      likesCount?: number;
    };
    comment?: Partial<Comment>;
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

  // Followers
  for (const follower of followers) {
    receiverIds.add(follower.followerId);
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
      io.to(`account:${receiverId}`).emit("publish:comment", data?.comment);
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
