"use client";
import { UserPlus, Users } from "lucide-react";
import SelectParticipant from "./SelectParticipant";
import { FC, useState, useTransition } from "react";
import { toast } from "sonner";
import AddParticipant from "@/actions/chat/AddParticipant";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Account } from "@/types/account.Types";

const AddParticipantBtn: FC<{
  accountId: string;
  conversationId: string;
  initialAccounts: {
    id: string;
    username: string;
    email: { email: string };
    image: string | null;
  }[];
  initialPage: number;
  initialHasNextPage: boolean;
}> = ({
  accountId,
  conversationId,
  initialAccounts,
  initialPage,
  initialHasNextPage,
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();

  const handleOpenChange = (next: boolean) => {
    // Prevent closing while the request is running.
    if (pending) return;

    setOpen(next);

    // Clear the selection whenever the dialog closes.
    if (!next) {
      setSelected(new Set());
    }
  };

  const handleSubmit = () => {
    const selectedIds = Array.from(selected);

    if (selectedIds.length === 0) {
      toast.error("Select at least one account");
      return;
    }

    if (!conversationId) {
      toast.error("Conversation ID is required");
      return;
    }

    startTransition(async () => {
      const res = await AddParticipant(selectedIds, conversationId, accountId);

      if (!res.success) {
        toast.error(res?.message || "Failed to add participants");
        return;
      }

      toast.success("Participants added successfully");
      setSelected(new Set());
      setOpen(false);
    });
  };

  return (
    <>
      {/* =================================================
          Trigger
         ================================================= */}

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="
          group flex w-full items-center gap-3
          rounded-xl
          border border-border/60
          bg-card
          px-3 py-2.5
          text-left
          transition-all duration-150
          hover:border-emerald-300/60
          hover:bg-emerald-50/40
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-emerald-500/40
          focus-visible:ring-offset-2
          active:scale-[0.99]
          dark:hover:border-emerald-800/60
          dark:hover:bg-emerald-950/20
        "
      >
        <span
          className="
            flex size-8 shrink-0 items-center justify-center
            rounded-lg
            bg-emerald-50
            text-emerald-600
            ring-1 ring-emerald-200
            transition-colors
            group-hover:bg-emerald-100
            dark:bg-emerald-950/40
            dark:text-emerald-400
            dark:ring-emerald-800/50
          "
        >
          <UserPlus className="size-4" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">Add Participant</p>
          <p className="text-[10px] text-muted-foreground">
            Invite someone to this chat
          </p>
        </div>
      </button>

      {/* =================================================
          Dialog
         ================================================= */}

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="
            flex max-h-[85vh] w-full flex-col gap-0 overflow-hidden p-0
            sm:max-w-md
          "
        >
          {/* ---------------------------------------------
              Header
             --------------------------------------------- */}

          <div className="shrink-0 border-b bg-linear-to-br from-emerald-500/5 via-muted/30 to-transparent px-5 pb-5 pt-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-base">
                <span
                  className="
                    flex size-9 items-center justify-center
                    rounded-xl
                    bg-emerald-100 text-emerald-600
                    ring-1 ring-emerald-200
                    dark:bg-emerald-950/50 dark:text-emerald-400 dark:ring-emerald-800/50
                  "
                >
                  <UserPlus className="size-4" />
                </span>
                <div className="flex flex-col gap-0.5">
                  <span>Add Participants</span>
                  <DialogDescription className="text-xs font-normal">
                    Choose people to add to this conversation
                  </DialogDescription>
                </div>
              </DialogTitle>
            </DialogHeader>
          </div>

          {/* ---------------------------------------------
              Body — scrollable participant list
             --------------------------------------------- */}

          <div className="min-h-0 flex-1 overflow-y-auto">
            <SelectParticipant
              accountId={accountId}
              initialAccounts={initialAccounts as Account[]}
              initialPage={initialPage}
              initialHasNextPage={initialHasNextPage}
              selected={selected}
              setSelected={setSelected}
              pending={pending}
            />
          </div>

          {/* ---------------------------------------------
              Footer
             --------------------------------------------- */}

          <DialogFooter
            className="
              shrink-0 gap-2 border-t bg-muted/20 px-5 py-3
              sm:gap-2
            "
          >
            <div className="mr-auto hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
              <Users className="size-3.5" />
              <span>{selected.size} selected</span>
            </div>

            <button
              type="button"
              onClick={() => handleOpenChange(false)}
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
              onClick={handleSubmit}
              disabled={pending || selected.size === 0}
              className="
                inline-flex h-9 items-center justify-center gap-2
                rounded-lg
                bg-emerald-600 px-4 text-sm font-medium text-white
                transition-colors
                hover:bg-emerald-700
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-emerald-500/40
                focus-visible:ring-offset-2
                disabled:pointer-events-none disabled:opacity-50
                dark:bg-emerald-600 dark:hover:bg-emerald-500
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
                  Adding…
                </>
              ) : (
                <>
                  <UserPlus className="size-3.5" />
                  Add
                  {selected.size > 0 && (
                    <span
                      className="
                        rounded-full bg-white/20 px-1.5 py-0.5
                        text-[10px] font-semibold
                      "
                    >
                      {selected.size}
                    </span>
                  )}
                </>
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddParticipantBtn;
