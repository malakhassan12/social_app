"use client";

import exitChat from "@/actions/chat/exitChat";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useState, useTransition } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ExitGroupBtn: FC<{
  accountId: string;
  conversationId: string;
}> = ({ accountId, conversationId }) => {
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleExit = () => {
    if (!accountId) {
      toast.error("Account ID is required");
      return;
    }
    if (!conversationId) {
      toast.error("Conversation ID is required");
      return;
    }

    startTransition(async () => {
      const result = await exitChat(accountId, conversationId);

      if (!result.success) {
        toast.error(result.message || "Failed to leave conversation");
        return;
      }

      toast.success(result.message || "You left the conversation");

      router.replace('/messages')

      window.location.href = "/messages";
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* =================================================
          Trigger — the exit button
         ================================================= */}

      <DialogTrigger
        type="button"
        className="
          group flex w-full items-center gap-3
          rounded-xl
          border border-red-200/60
          bg-red-50/40
          px-3 py-2.5
          text-left
          transition-all duration-150
          hover:border-red-300
          hover:bg-red-50
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-red-500/40
          focus-visible:ring-offset-2
          active:scale-[0.99]
          dark:border-red-900/40
          dark:bg-red-950/20
          dark:hover:bg-red-950/40
        "
      >
        <span
          className="
            flex size-8 shrink-0 items-center justify-center
            rounded-lg
            bg-red-100
            text-red-600
            ring-1 ring-red-200
            transition-colors
            group-hover:bg-red-200
            dark:bg-red-950/50
            dark:text-red-400
            dark:ring-red-800/50
          "
        >
          <LogOut className="size-4" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-red-700 dark:text-red-400">
            Exit Group
          </p>
          <p className="text-[10px] text-red-600/70 dark:text-red-400/60">
            Leave this conversation
          </p>
        </div>
      </DialogTrigger>

      {/* =================================================
          Confirmation dialog
         ================================================= */}

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span
              className="
                flex size-8 items-center justify-center
                rounded-lg
                bg-red-100 text-red-600
                ring-1 ring-red-200
                dark:bg-red-950/50 dark:text-red-400 dark:ring-red-800/50
              "
            >
              <LogOut className="size-4" />
            </span>
            Exit this group?
          </DialogTitle>

          <DialogDescription className="pt-2 text-sm">
            You will leave this conversation and won&apos;t receive new messages
            unless you&apos;re added back.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            disabled={pending}
            className="
              inline-flex h-9 items-center justify-center
              rounded-lg
              border border-border/60
              bg-background
              px-4 text-sm font-medium
              transition-colors
              hover:bg-muted/60
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-ring
              focus-visible:ring-offset-2
              disabled:pointer-events-none disabled:opacity-50
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleExit}
            disabled={pending}
            className="
              inline-flex h-9 items-center justify-center gap-2
              rounded-lg
              bg-red-600 px-4 text-sm font-medium text-white
              transition-colors
              hover:bg-red-700
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-red-500/40
              focus-visible:ring-offset-2
              disabled:pointer-events-none disabled:opacity-50
              dark:bg-red-600 dark:hover:bg-red-500
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
                Leaving…
              </>
            ) : (
              <>
                <LogOut className="size-3.5" />
                Exit Group
              </>
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExitGroupBtn;
