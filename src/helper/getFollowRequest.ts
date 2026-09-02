import prisma from "@/lib/prisma";

import { getAccountId } from "./getAccountId";

import { FollowRequestStatus } from "@/generated/prisma/enums";

const getFollowRequest = async () => {
  const accountId = await getAccountId();

  if (!accountId) {
    return [];
  }

  const requests = await prisma.followRequest.findMany({
    where: {
      receiverId: accountId,
      status: FollowRequestStatus.PENDING,
    },
    include: {
      requester: {
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          country: true,
        },
      },
    },
  });

  return requests;
};

export default getFollowRequest;
