"use client";

import { useMemo, useState } from "react";
import { BubbleReactions } from "@/components/ui/bubble";
import { REACTIONS } from "@/constants/Reaction.constants";
import { MessageReactionType } from "@/generated/prisma/enums";
import { MessageWithSender } from "./MessageItem";
import MessageCURDBtn from "./MessageCURDBtn";

export default function MessageReactions({
  isOwn,
  message,
  currentAccountId,
  conversationId,
  closeMenu
}: {
  isOwn: boolean;
  message: MessageWithSender;
  currentAccountId: string;
  conversationId: string;
    closeMenu: () => void;
}) {
  // Reset the optimistic override when new server reactions arrive.
  const [reactionState, setReactionState] = useState<{
    reactions: typeof message.messageReactions;
    override: MessageReactionType | null | undefined;
  }>({ reactions: message.messageReactions, override: undefined });

  if (reactionState.reactions !== message.messageReactions) {
    setReactionState({ reactions: message.messageReactions, override: undefined });
  }
  const override = reactionState.reactions === message.messageReactions
    ? reactionState.override
    : undefined;
  const setOverride = (value: MessageReactionType | null | undefined) => {
    setReactionState({ reactions: message.messageReactions, override: value });
  };

  const serverMine =
    message.messageReactions?.find((r) => r.accountId === currentAccountId)?.type ?? null;
  const myReaction = override === undefined ? serverMine : override;

  const groupedReactions = useMemo(() => {
    const acc = {} as Record<MessageReactionType, { count: number; reacted: boolean }>;
    const add = (type: MessageReactionType, mine: boolean) => {
      acc[type] ??= { count: 0, reacted: false };
      acc[type].count += 1;
      if (mine) acc[type].reacted = true;
    };

    for (const r of message.messageReactions ?? []) {
      if (r.accountId === currentAccountId) continue; // replaced by myReaction below
      add(r.type, false);
    }
    if (myReaction) add(myReaction, true);

    return acc;
  }, [message.messageReactions, currentAccountId, myReaction]);

  const hasReactions = Object.keys(groupedReactions).length > 0;

  return (
    <>
      {hasReactions && (
        <BubbleReactions
          role="group"
          aria-label="Message reactions"
          className={`
            absolute! -bottom-3 z-10
            ${isOwn ? "right-1" : "left-1"}
            flex! items-center gap-0.5
            rounded-full bg-white px-1.5 py-0.5
            ring-1 ring-black/5 shadow-sm
            dark:bg-gray-900 dark:ring-white/10 mt-0!
          `}
        >
          {(Object.entries(groupedReactions) as [MessageReactionType, { count: number; reacted: boolean }][]).map(
            ([type, data]) => {
              const config = REACTIONS.find((r) => r.type === type);
              if (!config) return null;
              return (
                <span key={type} className="inline-flex items-center gap-0.5 text-[11px]" title={config.label}>
                  {config.emoji}
                  {data.count > 1 && (
                    <span className="text-[9px] font-semibold text-gray-600 dark:text-gray-300">
                      {data.count}
                    </span>
                  )}
                </span>
              );
            },
          )}
        </BubbleReactions>
      )}

      <MessageCURDBtn
        isOwn={isOwn}
        message={message}
        currentAccountId={currentAccountId}
        conversationId={conversationId}
        myReaction={myReaction}
        onOptimisticReaction={setOverride}
        closeMenu={closeMenu}
      />
    </>
  );
}