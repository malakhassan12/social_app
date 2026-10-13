"use client";

import useOpenCloseConversation from "@/hooks/useOpenCloseConversation";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Conversation } from "@/generated/prisma/client";
import { FC, useOptimistic, useTransition } from "react";

type Props = {
  onAction: (value: boolean) => Promise<unknown>;
  conversation: Conversation;
  type: "addition" | "manage";
  isAdmin: boolean;
};

const SwitchChatBtn: FC<Props> = ({
  onAction,
  conversation,
  type,
  isAdmin,
}) => {
  const id = `switch-${type}`;

  const conversationId = conversation.id;

  const [isOpen, setIsOpen] = useOpenCloseConversation({
    conversationId,
    initialValue:
      type === "manage" ? conversation.isOpen : conversation.isOpenAddition,
    type,
  });

  const [optimistic, setOptimistic] = useOptimistic<boolean>(isOpen);

  const [isPending, startTransition] = useTransition();
  const label =
    type === "manage"
      ? isOpen
        ? "Close chat"
        : "Open chat"
      : isOpen
        ? "Close addition"
        : "Open addition";

  const handleChange = (next: boolean) => {
    if (isPending) {
      return;
    }

    const previous = isOpen;

    startTransition(async () => {
      setOptimistic(next);
      setIsOpen(next);

      try {
        await onAction(next);
      } catch (error) {
        setOptimistic(previous);
        setIsOpen(previous);

        console.error("Switch action failed:", error);
      }
    });
  };


  return (
    <>
      {isAdmin && (
        <div
          className="
        flex items-center justify-between gap-3
        rounded-xl
        border border-border/60
        bg-card
        px-3 py-2.5
        transition-colors
        hover:bg-muted/50
        data-[pending=true]:opacity-70
      "
          data-pending={isPending}
        >
          <Label
            htmlFor={id}
            className={`
          cursor-pointer
          text-sm
          font-medium
          ${isPending ? "cursor-wait" : ""}
        `}
          >
            {label}
          </Label>

          <Switch
            id={id}
            checked={optimistic}
            onCheckedChange={handleChange}
            disabled={isPending}
            className="shrink-0"
          />
        </div>
      )}
      
    </>
  );
};

export default SwitchChatBtn;
