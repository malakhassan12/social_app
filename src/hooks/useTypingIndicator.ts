"use client";

import { useEffect, useRef, useState } from "react";
import { getSocket } from "@/lib/socket/socket";

const TYPING_TIMEOUT = 2000;

type TypingUser = {
  accountId: string;
  accountName: string;
  accountImage: string | null;
};

export function useTypingIndicator(conversationId: string) {
  const [typingUsers, setTypingUsers] = useState<Map<string, TypingUser>>(
    new Map(),
  );
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    const socket = getSocket();
    const timeouts = timeoutsRef.current;
    socket.connect();
    socket.emit("conversation:join", { conversationId });

    const handleTypingStart = (
      data: TypingUser & { conversationId: string },
    ) => {
      if (data.conversationId !== conversationId) return;

      setTypingUsers((prev) => {
        const next = new Map(prev);
        next.set(data.accountId, {
          accountId: data.accountId,
          accountName: data.accountName,
          accountImage: data.accountImage,
        });
        return next;
      });

      const existingTimeout = timeouts.get(data.accountId);
      if (existingTimeout) clearTimeout(existingTimeout);

      const timeout = setTimeout(() => {
        setTypingUsers((prev) => {
          const next = new Map(prev);
          next.delete(data.accountId);
          return next;
        });
      }, TYPING_TIMEOUT);

      timeouts.set(data.accountId, timeout);
    };

    const handleTypingStop = ({
      accountId,
      conversationId: eventConversationId,
    }: {
      accountId: string;
      conversationId: string;
    }) => {
      if (eventConversationId !== conversationId) return;

      setTypingUsers((prev) => {
        const next = new Map(prev);
        next.delete(accountId);
        return next;
      });

      const existingTimeout = timeouts.get(accountId);
      if (existingTimeout) clearTimeout(existingTimeout);
    };

    socket.on("typing:start", handleTypingStart);
    socket.on("typing:stop", handleTypingStop);

    return () => {
      socket.emit("conversation:leave", { conversationId });
      socket.off("typing:start", handleTypingStart);
      socket.off("typing:stop", handleTypingStop);
      timeouts.forEach(clearTimeout);
      timeouts.clear();
      setTypingUsers(new Map());
    };
  }, [conversationId]);

  return typingUsers;
}
