"use server";

import prisma from "@/lib/prisma";

const createConversation = async ({
  selectedAccountId,
  accountId,
}: {
  selectedAccountId: string;
  accountId: string;
}): Promise<string> => {
  if (!selectedAccountId || !accountId) {
    throw new Error("Account IDs are required");
  }

  if (selectedAccountId === accountId) {
    throw new Error("You cannot create a conversation with yourself");
  }

  // Check whether a direct conversation already exists
  const existingConversation = await prisma.conversation.findFirst({
    where: {
      type: "DIRECT",

      participants: {
        every: {
          accountId: {
            in: [accountId, selectedAccountId],
          },
        },
      },
    },

    select: {
      id: true,

      participants: {
        select: {
          accountId: true,
        },
      },
    },
  });

  if (existingConversation && existingConversation.participants.length === 2) {
    return existingConversation.id;
  }

  // Create a new direct conversation
  const conversation = await prisma.conversation.create({
    data: {
      type: "DIRECT",
      isOpen: true,

      participants: {
        create: [
          {
            accountId,
            isAdmin: false,
          },
          {
            accountId: selectedAccountId,
            isAdmin: false,
          },
        ],
      },
    },

    select: {
      id: true,
    },
  });


  return conversation.id;
};

export default createConversation;
