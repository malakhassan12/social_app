"use client";

import { Account } from "@/types/account.Types";
import { Conversation } from "@/generated/prisma/client";
import { ConversationParticipantChat } from "./ChatControllerBtn";
import ClosedChatNotice from "./ClosedChatNotice";
import SendMessageForm from "./SendMessageForm";
import TypingBar from "./TypingBar";
import RemovedFromChatNotice from "./RemovedFromChatNotice";
import useOpenCloseConversation from "@/hooks/useOpenCloseConversation";
import useBecameAdmin from "@/hooks/useBecameAdmin";
import useParticipantRemoved from "@/hooks/useParticipantRemoved";

type Props = {
  conversation: Conversation;
  account: Account;
  currentParticipant: ConversationParticipantChat;
  selectedAccountId: string | undefined | null;
  children: React.ReactNode;
};

const ChatMessageController = ({
  conversation,
  account,
  currentParticipant,
  selectedAccountId,
  children,
}: Props) => {
  const [isOpen] = useOpenCloseConversation({
    conversationId: conversation.id,
    initialValue: conversation.isOpen,
    type: "manage",
  });

  const [adminNow] = useBecameAdmin(
    conversation.id,
    account.id,
    currentParticipant?.isAdmin ?? false,
  );

  const { wasRemoved, nameRemoved } = useParticipantRemoved({
    conversationId: conversation.id,
    accountId: account.id,
  });

  if (wasRemoved) {
    return <RemovedFromChatNotice nameRemoved={nameRemoved} />;
  }

  const canSendMessage = isOpen || adminNow;

  return (
    <>
      {children}

      {/* Typing indicator — always visible, above the composer */}
      <TypingBar conversationId={conversation.id} />

      {canSendMessage ? (
        <div className="p-2">
          <SendMessageForm
            conversation={conversation}
            conversationId={conversation.id}
            accountId={account.id}
            selectedAccountId={selectedAccountId as string}
            account={account}
          />
        </div>
      ) : (
        <ClosedChatNotice />
      )}
    </>
  );
};

export default ChatMessageController;