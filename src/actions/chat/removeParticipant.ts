"use server";

import prisma from "@/lib/prisma";
import { ConversationParticipantType } from "@/generated/prisma/enums";
import { getIo } from "@/lib/socket/getIo";
import { revalidatePath } from "next/cache";

const removeParticipant = async (
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
    // Prevent removing yourself
    // =====================================================

    if (currentAccountId === accountId) {
      return {
        success: false,
        message: "You cannot remove yourself. Use leave conversation instead.",
      };
    }

    // =====================================================
    // Get conversation + current admin
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
        message: "Participants can only be removed from group conversations",
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
        message: "Only an admin can remove participants",
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
    // Do not remove an admin
    //
    // Current schema cannot identify original owner,
    // so all admins are protected here.
    // =====================================================

    if (conversation.ownerId === accountId) {
      return {
        success: false,
        message: "The group owner cannot be removed",
      };
    }
    // =====================================================
    // Remove participant
    // =====================================================

    await prisma.conversationParticipant.update({
      where: {
        id: targetParticipant.id,
      },
      data: {
        type: ConversationParticipantType.REMOVED,
      },
    });

    const [removedBy, removedParticipant] = await Promise.all([
      prisma.account.findUnique({
        where: { id: currentAccountId },
        select: { username: true },
      }),
      prisma.account.findUnique({
        where: { id: accountId },
        select: { username: true, name: true },
      }),
    ]);

    const participantName =
      removedParticipant?.name ?? removedParticipant?.username ?? "A participant";

    revalidatePath(`/messages/${conversationId}`);

    const io = getIo();
    const conversationRoom = `conversation:${conversationId}`;

    io.to(conversationRoom).emit("participant:removed", {
      conversationId,
      accountId,
      name: removedBy?.username ?? "An admin",
      participantName,
      createdAt: new Date().toISOString(),
    });

    io.in(`account:${accountId}`).socketsLeave(conversationRoom);

    io.to(`account:${accountId}`).emit("remove:group", {
      conversationId,
    });

    // =====================================================
    // Result
    // =====================================================

    return {
      success: true,
      message: "Participant removed successfully",
    };
  } catch (error) {
    console.error("removeParticipant error:", error);

    return {
      success: false,
      message: "Failed to remove participant",
    };
  }
};

export default removeParticipant;
