"use client";

import { FC } from "react";
import { ContextMenuItem } from "@/components/ui/context-menu";
import type { MessageWithSender } from "./MessageItem";
import { useChatReply } from "../../../../context/ChatReplyContext";

type ReplyMsgBtnProps = {
  message: MessageWithSender;
  closeMenu: () => void;
};

const ReplyMsgBtn: FC<ReplyMsgBtnProps> = ({ message, closeMenu }) => {
  const { setReplyingTo } = useChatReply();

  const selectMessageToReply = () => {
    setReplyingTo(message);
    closeMenu();
  };

  return (
    <ContextMenuItem className="w-full" onSelect={selectMessageToReply}>
      Reply
    </ContextMenuItem>
  );
};

export default ReplyMsgBtn;
