import { ConversationType } from "@/generated/prisma/enums";
import { FC } from "react";

import type { Chat } from "@/helper/chat/getChats";

import AccountsRealTimeTab from "./AccountsRealTimeTab";

import isAccountOnline from "@/lib/socket/isAccountOnline";
import getUnreadMessages from "@/helper/chat/getUnReadMessages";

const AccountsTab: FC<{
  accountId: string;
  conversations: Chat[];
}> = async ({ conversations, accountId }) => {

  const accounts = await Promise.all(
    conversations.map(async (conversation) => {
      const otherParticipant =
        conversation.participants.find(
          (part) => part.id !== accountId,
        );

      const unreadResult = await getUnreadMessages(
        conversation.id,
        accountId,
      );

      const initialOnline =
        conversation.type === ConversationType.GROUP
          ? false
          : otherParticipant
            ? isAccountOnline(otherParticipant.id)
            : false;

      return {
        conversation,
        otherParticipant,
        unreadCount: unreadResult.count ?? 0,
        initialOnline,
      };
    }),
  );

  return (
    <>
      <AccountsRealTimeTab
        key={`${accountId}:${accounts
          .map(({ conversation }) => conversation.id)
          .join(",")}`}
        accountId={accountId}
        initialAccounts={accounts}
      />
    </>
  );
};

export default AccountsTab;