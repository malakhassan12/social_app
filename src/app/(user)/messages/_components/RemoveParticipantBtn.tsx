"use client";

// =====================================================
// RemoveParticipantBtn.tsx
// =====================================================

import { AlertTriangle, UserMinus, X } from "lucide-react";
import { FC, useState, useTransition } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import removeParticipant from "@/actions/chat/removeParticipant";

type Props = {
  title: string;
  accountId: string;
  conversationId: string;
  participantId: string;
  participantName?: string;
  participantUsername?: string;
};

const RemoveParticipantBtn: FC<Props> = ({
  title,
  participantId,
  conversationId,
  participantName,
  participantUsername,
  accountId,
}) => {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const displayName = participantName || "This member";
  const initial = displayName.charAt(0).toUpperCase();

  const handleOpenChange = (next: boolean) => {
    if (pending) return;
    setOpen(next);
  };

  const handleRemove = () => {
    if (!accountId || !conversationId || !participantId) {
      toast.error("Missing participant or conversation ID");
      return;
    }

    startTransition(async () => {
      try {
        const res = await removeParticipant(
          participantId,
          conversationId,
          accountId,
        );

        if (!res?.success) {
          toast.error(res.message || "Failed to remove participant");
          return;
        }

        toast.success("Participant removed");
        setOpen(false);
      } catch (err) {
        toast.error("Failed to remove participant");
        console.error(err);
      }
    });
  };

  return (
    <>
      {/* =================================================
          Trigger — labeled danger action
         ================================================= */}

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        aria-label={title}
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
            bg-red-100 text-red-600
            ring-1 ring-red-200
            transition-colors
            group-hover:bg-red-200
            dark:bg-red-950/50
            dark:text-red-400
            dark:ring-red-800/50
          "
        >
          <UserMinus className="size-4" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-red-700 dark:text-red-400">
            {title || "Remove Participant"}
          </p>
          <p className="truncate text-[10px] text-red-600/70 dark:text-red-400/60">
            Remove {displayName} from the group
          </p>
        </div>
      </button>

      {/* =================================================
          Confirmation dialog
         ================================================= */}

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="
            flex max-h-[85vh] w-full flex-col gap-0 overflow-hidden p-0
            sm:max-w-sm
          "
        >
          {/* ---------------------------------------------
              Header
             --------------------------------------------- */}

          <div className="shrink-0 border-b bg-linear-to-br from-red-500/5 via-muted/30 to-transparent px-5 pb-5 pt-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-base">
                <span
                  className="
                    flex size-9 items-center justify-center
                    rounded-xl
                    bg-red-100 text-red-600
                    ring-1 ring-red-200
                    dark:bg-red-950/50
                    dark:text-red-400
                    dark:ring-red-800/50
                  "
                >
                  <UserMinus className="size-4" />
                </span>
                <div className="flex flex-col gap-0.5">
                  <span>{title || "Remove Participant"}</span>
                  <DialogDescription className="text-xs font-normal">
                    This action takes effect immediately
                  </DialogDescription>
                </div>
              </DialogTitle>
            </DialogHeader>
          </div>

          {/* ---------------------------------------------
              Body
             --------------------------------------------- */}

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
            {/* Member preview */}

            <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-3 py-3">
              <div
                className="
                  flex size-10 shrink-0 items-center justify-center
                  rounded-full
                  bg-red-100 text-red-600
                  text-sm font-bold
                  ring-1 ring-red-200
                  dark:bg-red-950/50
                  dark:text-red-400
                  dark:ring-red-800/50
                "
              >
                {initial}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {displayName}
                </p>
                {participantUsername && (
                  <p className="truncate text-[11px] text-muted-foreground">
                    @{participantUsername}
                  </p>
                )}
              </div>
            </div>

            {/* Warning banner */}

            <div
              className="
                mt-4 flex items-start gap-2.5
                rounded-xl
                border border-amber-200/70
                bg-amber-50/60
                px-3 py-2.5
                dark:border-amber-900/40
                dark:bg-amber-950/20
              "
            >
              <AlertTriangle
                className="
                  mt-0.5 size-4 shrink-0
                  text-amber-600
                  dark:text-amber-500
                "
              />

              <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300/90">
                They will lose access to this conversation immediately. They
                can be added back later if addition is open.
              </p>
            </div>
          </div>

          {/* ---------------------------------------------
              Footer
             --------------------------------------------- */}

          <div
            className="
              flex shrink-0 items-center justify-end gap-2
              border-t bg-muted/20 px-5 py-3
            "
          >
            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              disabled={pending}
              className="
                inline-flex h-9 items-center justify-center gap-1.5
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
              <X className="size-3.5" />
              Cancel
            </button>

            <button
              type="button"
              onClick={handleRemove}
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
                  Removing…
                </>
              ) : (
                <>
                  <UserMinus className="size-3.5" />
                  Remove
                </>
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RemoveParticipantBtn;