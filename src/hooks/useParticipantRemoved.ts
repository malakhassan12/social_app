"use client";

import { getSocket } from "@/lib/socket/socket";
import { useEffect, useState } from "react";

type ParticipantRemovedEvent = {
  conversationId: string;
  accountId: string;
  name: string;
  participantName: string;
  createdAt?: string;
};

type ParticipantAddedEvent = {
  conversationId: string;
  addedParticipants: { accountId: string }[];
};

export type { ParticipantRemovedEvent };

type Props = {
  conversationId: string;
  accountId: string;
  onParticipantRemoved?: (data: ParticipantRemovedEvent) => void;
};

export default function useParticipantRemoved({
  conversationId,
  accountId,
  onParticipantRemoved,
}: Props) {
  const [wasRemoved, setWasRemoved] = useState(false);
  const [nameRemoved, setNameRemoved] = useState("");

  useEffect(() => {
    const socket = getSocket();
    socket.connect();

    const handleParticipantRemoved = (data: ParticipantRemovedEvent) => {
      if (data.conversationId !== conversationId) {
        return;
      }

      onParticipantRemoved?.(data);

      if (data.accountId === accountId) {
        setWasRemoved(true);
        setNameRemoved(data.name);
      }
    };

    const handleParticipantAdded = (data: ParticipantAddedEvent) => {
      if (
        data.conversationId !== conversationId ||
        !data.addedParticipants.some(
          (participant) => participant.accountId === accountId,
        )
      ) {
        return;
      }

      setWasRemoved(false);
      setNameRemoved("");
    };

    socket.on("participant:removed", handleParticipantRemoved);
    socket.on("publish:join", handleParticipantAdded);
    socket.emit("conversation:join", { conversationId });

    return () => {
      socket.off("participant:removed", handleParticipantRemoved);
      socket.off("publish:join", handleParticipantAdded);
    };
  }, [accountId, conversationId, onParticipantRemoved]);

  return { wasRemoved, nameRemoved };
}
