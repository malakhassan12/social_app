"use server";

import { MessageReactionType } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { getIo } from "@/lib/socket/getIo";
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

  if (!type || !Object.values(MessageReactionType).includes(type)) {
    return {
      success: false,
      message: "Invalid reaction type",
    };
  }

  const message = await prisma.message.findUnique({
    where: { id: messageId },
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

  const existingReaction = await prisma.messageReaction.findUnique({
    where: {
      accountId_messageId: {
        accountId,
        messageId,
      },
    },
  });

  let active: boolean;
  let reactionType: MessageReactionType | null;

  if (existingReaction?.type === type) {
    await prisma.messageReaction.delete({
      where: {
        id: existingReaction.id,
      },
    });

    active = false;
    reactionType = null;
  } else {
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

    active = true;
    reactionType = reaction.type;
  }

  const io = getIo();

  io.to(`conversation:${message.conversationId}`).emit("publish:like-message", {
    messageId: message.id,
    accountId,
    reaction: reactionType,
    isLiked: active,
  });

  revalidatePath(`/messages/${message.conversationId}`);

  return {
    success: true,
    active,
    type: reactionType,
  };
};

export default reactToMessage;
