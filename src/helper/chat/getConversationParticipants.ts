"use server";

import { ConversationParticipantType } from "@/generated/prisma/enums";
import { getAccountId } from "@/helper/account/getAccountId";
import prisma from "@/lib/prisma";

const getConversationParticipants = async (conversationId: string) => {
  const accountId = await getAccountId();

  if (!accountId || !conversationId) {
    return {
      success: false as const,
      message: "Conversation is unavailable",
    };
  }

  try {
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        participants: {
          some: {
            accountId,
            type: ConversationParticipantType.EXIST,
          },
        },
      },
      select: {
        participants: {
          where: {
            type: ConversationParticipantType.EXIST,
          },
          select: {
            id: true,
            conversationId: true,
            accountId: true,
            joinedAt: true,
            isAdmin: true,
            account: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!conversation) {
      return {
        success: false as const,
        message: "Conversation is unavailable",
      };
    }

    return {
      success: true as const,
      participants: conversation.participants,
    };
  } catch (error) {
    console.error("getConversationParticipants error:", error);

    return {
      success: false as const,
      message: "Failed to load conversation participants",
    };
  }
};

export default getConversationParticipants;
