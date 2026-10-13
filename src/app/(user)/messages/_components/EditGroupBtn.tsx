"use client";
// =====================================================
// EditGroupBtn.tsx
// =====================================================

import { Pencil } from "lucide-react";
import { FC, useState, useTransition } from "react";
import { toast } from "sonner";
import ConversationData from "./ConversationData";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Conversation } from "@/generated/prisma/client";
import Form from "next/form";
import EditConversationData from "@/actions/chat/EditConversationData";

type Props = {
  conversation: Conversation;
  accountId: string;
};

const EditGroupBtn: FC<Props> = ({ conversation, accountId }) => {
  const initialName = conversation.name;
  const initialImage = conversation.image;
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [groupName, setGroupName] = useState(initialName ?? "");
  const [groupImage, setGroupImage] = useState<string | null>(
    initialImage ?? null,
  );

  const handleOpenChange = (next: boolean) => {
    if (pending) return;
    setOpen(next);

    // Reset form on close.
    if (!next) {
      setGroupName(initialName ?? "");
      setGroupImage(initialImage ?? null);
    }
  };

  const handleSubmit = (formData: FormData) => {
    const trimmed = groupName.trim();

    if (trimmed.length < 2) {
      toast.error("Group name must be at least 2 characters");
      return;
    }

    startTransition(async () => {
      try {
        const result = await EditConversationData(
          conversation.id,
          formData,
          accountId,
        );

        if (!result.success) {
          const errorMessage =
            result.message ||
            Object.values(result.errors ?? {})
              .flat()
              .join(", ") ||
            "Failed to update group";

          toast.error(errorMessage);

          return;
        }
        toast.success(result.message || "Group updated successfully");

        setOpen(false);
      } catch (err) {
        console.error(err);

        toast.error("Failed to update group");
      }
    });
  };

  const hasChanges =
    groupName.trim() !== (initialName ?? "").trim() ||
    groupImage !== (initialImage ?? null);

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
          hover:border-violet-300/60
          hover:bg-violet-50/40
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-violet-500/40
          focus-visible:ring-offset-2
          active:scale-[0.99]
          dark:hover:border-violet-800/60
          dark:hover:bg-violet-950/20
        "
      >
        <span
          className="
            flex size-8 shrink-0 items-center justify-center
            rounded-lg
            bg-violet-50
            text-violet-600
            ring-1 ring-violet-200
            transition-colors
            group-hover:bg-violet-100
            dark:bg-violet-950/40
            dark:text-violet-400
            dark:ring-violet-800/50
          "
        >
          <Pencil className="size-4" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">Edit Group</p>
          <p className="text-[10px] text-muted-foreground">
            Change name, image and settings
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

          <div
            className="
              shrink-0 border-b
              bg-linear-to-br from-violet-500/5 via-muted/30 to-transparent
              px-5 pb-5 pt-6
            "
          >
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-base">
                <span
                  className="
                    flex size-9 items-center justify-center
                    rounded-xl
                    bg-violet-100 text-violet-600
                    ring-1 ring-violet-200
                    dark:bg-violet-950/50
                    dark:text-violet-400
                    dark:ring-violet-800/50
                  "
                >
                  <Pencil className="size-4" />
                </span>
                <div className="flex flex-col gap-0.5">
                  <span>Edit Group</span>
                  <DialogDescription className="text-xs font-normal">
                    Update the name, image, or settings
                  </DialogDescription>
                </div>
              </DialogTitle>
            </DialogHeader>
          </div>

          {/* ---------------------------------------------
              Body
             --------------------------------------------- */}

          <Form
            action={handleSubmit}
            className="min-h-0 flex-1 overflow-y-auto"
          >
            <div className="px-5 py-4">
              <ConversationData
                groupName={groupName}
                setGroupName={setGroupName}
                pending={pending}
                // If ConversationData accepts these, pass them too:
                // groupImage={groupImage}
                // setGroupImage={setGroupImage}
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
              <button
                type="submit"
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
                type="submit"
                disabled={pending || !hasChanges || groupName.trim().length < 2}
                className="
                inline-flex h-9 items-center justify-center gap-2
                rounded-lg
                bg-violet-600 px-4 text-sm font-medium text-white
                transition-colors
                hover:bg-violet-700
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-violet-500/40
                focus-visible:ring-offset-2
                disabled:pointer-events-none disabled:opacity-50
                dark:bg-violet-600 dark:hover:bg-violet-500
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
                    Saving…
                  </>
                ) : (
                  <>
                    <Pencil className="size-3.5" />
                    Save Changes
                  </>
                )}
              </button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditGroupBtn;
