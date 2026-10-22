
"use client";

import { getSocket } from "@/lib/socket/socket";
import { useEffect } from "react";

import type { MessageWithSender } from "../app/(user)/messages/_components/MessageItem";
import type { MessageReactionType } from "@/generated/prisma/enums";

type Props = {
  conversationId: string;
  onNewMessage: (message: MessageWithSender) => void;
  onMessageRead: (data: MessageReadEvent) => void;
  onMessageReaction: (data: MessageReactionEvent) => void;
  onUpdateMessage: (message: MessageWithSender) => void;
  onDeleteMessage: (data: DeleteMessageEvent) => void;
};

type MessageReadEvent = {
  messageId: string;
  accountId: string;
};

export type DeleteMessageEvent = {
  messageId: string;
  accountId: string;
};

export type MessageReactionEvent = {
  messageId: string;
  accountId: string;
  reaction: MessageReactionType | null;
  isLiked: boolean;
};

type UpdateMessageEvent = {
  message: MessageWithSender;
};

export default function useChatMessagesRealTime({
  conversationId,
  onNewMessage,
  onMessageRead,
  onMessageReaction,
  onUpdateMessage,
  onDeleteMessage,
}: Props) {
  useEffect(() => {
    const socket = getSocket();

    socket.connect();

    socket.emit("conversation:join", {
      conversationId,
    });

    const handleNewMessage = (message: MessageWithSender) => {
      if (message.conversationId !== conversationId) return;
      onNewMessage(message);
    };

    const handleMessageRead = (data: MessageReadEvent) => {
      onMessageRead(data);
    };

    const handleReact = (data: MessageReactionEvent) => {
      onMessageReaction(data);
    };

    const handleUpdateMessage = (data: UpdateMessageEvent) => {
      if (data.message.conversationId !== conversationId) return;
      onUpdateMessage(data.message);
    };

    const handleDeleteMessage = (data: DeleteMessageEvent) => {
      onDeleteMessage(data);
    };

    socket.on("publish:message", handleNewMessage);
    socket.on("message:read", handleMessageRead);
    socket.on("publish:like-message", handleReact);
    socket.on("publish:update-message", handleUpdateMessage);
    socket.on("publish:delete-message", handleDeleteMessage);

    return () => {
      socket.emit("conversation:leave", {
        conversationId,
      });

      socket.off("publish:message", handleNewMessage);
      socket.off("message:read", handleMessageRead);
      socket.off("publish:like-message", handleReact);
      socket.off("publish:update-message", handleUpdateMessage);
      socket.off("publish:delete-message", handleDeleteMessage);
    };
  }, [
    conversationId,
    onNewMessage,
    onMessageRead,
    onMessageReaction,
    onUpdateMessage,
    onDeleteMessage,
  ]);

  return null;
}
