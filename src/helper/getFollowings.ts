import prisma from "@/lib/prisma";
import { getAccountId } from "./getAccountId";

const getFollowings = async (
  accountId: string | undefined,
  pageInput: string | number,
) => {
  const finalAccountId = accountId ?? (await getAccountId());

  if (!finalAccountId) {
    return {
      followings: [],
      currentPage: 1,
      limit: 8,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }

  const page = Math.max(1, Number(pageInput) || 1);
  const limit = 8;
  const offset = (page - 1) * limit;

  const followings = await prisma.follower.findMany({
    where: { followerId: finalAccountId },
    select: {
      following: {
        select: {
          id: true,
          name: true,
          email: {
            select: {
              email: true,
            },
          },
          image: true,
          country: true,
          username: true,
          bio: true,
          website: true,
          type: true,
        },
      },
    },
    skip: offset,
    take: limit,
  });

  const total = await prisma.follower.count({
    where: {
      followerId: finalAccountId,
    },
  });

  const totalPages = Math.ceil(total / limit);
  const followingAccounts = followings.map((item) => item.following);

  return {
    followings: followingAccounts,
    currentPage: page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};

export default getFollowings;
