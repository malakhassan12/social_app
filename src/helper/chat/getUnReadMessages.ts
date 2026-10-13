"use server";

import prisma from "@/lib/prisma";

const getUnreadMessages = async (
  conversationId: string,
  accountId: string,
) => {
  if (!conversationId || !accountId) {
    return {
      success: false,
      count: 0,
      errors: {
        message: "Conversation ID and Account ID are required",
      },
    };
  }

  const count = await prisma.message.count({
    where: {
      conversationId,
      senderId: {
        not: accountId,
      },
      messageReads: {
        none: {
          accountId,
        },
      },
    },
  });

  return {
    success: true,
    count,
  };
};

export default getUnreadMessages;