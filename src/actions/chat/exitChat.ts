"use server";

import prisma from "@/lib/prisma";

type ExitChatResult = {
  success: boolean;
  message?: string;
};

const exitChat = async (
  accountId: string,
  conversationId: string,
): Promise<ExitChatResult> => {
  if (!accountId) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  if (!conversationId) {
    return {
      success: false,
      message: "Conversation Id should exist",
    };
  }

  try {
    /*
     * Check that the conversation exists.
     */
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      select: {
        id: true,
        type: true,
      },
    });

    if (!conversation) {
      return {
        success: false,
        message: "Conversation not found",
      };
    }

    /*
     * Check that the account is actually
     * a participant in this conversation.
     */
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_accountId: {
          conversationId,
          accountId,
        },
      },
      select: {
        id: true,
        accountId: true,
        isAdmin: true,
      },
    });

    if (!participant) {
      return {
        success: false,
        message: "You are not a participant in this conversation",
      };
    }

    /*
     * Remove only the current account
     * from the conversation.
     *
     * Messages and the conversation itself
     * are NOT deleted.
     */
    await prisma.conversationParticipant.delete({
      where: {
        conversationId_accountId: {
          conversationId,
          accountId,
        },
      },
    });

    return {
      success: true,
      message: "You left the conversation",
    };
  } catch (error) {
    console.error("exitChat error:", error);

    return {
      success: false,
      message: "Failed to leave the conversation",
    };
  }
};

export default exitChat;
