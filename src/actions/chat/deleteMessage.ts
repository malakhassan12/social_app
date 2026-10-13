"use server";

import prisma from "@/lib/prisma";
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

  revalidatePath(`/messages/${conversationId}`);

  return {
    success: true,
    message: "Message deleted successfully",
  };
};

export default deleteMessage;
