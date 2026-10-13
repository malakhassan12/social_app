"use client";


import { FC } from "react";
import EditGroupBtn from "./EditGroupBtn";
import ExitGroupBtn from "./ExitGroupBtn";
import ParticipantsChat from "./ParticipantsChat";
import RemoveConversationBtn from "./RemoveConversationBtn";
import SwitchChatBtn from "./SwitchChatBtn";
import { Conversation } from "@/generated/prisma/client";
import AdditionAccess from "./AdditionAccess";
import { Account } from "@/types/account.Types";
import { ConversationParticipantChat } from "./ChatControllerBtn";
import useBecameAdmin from "@/hooks/useBecameAdmin";

const ChatActions: FC<{
  isAdmin: boolean;
  handleOpenCloseChat: (value: boolean) => Promise<unknown>;
  handleOpenCloseAddition: (value: boolean) => Promise<unknown>;
  conversation: Conversation;
  account: Account;
  participants: ConversationParticipantChat[];
  isParticipant: boolean;
  children : React.ReactNode
}> = ({
  isAdmin,
  handleOpenCloseAddition,
  handleOpenCloseChat,
  conversation,
  account,
  participants,
  isParticipant,
  children
}) => {
  const [adminNow] = useBecameAdmin(
    conversation.id,
    account.id,
    isAdmin ?? false,
  );

  return (
    <div className="space-y-1.5 px-5 py-4">
      {/* Open / Close Chat */}

      <SwitchChatBtn
        onAction={handleOpenCloseChat}
        conversation={conversation}
        type="manage"
        isAdmin={adminNow}
      />

      {/* Open / Close Addition */}

      <SwitchChatBtn
        onAction={handleOpenCloseAddition}
        conversation={conversation}
        type="addition"
        isAdmin={adminNow}
      />

      {/* Add Participant */}

      <AdditionAccess
        conversationId={conversation.id}
        initialValue={conversation.isOpenAddition}
        isAdmin={adminNow}
      >
        {children}
       
      </AdditionAccess>

      {/* Edit Group */}

      {adminNow && (
        <EditGroupBtn conversation={conversation} accountId={account.id} />
      )}

      <ParticipantsChat
        key={`${conversation.id}:${participants
          .map((participant) => participant.accountId)
          .sort()
          .join(",")}`}
        conversation={conversation}
        account={account}
        initialParticipants={participants}
        isAdmin={adminNow}
      />

      {/* Exit Group */}

      {isParticipant && (
        <ExitGroupBtn accountId={account.id} conversationId={conversation.id} />
      )}

      {adminNow && conversation.ownerId === account.id && (
        <RemoveConversationBtn conversation={conversation} account={account} />
      )}
    </div>
  );
};

export default ChatActions;
