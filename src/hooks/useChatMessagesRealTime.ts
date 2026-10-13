"use client";

import { getSocket } from "@/lib/socket/socket";
import { useEffect } from "react";

import type { MessageWithSender } from "../app/(user)/messages/_components/MessageItem";

type Props = {
  conversationId: string;
  onNewMessage: (message: MessageWithSender) => void;
  onMessageRead: (data: MessageReadEvent) => void;
};

type MessageReadEvent = {
  messageId: string;
  accountId: string;
};

export default function useChatMessagesRealTime({
  conversationId,
  onNewMessage,
  onMessageRead,
}: Props) {
  useEffect(() => {
    const socket = getSocket();

    socket.connect();

    // Join current conversation
    socket.emit("conversation:join", {
      conversationId,
    });

    const handleNewMessage = (message: MessageWithSender) => {

      // Safety check
      if (message.conversationId !== conversationId) {
        return;
      }

      onNewMessage(message);
    };

    const handleMessageRead = (data: MessageReadEvent) => {

      onMessageRead(data);
    };

    socket.on("publish:message", handleNewMessage);
    socket.on("message:read", handleMessageRead);

    return () => {
      // Leave current conversation
      socket.emit("conversation:leave", {
        conversationId,
      });

      socket.off("publish:message", handleNewMessage);
      socket.off("message:read", handleMessageRead);
    };
  }, [conversationId, onNewMessage, onMessageRead]);

  return null;
}
