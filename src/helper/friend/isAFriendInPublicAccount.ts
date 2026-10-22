"use server";

import prisma from "@/lib/prisma";
import { getAccountId } from "../account/getAccountId";
import { FollowRequestStatus } from "@/generated/prisma/enums";

const isAFriendInPublicAccount = async (profileId: string) => {
  try {
    // =====================================
    // 1. Validate profileId
    // =====================================

    if (!profileId) {
      return false;
    }

    // =====================================
    // 2. Get current account
    // =====================================

    const accountId = await getAccountId();

    if (!accountId) {
      return false;
    }

    // =====================================
    // 3. Same account
    // =====================================

    if (accountId === profileId) {
      return true;
    }

    // =====================================
    // 4. Get profile account type
    // =====================================

    const profile = await prisma.account.findUnique({
      where: {
        id: profileId,
      },

      select: {
        type: true,
      },
    });

    if (!profile) {
      return false;
    }

    

    
    // =====================================
    // 6. Private account
    // =====================================

    const friendship = await prisma.followRequest.findFirst({
      where: {
        status: FollowRequestStatus.ACCEPTED,

        OR: [
          {
            requesterId: accountId,
            receiverId: profileId,
          },
          {
            requesterId: profileId,
            receiverId: accountId,
          },
        ],
      },

      select: {
        id: true,
      },
    });

    return Boolean(friendship);
  } catch (error) {
    console.error("isAFriend error:", error);

    return false;
  }
};

export default isAFriendInPublicAccount;
