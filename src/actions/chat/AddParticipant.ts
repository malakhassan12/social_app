"use server";

import type { ConversationParticipant } from "@/generated/prisma/client";
import { ConversationParticipantType } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { getIo } from "@/lib/socket/getIo";
import addParticipants from "../socket/add-participants";
import { revalidatePath } from "next/cache";

type AddParticipantResult = {
  success: boolean;
  message?: string;
  addedParticipants?: ConversationParticipant[];
};

const AddParticipant = async (
  selectedIds: string[],
  conversationId: string,
  currentAccountId: string,
): Promise<AddParticipantResult> => {
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

    if (!Array.isArray(selectedIds) || selectedIds.length === 0) {
      return {
        success: false,
        message: "Select at least one account",
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

    // Remove duplicates
    const uniqueSelectedIds = [...new Set(selectedIds)];

    // =====================================================
    // Get conversation
    // =====================================================

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      select: {
        id: true,
        type: true,
        name: true,
        image: true,
        isOpenAddition: true,

        participants: {
          select: {
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
        message: "Participants can only be added to group conversations",
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
    // Permission
    // =====================================================

    const isAdmin = currentParticipant.isAdmin === true;

    /*
     * Admin can always add.
     *
     * Normal member can add only when
     * conversation.isOpenAddition === true.
     */
    if (!isAdmin && !conversation.isOpenAddition) {
      return {
        success: false,
        message: "Adding participants is currently closed",
      };
    }

    // =====================================================
    // Remove current participant
    //
    // A user should not add himself again.
    // =====================================================

    const activeParticipantIds = new Set(
      conversation.participants
        .filter(
          (participant) =>
            participant.type === ConversationParticipantType.EXIST,
        )
        .map((participant) => participant.accountId),
    );

    const candidateIds = uniqueSelectedIds.filter(
      (id) => id !== currentAccountId && !activeParticipantIds.has(id),
    );

    if (candidateIds.length === 0) {
      return {
        success: false,
        message: "All selected accounts are already participants",
      };
    }

    // =====================================================
    // Get target accounts
    // =====================================================
    const accounts = await prisma.account.findMany({
      where: {
        id: {
          in: candidateIds,
        },
      },
      select: {
        id: true,
        name: true,
        username: true,
        isOpenGroup: true,
      },
    });

    const allowedAccounts = accounts.filter(
      (account) => account.isOpenGroup === true,
    );

    const blockedAccounts = accounts.filter(
      (account) => account.isOpenGroup === false,
    );

    const allowedIds = allowedAccounts.map((account) => account.id);

    const blockedNames = blockedAccounts.map(
      (account) => account.name || account.username || "Unknown user",
    );

    if (allowedIds.length === 0) {
      return {
        success: false,
        message: `None of the selected accounts can join this group. ${blockedNames.join(
          ", ",
        )} have group joining disabled.`,
      };
    }

    // =====================================================
    // Add participants
    // =====================================================

    const existingParticipantsByAccount = new Map(
      conversation.participants.map((participant) => [
        participant.accountId,
        participant,
      ]),
    );
    const previouslyRemovedIds = allowedIds.filter(
      (id) =>
        existingParticipantsByAccount.get(id)?.type ===
        ConversationParticipantType.REMOVED,
    );
    const newParticipantIds = allowedIds.filter(
      (id) => !existingParticipantsByAccount.has(id),
    );

    await prisma.$transaction([
      prisma.conversationParticipant.updateMany({
        where: {
          conversationId,
          accountId: { in: previouslyRemovedIds },
          type: ConversationParticipantType.REMOVED,
        },
        data: {
          type: ConversationParticipantType.EXIST,
          isAdmin: false,
          joinedAt: new Date(),
        },
      }),
      prisma.conversationParticipant.createMany({
        data: newParticipantIds.map((accountId) => ({
          conversationId,
          accountId,
          isAdmin: false,
          type: ConversationParticipantType.EXIST,
        })),
        skipDuplicates: true,
      }),
    ]);

    const addedParticipants = await prisma.conversationParticipant.findMany({
      where: {
        conversationId,
        type: ConversationParticipantType.EXIST,

        accountId: {
          in: allowedIds,
        },
      },

      select: {
        id: true,
        conversationId: true,
        accountId: true,
        type: true,
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
    });
    // =====================================================
    // Result
    // =====================================================

    let message = `${allowedIds.length} participant${
      allowedIds.length > 1 ? "s" : ""
    } added successfully`;

    if (blockedAccounts.length > 0) {
      message += `. ${blockedNames.join(
        ", ",
      )} could not be added because group joining is disabled`;
    }

    const participantNames = addedParticipants.map(
      (participant) =>
        participant.account?.name ||
        participant.account?.username ||
        "Unknown user",
    );
    const io = getIo();

    const conversationRoom = `conversation:${conversationId}`;

    for (const addedParticipant of addedParticipants) {
      io.in(`account:${addedParticipant.accountId}`).socketsJoin(
        conversationRoom,
      );
    }

    addParticipants(
      addedParticipants.map((part) => part.accountId),
      {
        id: conversation.id,
        name: conversation.name,
        image: conversation.image,
      },
    );

    const account = await prisma.account.findFirst({
      where: {
        id: currentAccountId,
      },
      select: {
        username: true,
      },
    });

    io.to(conversationRoom).emit("publish:join", {
      conversationId,
      message,
      addedParticipants,
      participantNames,
      name: account?.username,
      createdAt: new Date().toISOString(),
    });

    revalidatePath(`/messages/${conversationId}`);

    return {
      success: true,
      message,
      addedParticipants,
    };
  } catch (error) {
    console.error("AddParticipant error:", error);

    return {
      success: false,
      message: "Failed to add participants",
    };
  }
};

export default AddParticipant;
