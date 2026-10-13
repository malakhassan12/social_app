"use client";

import type { Conversation } from "@/generated/prisma/client";
import { Eye, EyeOff, UserPlus, Users } from "lucide-react";
import type { Account } from "@/types/account.Types";
import type { ConversationParticipantChat } from "./ChatControllerBtn";
import ParticipantActions from "./ParticipantActions";
import useOpenCloseConversation from "@/hooks/useOpenCloseConversation";
import { getSocket } from "@/lib/socket/socket";
import { useCallback, useEffect, useRef, useState } from "react";
import useParticipantRemoved from "@/hooks/useParticipantRemoved";
import useParticipantAdded from "@/hooks/useParticipantAdded";
import getConversationParticipants from "@/helper/chat/getConversationParticipants";
import { toast } from "sonner";

export default function ParticipantsChat({
  conversation,
  initialParticipants,
  account,
  isAdmin,
}: {
  initialParticipants: ConversationParticipantChat[];
  conversation: Conversation;
  account: Account;
  isAdmin: boolean;
}) {
  const [participants, setParticipants] = useState(initialParticipants);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [refreshError, setRefreshError] = useState(false);
  const socketRevision = useRef(0);

  const handleParticipantRemoved = useCallback(
    ({ accountId }: { accountId: string }) => {
      socketRevision.current += 1;
      setParticipants((current) =>
        current.filter((participant) => participant.accountId !== accountId),
      );
    },
    [],
  );

  const handleParticipantAdded = useCallback(
    ({ addedParticipants }: { addedParticipants: ConversationParticipantChat[] }) => {
      socketRevision.current += 1;
      setParticipants((current) => {
        const currentIds = new Set(current.map((participant) => participant.accountId));

        return addedParticipants.reduce((next, participant) => {
          if (!currentIds.has(participant.accountId)) {
            currentIds.add(participant.accountId);
            next.push(participant);
          }
          return next;
        }, [...current]);
      });
    },
    [],
  );

  useEffect(() => {
    let mounted = true;

    const refreshParticipants = async () => {
      try {
        while (mounted) {
          const revisionAtRequest = socketRevision.current;
          const result = await getConversationParticipants(conversation.id);

          if (!mounted) {
            return;
          }

          if (!result.success) {
            setRefreshError(true);
            toast.error(result.message);
            return;
          }

          if (socketRevision.current === revisionAtRequest) {
            setRefreshError(false);
            setParticipants(result.participants);
            return;
          }
        }
      } catch (error: unknown) {
        if (mounted) {
          console.error("Failed to refresh conversation participants:", error);
          setRefreshError(true);
          toast.error("Failed to load conversation participants");
        }
      } finally {
        if (mounted) {
          setIsRefreshing(false);
        }
      }
    };

    void refreshParticipants();

    return () => {
      mounted = false;
    };
  }, [conversation.id]);

  useParticipantRemoved({
    conversationId: conversation.id,
    accountId: account.id,
    onParticipantRemoved: handleParticipantRemoved,
  });

  useParticipantAdded({
    conversationId: conversation.id,
    onParticipantAdded: handleParticipantAdded,
  });

  useEffect(() => {
    const socket = getSocket();
    socket.connect();

    const handleAdminUpdate = (data: {
      conversationId: string;
      accountId: string;
      isAdmin: boolean;
    }) => {
      if (data.conversationId !== conversation.id) {
        return;
      }

      socketRevision.current += 1;
      setParticipants((current) =>
        current.map((participant) =>
          participant.accountId === data.accountId
            ? { ...participant, isAdmin: data.isAdmin }
            : participant,
        ),
      );
    };

    socket.on("participant:admin-updated", handleAdminUpdate);
    socket.emit("conversation:join", { conversationId: conversation.id });

    return () => {
      socket.off("participant:admin-updated", handleAdminUpdate);
    };
  }, [conversation.id]);

  const [isOpenAddition] = useOpenCloseConversation({
    conversationId: conversation.id,
    initialValue: conversation.isOpenAddition,
    type: "addition",
  });

  return (
    <>
      {/* =================================================
              Conversation information
             ================================================= */}

      <div className="border-b bg-muted/20 px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">
              {conversation.name || "Unnamed Group"}
            </p>

            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="size-3" />

              <span>{participants?.length} members</span>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-1.5">
            {/* Chat status */}

            <div
              className={`
                    inline-flex items-center gap-1.5
                    rounded-full
                    px-2.5 py-1
                    text-[10px]
                    font-medium
                    ${
                      conversation.isOpen
                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-800/50"
                        : "bg-red-50 text-red-700 ring-1 ring-red-200 dark:bg-red-950/40 dark:text-red-400 dark:ring-red-800/50"
                    }
                  `}
            >
              {conversation.isOpen ? (
                <Eye className="size-3" />
              ) : (
                <EyeOff className="size-3" />
              )}

              {conversation.isOpen ? "Open" : "Closed"}
            </div>

            {/* Addition status */}

            <div
              className={`
                    inline-flex items-center gap-1.5
                    rounded-full
                    px-2.5 py-1
                    text-[10px]
                    font-medium
                    ${
                      isOpenAddition
                        ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:ring-blue-800/50"
                        : "bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:ring-zinc-800"
                    }
                  `}
            >
              <UserPlus className="size-3" />

              {isOpenAddition ? "Addition On" : "Addition Off"}
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
              Participants
             ================================================= */}

      <div className="border-b">
        <div className="flex items-center justify-between px-5 py-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Users className="size-3.5 text-muted-foreground" />
            Members
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              {isRefreshing ? "…" : refreshError ? "—" : participants.length}
            </span>
          </h3>
        </div>

        <div className="max-h-60 overflow-y-auto px-3 pb-3">
          {isRefreshing ? (
            <p className="px-2 py-8 text-center text-xs text-muted-foreground">
              Refreshing members…
            </p>
          ) : refreshError ? (
            <p className="px-2 py-8 text-center text-xs text-destructive" role="alert">
              Could not load members. Reopen the chat actions to try again.
            </p>
          ) : participants.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-2 py-8">
              <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                <Users className="size-4 text-muted-foreground" />
              </div>

              <p className="text-xs text-muted-foreground">No members found.</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {participants.map((participant) => {
                return (
                  <ParticipantActions
                    key={participant.id}
                    participant={participant}
                    accountId={account.id}
                    isAdmin={isAdmin}
                    participantId={participant.accountId}
                    conversationId={conversation.id}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
