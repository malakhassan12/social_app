"use client";

// =====================================================
// ShowParticipantsSeenBtn.tsx
// =====================================================

import { Message } from "@/generated/prisma/client";
import { CheckCheck, Eye } from "lucide-react";
import { FC, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type SeenRead = {
  accountId: string;
  readAt: Date | string;
  account: {
    id: string;
    username: string;
    image: string | null;
  };
};

type Props = {
  message: Message & {
    messageReads?: SeenRead[];
  };
  closeMenu: () => void;
};

const ShowParticipantsSeenBtn: FC<Props> = ({ message }) => {
  const [open, setOpen] = useState(false);

  const readers = message.messageReads ?? [];
  const count = readers.length;

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        aria-label="Show who saw this message"
        className="
          inline-flex items-center gap-1.5
          rounded-md border border-border/60
          bg-background px-2 py-1
          text-xs font-medium text-muted-foreground
          transition-colors
          hover:bg-muted hover:text-foreground
          focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-ring
        "
      >
        <Eye className="size-3.5" />
        {count > 0 ? `${count} seen` : "Seen by"}
      </button>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2.5 text-base">
              <span
                className="
                  flex size-9 items-center justify-center
                  rounded-lg bg-emerald-500 text-white
                "
              >
                <CheckCheck className="size-4" />
              </span>
              Seen by
            </DialogTitle>
            <DialogDescription>
              {count > 0
                ? `${count} ${count === 1 ? "person has" : "people have"} read this message.`
                : "No one has read this message yet."}
            </DialogDescription>
          </DialogHeader>

          {/* List */}
          {count > 0 ? (
            <div className="max-h-72 space-y-1 overflow-y-auto">
              {readers.map((r) => {
                const displayName = r.account.username || "Unknown";
                const initial = displayName.charAt(0).toUpperCase();

                return (
                  <div
                    key={r.accountId}
                    className="
                      flex items-center gap-3
                      rounded-lg border border-border/60
                      bg-muted/30 px-3 py-2
                    "
                  >
                    {r.account.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={r.account.image}
                        alt={displayName}
                        className="size-8 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className="
                          flex size-8 shrink-0 items-center justify-center
                          rounded-full bg-emerald-100 text-xs font-semibold
                          text-emerald-700
                          dark:bg-emerald-950/50 dark:text-emerald-300
                        "
                      >
                        {initial}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {displayName}
                      </p>
                    </div>

                    <span className="shrink-0 text-[10px] text-muted-foreground">
                      {new Date(r.readAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              className="
                flex items-center justify-center
                rounded-lg border border-dashed border-border/70
                bg-muted/20 px-4 py-6
              "
            >
              <p className="text-xs text-muted-foreground">No reads yet.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShowParticipantsSeenBtn;
