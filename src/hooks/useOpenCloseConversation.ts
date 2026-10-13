"use client";

import { getSocket } from "@/lib/socket/socket";
import { useEffect, useState } from "react";

type Props = {
  conversationId: string;
  initialValue: boolean;
  type: "manage" | "addition";
};

const useOpenCloseConversation = ({
  conversationId,
  initialValue,
  type,
}: Props) => {
  const [isOpen, setIsOpen] = useState(initialValue);

  useEffect(() => {
    const socket = getSocket();

    socket.connect();

    socket.emit("conversation:join", {
      conversationId,
    });

    const event =
      type === "manage"
        ? "manage:chat"
        : "manage:addition";

    const handleChange = (data: {
      conversationId: string;
      isOpen?: boolean;
      isOpenAddition?: boolean;
    }) => {
      if (data.conversationId !== conversationId) {
        return;
      }

      const nextValue =
        type === "manage"
          ? data.isOpen
          : data.isOpenAddition;

      if (typeof nextValue === "boolean") {
        setIsOpen(nextValue);
      }
    };

    socket.on(event, handleChange);

    return () => {
      socket.off(event, handleChange);
    };
  }, [conversationId, type]);

  return [isOpen, setIsOpen] as const;
};

export default useOpenCloseConversation;