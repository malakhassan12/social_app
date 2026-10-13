"use client";

// =====================================================
// ToggleParticipantAdminBtn.tsx
// =====================================================

import { Crown, Info, X } from "lucide-react";
import { FC, useState, useTransition } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import toggleParticipantAdmin from "@/actions/chat/toggleParticipantAdmin";

type Props = {
  title: string;
  accountId: string;
  conversationId: string;
  participantId: string;
  participantName?: string;
  participantUsername?: string;
  isAdmin: boolean;
};

const ToggleParticipantAdminBtn: FC<Props> = ({
  title,
  participantId,
  conversationId,
  participantName,
  participantUsername,
  accountId,
  isAdmin,
}) => {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [isAdminNow, setIsAdminNow] = useState(isAdmin);

  const displayName = participantName || "This member";
  const initial = displayName.charAt(0).toUpperCase();
  const promoting = !isAdminNow;

  const handleOpenChange = (next: boolean) => {
    if (pending) return;
    setOpen(next);
  };

  const handlePromote = () => {
    if (!accountId || !conversationId || !participantId) {
      toast.error("Missing participant or conversation ID");
      return;
    }

    startTransition(async () => {
      try {
        const res = await toggleParticipantAdmin(
          participantId,
          conversationId,
          accountId,
        );

        if (!res?.success) {
          toast.error(res?.message || "Failed to update participant role");
          return;
        }

        const nextState = res.isAdminNow as boolean;
        setIsAdminNow(nextState);

        toast.success(
          nextState
            ? `${displayName} is now an admin`
            : `${displayName} is no longer an admin`,
        );
        setOpen(false);
      } catch (err) {
        toast.error("Failed to update participant role");
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
        aria-label={title}
        className="
          flex w-full items-center gap-3
          rounded-lg border border-indigo-200
          bg-indigo-50 px-3 py-2.5
          text-left transition-colors
          hover:bg-indigo-100
          focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-indigo-500/40
          dark:border-indigo-900/50
          dark:bg-indigo-950/20
          dark:hover:bg-indigo-950/40
        "
      >
        <span
          className="
            flex size-9 shrink-0 items-center justify-center
            rounded-lg bg-indigo-500 text-white
          "
        >
          <Crown className="size-4" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-indigo-900 dark:text-indigo-200">
            {title || "Make Admin"}
          </p>
          <p className="truncate text-xs text-indigo-700/80 dark:text-indigo-400/70">
            Grant admin privileges to {displayName}
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
                  rounded-lg bg-indigo-500 text-white
                "
              >
                <Crown className="size-4" />
              </span>
              {title || "Make Admin"}
            </DialogTitle>
            <DialogDescription>
              {promoting
                ? `Grant admin privileges to ${displayName}.`
                : `Remove admin privileges from ${displayName}.`}
            </DialogDescription>
          </DialogHeader>

          {/* Member row */}
          <div className="flex items-center gap-3 rounded-lg border bg-muted/30 px-3 py-2.5">
            <div
              className="
                flex size-10 shrink-0 items-center justify-center
                rounded-full bg-indigo-100 text-sm font-semibold
                text-indigo-700
                dark:bg-indigo-950/50 dark:text-indigo-300
              "
            >
              {initial}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{displayName}</p>
              {participantUsername && (
                <p className="truncate text-xs text-muted-foreground">
                  @{participantUsername}
                </p>
              )}
            </div>

            <span
              className="
                shrink-0 rounded-full border border-indigo-200
                bg-indigo-50 px-2 py-0.5 text-[10px] font-medium
                uppercase tracking-wide text-indigo-700
                dark:border-indigo-900/50 dark:bg-indigo-950/40
                dark:text-indigo-300
              "
            >
              {isAdminNow ? "Admin" : "Member"}
            </span>
          </div>

          {/* Info */}
          <div
            className="
              flex items-start gap-2 rounded-lg
              border border-indigo-200 bg-indigo-50/60
              px-3 py-2.5
              dark:border-indigo-900/50 dark:bg-indigo-950/20
            "
          >
            <Info
              className="
                mt-0.5 size-4 shrink-0 text-indigo-600
                dark:text-indigo-400
              "
            />
            <p className="text-xs leading-relaxed text-indigo-900/90 dark:text-indigo-300/90">
              Admins can manage members, open or close the chat, and edit
              group settings.
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
              onClick={handlePromote}
              disabled={pending}
              className="
                inline-flex h-9 items-center gap-2
                rounded-lg bg-indigo-500 px-4
                text-sm font-medium text-white
                transition-colors
                hover:bg-indigo-600
                focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-indigo-500/40
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
                  {promoting ? "Promoting…" : "Updating…"}
                </>
              ) : (
                <>
                  <Crown className="size-3.5" />
                  {promoting ? "Make Admin" : "Remove Admin"}
                </>
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ToggleParticipantAdminBtn;