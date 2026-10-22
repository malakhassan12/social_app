"use server";

import prisma from "@/lib/prisma";
import { getIo } from "@/lib/socket/getIo";
import { revalidatePath } from "next/cache";

const deleteMessage = async ({
  messageId,
  accountId,
}: {
  messageId: string;
  accountId: string;
}) => {
  if (!messageId) {
    return {
      success: false,
      message: "Message ID is required",
    };
  }

  if (!accountId) {
    return {
      success: false,
      message: "Account ID is required",
    };
  }

  const message = await prisma.message.findUnique({
    where: {
      id: messageId,
    },
    select: {
      id: true,
      senderId: true,
      conversationId: true,
    },
  });

  if (!message) {
    return {
      success: false,
      message: "Message not found",
    };
  }

  if (message.senderId !== accountId) {
    return {
      success: false,
      message: "You can only delete your own messages",
    };
  }

  const conversationId = message.conversationId;

  await prisma.message.delete({
    where: {
      id: messageId,
    },
  });

  const io = getIo();

  io.to(`conversation:${message.conversationId}`).emit("publish:delete-message", {
    messageId: message.id,
    accountId,
    
  });

  revalidatePath(`/messages/${conversationId}`);

  return {
    success: true,
    message: "Message deleted successfully",
  };
};

export default deleteMessage;
