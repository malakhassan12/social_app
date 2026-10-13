"use client";

// =====================================================
// RemoveConversationBtn.tsx
// =====================================================

import { Conversation } from "@/generated/prisma/client";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import removeConversation from "@/actions/chat/removeConversation";
import { Account } from "@/types/account.Types";
import { useRouter } from "next/navigation";

type Props = {
  conversation: Conversation;
  account: Account;
};

export default function RemoveConversationBtn({
  conversation,
  account,
}: Props) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const router = useRouter();
  const handleOpenChange = (next: boolean) => {
    if (pending) return;
    setOpen(next);
  };

  const handleRemove = () => {
    if (!conversation?.id) {
      toast.error("Missing conversation ID");
      return;
    }

    startTransition(async () => {
      try {
        const res = await removeConversation(conversation.id, account.id);

        if (!res?.success) {
          toast.error(res?.message || "Failed to remove conversation");
          return;
        }

        toast.success("Conversation removed");
        setOpen(false);

        router.replace("/messages");

        window.location.href = "/messages";
      } catch (err) {
        toast.error("Failed to remove conversation");
        console.error(err);
      }
    });
  };

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        aria-label="Remove conversation"
        className="
          flex w-full items-center gap-3
          rounded-lg border border-red-200
          bg-red-50 px-3 py-2.5
          text-left transition-colors
          hover:bg-red-100
          focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-red-500/40
          dark:border-red-900/50
          dark:bg-red-950/20
          dark:hover:bg-red-950/40
        "
      >
        <span
          className="
            flex size-9 shrink-0 items-center justify-center
            rounded-lg bg-red-500 text-white
          "
        >
          <Trash2 className="size-4" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-red-900 dark:text-red-200">
            Remove Conversation
          </p>
          <p className="truncate text-xs text-red-700/80 dark:text-red-400/70">
            Permanently delete this chat
          </p>
        </div>
      </button>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2.5 text-base">
              <span
                className="
                  flex size-9 items-center justify-center
                  rounded-lg bg-red-500 text-white
                "
              >
                <Trash2 className="size-4" />
              </span>
              Remove Conversation
            </DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>

          {/* Warning */}
          <div
            className="
              flex items-start gap-2 rounded-lg
              border border-red-200 bg-red-50/60
              px-3 py-2.5
              dark:border-red-900/50 dark:bg-red-950/20
            "
          >
            <AlertTriangle
              className="
                mt-0.5 size-4 shrink-0 text-red-600
                dark:text-red-400
              "
            />
            <p className="text-xs leading-relaxed text-red-900/90 dark:text-red-300/90">
              The conversation and all its messages will be permanently deleted
              for everyone.
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              disabled={pending}
              className="
                inline-flex h-9 items-center gap-1.5
                rounded-lg border bg-background px-4
                text-sm font-medium transition-colors
                hover:bg-muted
                focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-ring
                disabled:pointer-events-none disabled:opacity-50
              "
            >
              <X className="size-3.5" />
              Cancel
            </button>

            <button
              type="button"
              onClick={handleRemove}
              disabled={pending}
              className="
                inline-flex h-9 items-center gap-2
                rounded-lg bg-red-500 px-4
                text-sm font-medium text-white
                transition-colors
                hover:bg-red-600
                focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-red-500/40
                disabled:pointer-events-none disabled:opacity-50
              "
            >
              {pending ? (
                <>
                  <span
                    className="
                      size-3.5 animate-spin rounded-full
                      border-2 border-white/40 border-t-white
                    "
                  />
                  Removing…
                </>
              ) : (
                <>
                  <Trash2 className="size-3.5" />
                  Remove
                </>
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
