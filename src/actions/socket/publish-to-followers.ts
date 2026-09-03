import { NotificationType } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { getIo } from "@/lib/socket/getIo";
import { TypePublishSocket } from "@/lib/socket/socket.types";
import { NOTIREQUEST } from "@/types/notification.Types";
import { createNotification } from "../notification/createNotification";
import { Post } from "@/types/post.Types";

const publishToFollowers = async (
  accountId: string,
  type?: TypePublishSocket,
  data?: {
    post?: Post;
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

  for (const receiverId of receiverIds) {
    if (type === TypePublishSocket.POST) {
      if (data?.post) {
        const notification: NOTIREQUEST = {
          title: "New Post",
          content: "published a post",
          creatorId: accountId,
          receiverId,
          postId: data.post.id,
          notificationType: NotificationType.PUBLISHED,
        };

        await createNotification(notification);
      }

      io.to(`account:${receiverId}`).emit("publish:post");
    }

    if (type === TypePublishSocket.COMMENT) {
      io.to(`account:${receiverId}`).emit("publish:comment");
      console.log('Publish Comment')
    }

    if (type === TypePublishSocket.LIKE) {
      io.to(`account:${receiverId}`).emit("publish:like");
    }
  }
};

export default publishToFollowers;
