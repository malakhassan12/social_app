"use server";

import prisma from "@/lib/prisma";
import { getIo } from "@/lib/socket/getIo";
import { revalidatePath } from "next/cache";
import { ConversationParticipantType } from "@/generated/prisma/enums";

const toggleParticipantAdmin = async (
  accountId: string,
  conversationId: string,
  currentAccountId: string,
) => {
  try {
    // =====================================================
    // Validation
    // =====================================================

    if (!accountId) {
      return {
        success: false,
        message: "Account ID is required",
      };
    }

    if (!conversationId) {
      return {
        success: false,
        message: "Conversation ID is required",
      };
    }

    // =====================================================
    // Current authenticated account
    // =====================================================

    if (!currentAccountId) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    // =====================================================
    // Prevent changing yourself
    // =====================================================

    if (currentAccountId === accountId) {
      return {
        success: false,
        message: "You cannot change your own admin role",
      };
    }

    // =====================================================
    // Get conversation + participants
    // =====================================================

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },

      select: {
        id: true,
        type: true,
        ownerId: true,

        participants: {
          select: {
            id: true,
            accountId: true,
            isAdmin: true,
            type: true,
          },
        },
      },
    });

    if (!conversation) {
      return {
        success: false,
        message: "Conversation not found",
      };
    }

    // =====================================================
    // Group only
    // =====================================================

    if (conversation.type !== "GROUP") {
      return {
        success: false,
        message: "Only group conversations can have admins",
      };
    }

    // =====================================================
    // Current participant
    // =====================================================

    const currentParticipant = conversation.participants.find(
      (participant) =>
        participant.accountId === currentAccountId &&
        participant.type === ConversationParticipantType.EXIST,
    );

    if (!currentParticipant) {
      return {
        success: false,
        message: "You are not a participant in this conversation",
      };
    }

    // =====================================================
    // Admin only
    // =====================================================

    if (!currentParticipant.isAdmin) {
      return {
        success: false,
        message: "Only an admin can change admin roles",
      };
    }

    // =====================================================
    // Target participant
    // =====================================================

    const targetParticipant = conversation.participants.find(
      (participant) =>
        participant.accountId === accountId &&
        participant.type === ConversationParticipantType.EXIST,
    );

    if (!targetParticipant) {
      return {
        success: false,
        message: "Participant not found in this conversation",
      };
    }

    // =====================================================
    // Real owner protection
    //
    // The original owner must always remain an admin.
    // =====================================================

    if (conversation.ownerId === targetParticipant.accountId) {
      return {
        success: false,
        message: "The group owner must remain an admin",
      };
    }

    // =====================================================
    // Toggle admin
    // =====================================================

    const newAdminStatus = !targetParticipant.isAdmin;

    await prisma.conversationParticipant.update({
      where: {
        id: targetParticipant.id,
      },

      data: {
        isAdmin: newAdminStatus,
      },
    });

    // =====================================================
    // Result
    // =====================================================

    revalidatePath(`/messages/${conversationId}`);

    const io = getIo();
    io.to(`conversation:${conversationId}`).emit("participant:admin-updated", {
      conversationId,
      accountId,
      isAdmin: newAdminStatus,
    });

    return {
      success: true,
      isAdminNow: newAdminStatus,

      message: newAdminStatus
        ? "Participant is now an admin"
        : "Admin role removed successfully",
    };
  } catch (error) {
    console.error("makeParticipantAdmin error:", error);

    return {
      success: false,
      message: "Failed to change participant admin role",
    };
  }
};

export default toggleParticipantAdmin;
