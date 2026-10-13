// src/hooks/useMessageReadStatus.ts
"use client";

import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket/socket";

type ReadReceipt = { messageId: string; accountId: string; readAt: string };

export default function useMessageReadStatus() {
  const [readReceipts, setReadReceipts] = useState<Map<string, Set<string>>>(
    new Map(),
  );

  useEffect(() => {
    const socket = getSocket();

    const handleMessageRead = (data: ReadReceipt) => {
      setReadReceipts((prev) => {
        const next = new Map(prev);
        const readers = new Set(next.get(data.messageId) ?? []);
        readers.add(data.accountId);
        next.set(data.messageId, readers);
        return next;
      });
    };

    socket.on("message:read", handleMessageRead);

    return () => {
      socket.off("message:read", handleMessageRead);
    };
  }, []);
  

  return readReceipts;
}