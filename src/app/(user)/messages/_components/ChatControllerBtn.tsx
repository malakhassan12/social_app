import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Conversation } from "@/generated/prisma/client";
import { Account } from "@/types/account.Types";

import { SlidersHorizontalIcon } from "lucide-react";

import openCloseAddParticipant from "@/actions/chat/openCloseAddParticipant";
import openCloseChatConversation from "@/actions/chat/openCloseChatConversation";
import ChatActions from "./ChatActions";
import AddParticipantTab from "./AddParticipantTab";

export type ChatAction =
  | "exit"
  | "edit-group"
  | "add-person"
  | "toggle-open"
  | "toggle-open-addition"
  | "remove-member"
  | "delete-chat";

export type ConversationParticipantChat = {
  id: string;
  conversationId: string;
  accountId: string;
  joinedAt: Date;
  isAdmin: boolean;

  account?: {
    id: string;
    name: string | null;
    username: string;
    image: string | null;
  };
};

type ConversationWithParticipants = Conversation & {
  participants?: ConversationParticipantChat[];
};

type Props = {
  account: Account;
  conversation: ConversationWithParticipants;
  currentParticipant: ConversationParticipantChat;
  participants: ConversationParticipantChat[];
};

export default async function ChatControllerBtn({
  account,
  conversation,
  currentParticipant,
  participants,
}: Props) {
  /*
   * =====================================================
   * Permissions
   * =====================================================
   */

  const isParticipant = Boolean(currentParticipant);

  const isAdmin = currentParticipant?.isAdmin === true;

  /*
   * =====================================================
   * Server Actions
   *
   * These are SERVER FUNCTIONS.
   *
   * They can safely cross the
   * Server -> Client boundary.
   * =====================================================
   */

  async function handleOpenCloseChat(value: boolean) {
    "use server";

    return openCloseChatConversation(conversation.id, value, account.id);
  }

  async function handleOpenCloseAddition(value: boolean) {
    "use server";

    return openCloseAddParticipant(conversation.id, value, account.id);
  }

  /*
   * =====================================================
   * Render
   * =====================================================
   */

  return (
    <Dialog>
      {/* =================================================
          Trigger
         ================================================= */}

      <DialogTrigger
        aria-label="Open chat actions"
        className="inline-flex size-9 items-center justify-center rounded-xl border border-input bg-background shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      >
        <SlidersHorizontalIcon className="size-4" />
      </DialogTrigger>

      {/* =================================================
          Dialog
         ================================================= */}

      <DialogContent
        className="
          max-h-[85vh]
          w-full
          sm:max-w-md
          -mx-4
          no-scrollbar
          overflow-y-auto
          px-4
        "
      >
        {/* =================================================
            Header
           ================================================= */}

        <div className="shrink-0 border-b bg-linear-to-br from-primary/5 via-muted/30 to-transparent px-5 pb-5 pt-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-base">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                <SlidersHorizontalIcon className="size-4 text-primary" />
              </span>

              <div className="flex flex-col gap-0.5">
                <span>Chat Actions</span>

                <DialogDescription className="text-xs font-normal">
                  Manage this conversation
                </DialogDescription>
              </div>
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* =================================================Scrollable body================================================= */}

        <div className="min-h-0 flex-1 overflow-y-auto">
          {/* =================================================
              Actions
             ================================================= */}

          <ChatActions
            isAdmin={isAdmin}
            participants={participants}
            handleOpenCloseAddition={handleOpenCloseAddition}
            handleOpenCloseChat={handleOpenCloseChat}
            conversation={conversation}
            account={account}
            isParticipant={isParticipant}
          >
            <AddParticipantTab
              accountId={account.id}
              conversationId={conversation.id}
              initialParticipants={participants}
            />
          </ChatActions>
        </div>
      </DialogContent>
    </Dialog>
  );
}
