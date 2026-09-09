import { FollowRequestStatus } from "@/generated/prisma/enums";

import prisma from "@/lib/prisma";

import { getAccountId } from "./getAccountId";

const getPosts = async (
  pageInput: string | number,
  accountId?: string,
) => {
  const finalAccountId = accountId ?? (await getAccountId());

  const limit = 10;

  if (!finalAccountId) {
    return {
      posts: [],
      currentPage: 1,
      limit,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }

  const page = Math.max(1, Number(pageInput) || 1);

  const offset = (page - 1) * limit;

  /*
   * -------------------------------------------------------
   * 1. Get people I follow
   * -------------------------------------------------------
   */

  const followings = await prisma.follower.findMany({
    where: {
      followerId: finalAccountId,
    },
    select: {
      followingId: true,
    },
  });

  const followingIds = followings.map(
    (follow) => follow.followingId,
  );

  /*
   * -------------------------------------------------------
   * 2. Get my accepted friends
   * -------------------------------------------------------
   */

  const friendships = await prisma.followRequest.findMany({
    where: {
      OR: [
        {
          requesterId: finalAccountId,
        },
        {
          receiverId: finalAccountId,
        },
      ],
      status: FollowRequestStatus.ACCEPTED,
    },
    select: {
      requesterId: true,
      receiverId: true,
    },
  });

  const friendIds = friendships.map((friendship) =>
    friendship.requesterId === finalAccountId
      ? friendship.receiverId
      : friendship.requesterId,
  );

  /*
   * -------------------------------------------------------
   * 3. Common post filter
   * -------------------------------------------------------
   *
   * My posts       → public + private
   * Friends' posts → public + private
   * Following      → public only
   */

  const where = {
    OR: [
      // My posts
      {
        accountId: finalAccountId,
      },

      // Friends' posts
      {
        accountId: {
          in: friendIds,
        },
      },

      // Following's public posts
      {
        accountId: {
          in: followingIds,
        },
        isPrivate: false,
      },
    ],
  };

  /*
   * -------------------------------------------------------
   * 4. Get paginated posts
   * -------------------------------------------------------
   */

  const posts = await prisma.post.findMany({
    where,

    orderBy: {
      createdAt: "desc",
    },

    skip: offset,
    take: limit,

    include: {
      author: {
        select: {
          id: true,
          email: {
            select: {
              email: true,
            },
          },
          username: true,
          name: true,
          image: true,
        },
      },
    },
  });

  /*
   * -------------------------------------------------------
   * 5. Get total number of posts
   * -------------------------------------------------------
   */

  const total = await prisma.post.count({
    where,
  });

  /*
   * -------------------------------------------------------
   * 6. Pagination information
   * -------------------------------------------------------
   */

  const totalPages = Math.ceil(total / limit);

  return {
    posts,
    currentPage: page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};

export default getPosts;