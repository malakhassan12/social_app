import { Account } from "@/types/account.Types";
import ChatControllerBtn, {
  ConversationParticipantChat,
} from "./ChatControllerBtn";
import { FC } from "react";
import { Conversation } from "@/generated/prisma/client";
import ChatMessageController from "./ChatMessageContoller";

const ChatController: FC<{
  conversation: Conversation;
  account: Account;
  currentParticipant: ConversationParticipantChat;
  participants: ConversationParticipantChat[];

  selectedAccountId: string | undefined | null;
}> = ({
  conversation,
  account,
  currentParticipant,
  participants,
  selectedAccountId,
}) => {
  return (
    <div className="mx-2 mb-2 mt-2 shrink-0 rounded-2xl border border-border/60 bg-background/95 shadow-lg shadow-black/5 backdrop-blur-sm supports-backdrop-filter:bg-background/80">
      {conversation && account && (
        <ChatMessageController
          key={`${conversation.id}-${account.id}`}
          conversation={conversation}
          account={account as unknown as Account}
          currentParticipant={currentParticipant as ConversationParticipantChat}
          selectedAccountId={selectedAccountId}
        >
          {conversation && account && conversation.type === "GROUP" && (
            <div className="flex items-center justify-between gap-2 border-b border-border/40 px-3 py-2">
              <div className="flex min-w-0 items-center gap-2">
                <span className="truncate text-xs font-medium text-muted-foreground">
                  Group actions
                </span>
              </div>

              <ChatControllerBtn
                conversation={conversation}
                account={account as unknown as Account}
                currentParticipant={
                  currentParticipant as unknown as ConversationParticipantChat
                }
                participants={participants as ConversationParticipantChat[]}
              />
            </div>
          )}
        </ChatMessageController>
      )}
    </div>
  );
};

export default ChatController;
