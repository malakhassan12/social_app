"use server";

import {
  ConversationType,
} from "@/generated/prisma/enums";

import prisma from "@/lib/prisma";

const getConversation = async (
  profileId: string,
  accountId: string,
) => {
  try {
    // =====================================
    // 1. Validate IDs
    // =====================================

    if (
      !profileId ||
      typeof profileId !== "string"
    ) {
      return {
        success: false,
        errors: {
          message:
            "Invalid profile account ID",
        },
      };
    }

    if (
      !accountId ||
      typeof accountId !== "string"
    ) {
      return {
        success: false,
        errors: {
          message:
            "Invalid account ID",
        },
      };
    }

    // =====================================
    // 2. Make sure IDs are not empty
    // =====================================

    if (
      !profileId.trim() ||
      !accountId.trim()
    ) {
      return {
        success: false,
        errors: {
          message:
            "Account IDs are required",
        },
      };
    }

    // =====================================
    // 3. Cannot get conversation
    //    with yourself
    // =====================================

    if (profileId === accountId) {
      return {
        success: false,
        errors: {
          message:
            "You cannot message yourself",
        },
      };
    }

    // =====================================
    // 4. Verify profile account exists
    // =====================================

    const profile =
      await prisma.account.findUnique({
        where: {
          id: profileId,
        },

        select: {
          id: true,
        },
      });

    if (!profile) {
      return {
        success: false,
        errors: {
          message:
            "Profile account not found",
        },
      };
    }

    // =====================================
    // 5. Verify current account exists
    // =====================================

    const account =
      await prisma.account.findUnique({
        where: {
          id: accountId,
        },

        select: {
          id: true,
        },
      });

    if (!account) {
      return {
        success: false,
        errors: {
          message:
            "Account not found",
        },
      };
    }

    // =====================================
    // 6. Find DIRECT conversation
    // =====================================

    const conversation =
      await prisma.conversation.findFirst({
        where: {
          type:
            ConversationType.DIRECT,

          isRemoved: false,

          AND: [
            {
              participants: {
                some: {
                  accountId:
                    profileId,
                },
              },
            },
            {
              participants: {
                some: {
                  accountId:
                    accountId,
                },
              },
            },
          ],
        },

        select: {
          id: true,
        },
      });

    // =====================================
    // 7. No conversation found
    // =====================================

    if (!conversation) {
      return {
        success: true,
        conversationId: null,
      };
    }

    // =====================================
    // 8. Success
    // =====================================

    return {
      success: true,
      conversationId:
        conversation.id,
    };
  } catch (error) {
    console.error(
      "getConversation error:",
      error,
    );

    return {
      success: false,
      errors: {
        message:
          "Failed to get conversation",
      },
    };
  }
};

export default getConversation;