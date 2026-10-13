"use client";

import { ConversationType } from "@/generated/prisma/enums";

import type { Chat, ChatParticipant } from "@/helper/chat/getChats";

import AccountCircle from "./AccountCircle";
import useMessageReadCount from "@/hooks/useMessageReadCount";

type Props = {
  conversation: Chat;
  otherParticipant?: ChatParticipant;
  unreadCount: number;
  initialOnline: boolean;
  accountId: string;
};

export default function AccountTabItem({
  conversation,
  otherParticipant,
  unreadCount,
  initialOnline,
  accountId,
}: Props) {
  const readCount = useMessageReadCount(
    conversation.id,
    unreadCount,
    accountId,
  );

  const account =
    conversation.type === ConversationType.GROUP
      ? {
          username: conversation.name ?? "",
          image: conversation.image ?? "",
          id: conversation.id,
          email: "",
        }
      : (otherParticipant as ChatParticipant);

  return (
    <AccountCircle
      conversationId={conversation.id}
      account={account}
      initialOnline={initialOnline}
      unreadCount={readCount}
    />
  );
}
