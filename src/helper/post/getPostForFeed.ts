"use server";

import { FollowRequestStatus } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { getAccountId } from "@/helper/account/getAccountId";
import { Post } from "@/types/post.Types";

const getPostForFeed = async (postId: string) => {
  const accountId = await getAccountId();

  if (!accountId) return null;

  const [followings, friendships] = await Promise.all([
    prisma.follower.findMany({
      where: { followerId: accountId },
      select: { followingId: true },
    }),
    prisma.followRequest.findMany({
      where: {
        OR: [{ requesterId: accountId }, { receiverId: accountId }],
        status: FollowRequestStatus.ACCEPTED,
      },
      select: { requesterId: true, receiverId: true },
    }),
  ]);

  const followingIds = followings.map(({ followingId }) => followingId);
  const friendIds = friendships.map(({ requesterId, receiverId }) =>
    requesterId === accountId ? receiverId : requesterId,
  );

  const post = await prisma.post.findFirst({
    where: {
      id: postId,
      OR: [
        { accountId },
        { accountId: { in: friendIds } },
        { accountId: { in: followingIds }, isPrivate: false },
      ],
    },
    include: {
      author: {
        select: {
          id: true,
          email: { select: { email: true } },
          username: true,
          name: true,
          image: true,
        },
      },
      likes: {
        where: { accountId },
        select: { id: true },
      },
      shares: {
        where: { shareToId: accountId },
        select: { id: true },
      },
      _count: {
        select: {
          comments: { where: { isRemoved: false } },
          likes: true,
          shares: true,
        },
      },
    },
  });

  if (!post) return null;

  const { likes, shares, ...postData } = post;
  const postWithSocialState = {
    ...postData,
    isLiked: likes.length > 0,
    isShared: shares.length > 0,
    sharedCount: post._count.shares,
  };

  return {
    type: "POST" as const,
    id: post.id,
    createdAt: post.createdAt,
    post: postWithSocialState as unknown as Post,
  };
};

export default getPostForFeed;
