"use client";

import { useEffect } from "react";
import { getSocket } from "@/lib/socket/socket";

export function useJoinConversation(conversationId: string | undefined) {
  useEffect(() => {
    if (!conversationId) return;

    const socket = getSocket();
    socket.connect();

    // ابعت للسيرفر: "أنا دلوقتي داخل المحادثة دي"
    socket.emit("conversation:join", { conversationId });

    return () => {
      // ابعت للسيرفر: "أنا خرجت من المحادثة دي"
      socket.emit("conversation:leave", { conversationId });
    };
  }, [conversationId]);
}