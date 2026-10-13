"use client";

import { FC, useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SmilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import reactToMessage from "@/actions/chat/reactToMessage";
import { MessageReactionType } from "@/generated/prisma/enums";
import { REACTIONS } from "@/constants/Reaction.constants";

interface LikeMsgBtnProps {
  messageId: string;
  currentReaction?: MessageReactionType | null;
  currentAccountId: string;
  onOptimisticReaction: (value: MessageReactionType | null | undefined) => void;
  closeMenu: () => void;
}

const LikeMsgBtn: FC<LikeMsgBtnProps> = ({
  messageId,
  currentReaction,
  currentAccountId,
  onOptimisticReaction,
  closeMenu,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [optimisticReaction, setOptimisticReaction] =
    useState<MessageReactionType | null>(currentReaction ?? null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleReact = (type: MessageReactionType) => {
    const newReaction = optimisticReaction === type ? null : type;
    setOptimisticReaction(newReaction);
    onOptimisticReaction(newReaction); // update the bubble instantly
    setIsOpen(false);

    closeMenu();

    startTransition(async () => {
      const res = await reactToMessage({
        accountId: currentAccountId,
        messageId,
        type,
      });

      if (!res.success) {
        setOptimisticReaction(currentReaction ?? null);
        onOptimisticReaction(undefined); // rollback: trust the server again
        toast.error(res?.message || "Failed to react");
        return;
      }

      router.refresh();
    });
  };

  // Active reaction
  const activeReaction = REACTIONS.find((r) => r.type === optimisticReaction);

  return (
    <div ref={pickerRef} className="relative">
      {/* Trigger button */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onPointerDown={(event) => {
          event.stopPropagation();
        }}
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
        disabled={pending}
        className={`
    h-7 w-7 rounded-full transition-all
    ${activeReaction ? "bg-purple-50 dark:bg-purple-900/20" : ""}
  `}
        aria-label="Add reaction"
      >
        {activeReaction ? (
          <span className="text-sm">{activeReaction.emoji}</span>
        ) : (
          <SmilePlus className="h-4 w-4 text-gray-400" />
        )}
      </Button>

      {/* Reaction picker */}
      {isOpen && (
        <div className=" absolute bottom-full right-0 mb-2 z-100 flex items-center gap-0.5 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg shadow-black/5 px-1.5 py-1 whitespace-nowrap">
          {REACTIONS.map((reaction, index) => {
            const isActive = optimisticReaction === reaction.type;

            return (
              <button
                key={reaction.type}
                type="button"
                onClick={() => handleReact(reaction.type)}
                disabled={pending}
                className={` group relative flex items-center justify-center h-9 w-9 rounded-full text-xl transition-all duration-150 hover:scale-125 hover:-translate-y-1 active:scale-95 ${isActive ? "scale-110 bg-purple-50 dark:bg-purple-900/20" : ""} animate-in fade-in-0 zoom-in-50`}
                style={{ animationDelay: `${index * 30}ms` }}
                aria-label={reaction.label}
                title={reaction.label}
              >
                <span>{reaction.emoji}</span>

                {/* Active dot indicator */}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-purple-500" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LikeMsgBtn;
