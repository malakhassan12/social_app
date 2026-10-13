"use client";

import { getSocket } from "@/lib/socket/socket";
import { useEffect, useState } from "react";

const useBecameAdmin = (
  conversationId: string,
  accountId: string,
  initialIsAdmin: boolean,
) => {
  const [isAdmin, setIsAdmin] = useState(initialIsAdmin);

  useEffect(() => {
    const socket = getSocket();

    socket.connect();

    const handleAdminUpdate = (data: {
      conversationId: string;
      accountId: string;
      isAdmin: boolean;
    }) => {
      if (data.conversationId !== conversationId) {
        return;
      }

      if (data.accountId === accountId) {
        setIsAdmin(data.isAdmin);
      }
    };

    socket.on("participant:admin-updated", handleAdminUpdate);
    socket.emit("conversation:join", { conversationId });

    return () => {
      socket.off("participant:admin-updated", handleAdminUpdate);
    };
  }, [accountId, conversationId]);

  return [isAdmin, setIsAdmin] as const;
};

export default useBecameAdmin;
