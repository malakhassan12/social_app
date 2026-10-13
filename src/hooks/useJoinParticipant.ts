"use client";

import {
  useEffect,
  useState,
} from "react";

import { getSocket } from "@/lib/socket/socket";

export function useJoinParticipant(
  conversationId: string | undefined,
) {
  const [
    participantNames,
    setParticipantNames,
  ] = useState<string[]>([]);

  useEffect(() => {
    if (!conversationId) return;

    const socket = getSocket();

    const handleParticipantJoined = (
      data: {
        conversationId: string;
        message: string;
        participantNames: string[];
      },
    ) => {
      if (
        data.conversationId !==
        conversationId
      ) {
        return;
      }

      console.log(
        "publish:join received",
        data,
      );

      setParticipantNames(
        data.participantNames,
      );
    };

    // 1. Listen first
    socket.on(
      "publish:join",
      handleParticipantJoined,
    );

    // 2. Then connect
    socket.connect();

    
    // 3. Then join room
    socket.emit(
      "conversation:join",
      {
        conversationId,
      },
    );

    return () => {
      socket.off(
        "publish:join",
        handleParticipantJoined,
      );

      socket.emit(
        "conversation:leave",
        {
          conversationId,
        },
      );
    };
  }, [conversationId]);

  return {
    participantNames,
  };
}