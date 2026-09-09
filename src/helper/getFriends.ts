import { FollowRequestStatus } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { getAccountId } from "./getAccountId";

const getFriends = async (
  accountId: string | undefined,
  pageInput: string | number,
) => {
  const finalAccountId = accountId ?? (await getAccountId());
  if (!finalAccountId) {
    return {
      friends: [],
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

  const requests = await prisma.followRequest.findMany({
    where: {
      OR: [
        {
          receiverId: finalAccountId,
        },
        {
          requesterId: finalAccountId,
        },
      ],
      status: FollowRequestStatus.ACCEPTED,
    },
    select: {
      receiver: {
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

      requester: {
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

  const total = await prisma.followRequest.count({
    where: {
      OR: [
        {
          receiverId: finalAccountId,
        },
        {
          requesterId: finalAccountId,
        },
      ],
      status: FollowRequestStatus.ACCEPTED,
    },
  });

  const totalPages = Math.ceil(total / limit);

  const friends = requests.map((friendship) => {
    return friendship.receiver.id === finalAccountId
      ? friendship.requester
      : friendship.receiver;
  });

  return {
    friends,
    currentPage: page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};

export default getFriends;
