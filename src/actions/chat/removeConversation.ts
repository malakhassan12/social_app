"use server";

import prisma from "@/lib/prisma";

const removeConversation = async (
  conversationId: string,
  accountId: string,
) => {
  try {
    // =====================================================
    // Validation
    // =====================================================

    if (!conversationId) {
      return {
        success: false,
        message: "Conversation ID is required",
      };
    }

    if (!accountId) {
      return {
        success: false,
        message: "Account ID is required",
      };
    }

    // =====================================================
    // Get conversation
    // =====================================================

    const conversation =
      await prisma.conversation.findUnique({
        where: {
          id: conversationId,
        },

        select: {
          id: true,
          type: true,
          ownerId: true,
          isRemoved: true,
        },
      });

    if (!conversation) {
      return {
        success: false,
        message: "Conversation not found",
      };
    }

    // =====================================================
    // Already removed
    // =====================================================

    if (conversation.isRemoved) {
      return {
        success: false,
        message:
          "Conversation has already been removed",
      };
    }

    // =====================================================
    // Only owner can remove conversation
    // =====================================================

    if (conversation.ownerId !== accountId) {
      return {
        success: false,
        message:
          "Only the group owner can remove this conversation",
      };
    }

    // =====================================================
    // Soft remove conversation
    // =====================================================

    await prisma.conversation.update({
      where: {
        id: conversationId,
      },

      data: {
        isRemoved: true,
      },
    });

    // =====================================================
    // Result
    // =====================================================

    return {
      success: true,
      message:
        "Conversation removed successfully",
    };
  } catch (error) {
    console.error(
      "removeConversation error:",
      error,
    );

    return {
      success: false,
      message:
        "Failed to remove conversation",
    };
  }
};

export default removeConversation;