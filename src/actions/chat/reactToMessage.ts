"use server";

import { MessageReactionType } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const reactToMessage = async ({
  accountId,
  messageId,
  type,
}: {
  accountId: string;
  messageId: string;
  type: MessageReactionType;
}) => {
  if (!accountId) {
    return {
      success: false,
      message: "Account ID is required",
    };
  }

  if (!messageId) {
    return {
      success: false,
      message: "Message ID is required",
    };
  }

  if (!type) {
    return {
      success: false,
      message: "Reaction type is required",
    };
  }

  // ============================================================
  // 1. Get message
  // ============================================================

  const message = await prisma.message.findUnique({
    where: {
      id: messageId,
    },
    select: {
      id: true,
      conversationId: true,
    },
  });

  if (!message) {
    return {
      success: false,
      message: "Message not found",
    };
  }

  // ============================================================
  // 2. Check participant
  // ============================================================

  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      conversationId_accountId: {
        conversationId: message.conversationId,
        accountId,
      },
    },
    select: {
      accountId: true,
    },
  });

  if (!participant) {
    return {
      success: false,
      message: "You are not a participant",
    };
  }

  // ============================================================
  // 3. Check this exact reaction
  // ============================================================

  const existingReaction = await prisma.messageReaction.findUnique({
    where: {
      accountId_messageId: {
        accountId,
        messageId,
      },
    },
  });

  // ============================================================
  // 4. Toggle reaction
  // ============================================================

  if (existingReaction) {
    await prisma.messageReaction.delete({
      where: {
        id: existingReaction.id,
      },
    });

    return {
      success: true,
      active: false,
      type,
    };
  }

  // ============================================================
  // 5. Create reaction
  // ============================================================

  const reaction = await prisma.messageReaction.upsert({
    where: {
      accountId_messageId: {
        accountId,
        messageId,
      },
    },

    create: {
      accountId,
      messageId,
      type,
    },

    update: {
      type,
    },
  });

  revalidatePath(`/messages/${message.conversationId}`);

  return {
    success: true,
    active: true,
    type: reaction.type,
  };
};

export default reactToMessage;
