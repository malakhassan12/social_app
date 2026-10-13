"use server";
import prisma from "@/lib/prisma";

export const markMessageAsRead = async (
  messageId: string,
  accountId: string,
) => {
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

  // Sender doesn't need to mark their own message as read
  if (message.senderId === accountId) {
    return {
      success: false,
      message: "You cannot mark your own message as read",
    };
  }

  // IMPORTANT:
  // Verify that accountId is actually a member
  // of this conversation.
  //
  // This part depends on your Conversation schema.

  const messageRead = await prisma.messageRead.upsert({
    where: {
      messageId_accountId: {
        messageId,
        accountId,
      },
    },
    update: {},
    create: {
      messageId,
      accountId,
      readAt: new Date(),
    },
    select: {
      messageId: true,
      accountId: true,
      readAt: true,
    },
  });

  return {
    success: true,
    message: "Message marked as read",
    data: messageRead,
    conversationId: message.conversationId,
    senderId: message.senderId, 
  };
};

export default markMessageAsRead;
