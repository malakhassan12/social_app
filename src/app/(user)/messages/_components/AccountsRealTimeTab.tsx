"use client";

import { getSocket } from "@/lib/socket/socket";
import { ConversationType } from "@/generated/prisma/enums";
import type { Chat, ChatParticipant } from "@/helper/chat/getChats";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useCallback, useEffect, useState } from "react";
import AccountTabItem from "./AccountTabItem";

type AccountListItem = {
  conversation: Chat;
  otherParticipant?: ChatParticipant;
  unreadCount: number;
  initialOnline: boolean;
};

type Props = {
  accountId: string;
  initialAccounts: AccountListItem[];
};

const AccountsRealTimeTab = ({ accountId, initialAccounts }: Props) => {
  const [accounts, setAccounts] = useState(initialAccounts);

  const handleAddedGroup = useCallback(
    (data: {
      conversation: {
        id: string;
        name: string | null;
        image: string | null;
      };
    }) => {
      setAccounts((current) => {
        if (current.some(({ conversation }) => conversation.id === data.conversation.id)) {
          return current;
        }

        const conversation: Chat = {
          ...data.conversation,
          type: ConversationType.GROUP,
          participants: [],
        };

        return [
          {
            conversation,
            unreadCount: 0,
            initialOnline: false,
          },
          ...current,
        ];
      });
    },
    [],
  );

  const handleRemovedGroup = useCallback(
    (data: { conversationId: string }) => {
      setAccounts((current) =>
        current.filter(({ conversation }) => conversation.id !== data.conversationId),
      );
    },
    [],
  );

  useEffect(() => {
    const socket = getSocket();

    socket.connect();

    socket.on("add:group", handleAddedGroup);
    // socket.on("remove:group", handleRemovedGroup);

    return () => {
      socket.off("add:group", handleAddedGroup);
      socket.off("remove:group", handleRemovedGroup);
    };
  }, [handleAddedGroup, handleRemovedGroup]);

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-1 p-3">
        {accounts.map(
          ({ conversation, otherParticipant, unreadCount, initialOnline }) => (
            <AccountTabItem
              key={conversation.id}
              conversation={conversation}
              otherParticipant={otherParticipant}
              unreadCount={unreadCount}
              initialOnline={initialOnline}
              accountId={accountId}
            />
          ),
        )}
      </div>
      <ScrollBar orientation="horizontal" className="h-1.5" />
    </ScrollArea>
  );
};

export default AccountsRealTimeTab;
