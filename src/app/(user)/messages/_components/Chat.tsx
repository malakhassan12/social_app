import EmptyPage from "@/components/Empty-Page/EmptyPage";
import { MessageSquare } from "lucide-react";
import { FC } from "react";

import { MessageWithSender } from "./MessageItem";
import getMessagesConversation from "@/helper/chat/getMessagesConversation";
import ChatMessages from "./ChatMessages";
import getAccount from "@/helper/account/getAccount";
import { Account } from "@/types/account.Types";
import { ConversationParticipantChat } from "./ChatControllerBtn";
import { ChatReplyProvider } from "../../../../context/ChatReplyContext";
import ChatController from "./ChatController";
import { Conversation } from "@/generated/prisma/client";

const Chat: FC<{
  params: Promise<{
    conversationId?: string | null;
  }>;
  searchParams: Promise<{
    accountId?: string;
  }>;
}> = async ({ params, searchParams }) => {
  const { conversationId } = await params;

  const { accountId } = await searchParams;

  const hasConversation =
    Boolean(conversationId) &&
    conversationId !== "null" &&
    conversationId !== "undefined";

  const account = await getAccount();

  const currentAccountId = account?.id;

  let messages: MessageWithSender[] = [];
  let isGroupConversation = false;
  let hasMoreOlderMessages = false;

  let conversation;

  let participants;
  let currentParticipant;

  if (hasConversation) {
    const res = await getMessagesConversation(conversationId as string);

    messages = (res.messages ?? []) as MessageWithSender[];

    conversation = res.converstion;

    isGroupConversation = res.converstion?.type === "GROUP";

    hasMoreOlderMessages = res.hasMoreOlderMessages ?? false;

    /*
     * =====================================================
     * Participants
     * =====================================================
     */

    participants = conversation?.participants ?? [];

    /*
     * =====================================================
     * Current participant
     * =====================================================
     */

    currentParticipant = participants.find(
      (participant) => participant.accountId === account?.id,
    );
  }

  return (
    <ChatReplyProvider key={conversationId ?? "no-conversation"}>
      <div className="flex h-full min-h-0 w-full flex-col">
        {!hasConversation ? (
          <div className="flex h-full w-full items-center justify-center">
            <EmptyPage
              title="No conversations yet"
              desc="You don't have any messages yet. Start a new conversation with someone to begin chatting."
              icon={<MessageSquare />}
            />
          </div>
        ) : (
          /* ✅ FIX 1: overflow-y-auto so messages scroll instead of clipping */
          <ChatMessages
            key={conversationId}
            initialMessages={messages}
            conversationId={conversationId as string}
            currentAccountId={currentAccountId as string}
            isGroupConversation={isGroupConversation}
            initialHasMoreOlderMessages={hasMoreOlderMessages}
          />
        )}

        <ChatController
          conversation={conversation as Conversation}
          currentParticipant={currentParticipant as ConversationParticipantChat}
          account={account as unknown as Account}
          selectedAccountId={accountId}
          participants={participants as ConversationParticipantChat[]}
        />
      </div>
    </ChatReplyProvider>
  );
};

export default Chat;
