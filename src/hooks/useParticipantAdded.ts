"use client";

import { getSocket } from "@/lib/socket/socket";
import type { ConversationParticipantChat } from "@/app/(user)/messages/_components/ChatControllerBtn";
import { useEffect } from "react";

type ParticipantAddedEvent = {
  conversationId: string;
  addedParticipants: ConversationParticipantChat[];
  participantNames: string[];
  name: string;
  message: string;
  createdAt?: string;
};

export type { ParticipantAddedEvent };

export default function useParticipantAdded({
  conversationId,
  onParticipantAdded,
}: {
  conversationId: string;
  onParticipantAdded?: (event: ParticipantAddedEvent) => void;
}) {
  useEffect(() => {
    const socket = getSocket();
    socket.connect();

    const handleParticipantAdded = (data: ParticipantAddedEvent) => {
      if (data.conversationId !== conversationId) {
        return;
      }

      onParticipantAdded?.(data);
    };

    socket.on("publish:join", handleParticipantAdded);
    socket.emit("conversation:join", { conversationId });

    return () => {
      socket.off("publish:join", handleParticipantAdded);
    };
  }, [conversationId, onParticipantAdded]);
}
