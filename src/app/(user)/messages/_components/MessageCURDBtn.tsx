import { FC } from "react";

import LikeMsgBtn from "./LikeMsgBtn";
import ReplyMsgBtn from "./ReplyMsgBtn";
import UpdateMsgBtn from "./UpdateMsgBtn";
import DeleteMsgBtn from "./DeleteMsgBtn";

import { MessageWithSender } from "./MessageItem";

import {
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import ShowParticipantsSeenBtn, { SeenRead } from "./ShowParticipantsSeenBtn";
import { Message, MessageReactionType } from "@/generated/prisma/client";

interface MessageCURDBtnProps {
  message: MessageWithSender;
  isOwn: boolean;
  isLiked?: boolean;
  currentAccountId: string;
  conversationId: string;
  myReaction: MessageReactionType | null;
  onOptimisticReaction: (value: MessageReactionType | null | undefined) => void;
  closeMenu: () => void;
}

const MessageCURDBtn: FC<MessageCURDBtnProps> = ({
  message,
  isOwn,
  currentAccountId,
  conversationId,
  onOptimisticReaction,
  myReaction,
  closeMenu,
}) => {
  return (
    <ContextMenuContent className="overflow-visible">
      {/* ─────────────────────────
          Reaction Picker
         ───────────────────────── */}
      <div
        className="w-full"
        onPointerDown={(event) => {
          event.stopPropagation();
        }}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <LikeMsgBtn
          currentReaction={myReaction}
          messageId={message.id}
          currentAccountId={currentAccountId}
          onOptimisticReaction={onOptimisticReaction}
          closeMenu={closeMenu}
        />
      </div>

      {/* ─────────────────────────
          Reply
         ───────────────────────── */}
      <ReplyMsgBtn message={message} closeMenu={closeMenu} />

      {/* ─────────────────────────
          Own message actions
         ───────────────────────── */}
      {isOwn && (
        <>
          <div className="my-1 h-px bg-gray-200 dark:bg-gray-800" />

          <ContextMenuItem className="w-full" asChild>
            <UpdateMsgBtn
              message={message}
              conversationId={conversationId}
              closeMenu={closeMenu}
            />
          </ContextMenuItem>

          <ContextMenuItem className="w-full" asChild>
            <ShowParticipantsSeenBtn
              message={
                message as Message & {
                  messageReads?: SeenRead[];
                }
              }
              closeMenu={closeMenu}
            />
          </ContextMenuItem>

          <ContextMenuItem className="w-full text-red-600" asChild>
            <DeleteMsgBtn
              messageId={message.id}
              currentAccountId={currentAccountId}
              closeMenu={closeMenu}
            />
          </ContextMenuItem>
        </>
      )}
    </ContextMenuContent>
  );
};

export default MessageCURDBtn;
