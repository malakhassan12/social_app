"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { MessageWithSender } from "../app/(user)/messages/_components/MessageItem";

type ChatReplyContextValue = {
  replyingTo: MessageWithSender | null;
  setReplyingTo: (message: MessageWithSender | null) => void;
};

const ChatReplyContext = createContext<ChatReplyContextValue | null>(null);

export function ChatReplyProvider({ children }: { children: ReactNode }) {
  const [replyingTo, setReplyingTo] = useState<MessageWithSender | null>(null);

  return (
    <ChatReplyContext.Provider value={{ replyingTo, setReplyingTo }}>
      {children}
    </ChatReplyContext.Provider>
  );
}

export function useChatReply() {
  const context = useContext(ChatReplyContext);

  if (!context) {
    throw new Error("useChatReply must be used within ChatReplyProvider");
  }

  return context;
}
