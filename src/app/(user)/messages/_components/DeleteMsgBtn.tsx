"use client";

import { FC, useTransition } from "react";
import { toast } from "sonner";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import deleteMessage from "@/actions/chat/deleteMessage";

interface DeleteMsgBtnProps {
  messageId: string;
  currentAccountId: string;
  onDeleted?: (messageId: string) => void; // for optimistic removal
  closeMenu: () => void;
}

const DeleteMsgBtn: FC<DeleteMsgBtnProps> = ({
  messageId,
  currentAccountId,
  onDeleted,
  closeMenu,
}) => {
  const [pending, startTransition] = useTransition();

  const handleDelete = () => {
    closeMenu();
    startTransition(async () => {
      // Optimistic: remove from UI immediately
      onDeleted?.(messageId);

      const res = await deleteMessage({
        messageId,
        accountId: currentAccountId,
      });

      if (!res.success) {
        toast.error(res.message || "Failed to delete");
        // Refresh to restore if failed
        return;
      }

      toast.success("Message deleted");
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={pending}
          className="
            w-full justify-start gap-2 
            text-red-600 hover:text-red-700 hover:bg-red-50
            dark:text-red-500 dark:hover:text-red-400 dark:hover:bg-red-950/30
            rounded-md
            transition-colors
          "
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          <span>Delete</span>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-md rounded-2xl">
        <AlertDialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-2">
            <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>

          <AlertDialogTitle className="text-center text-lg font-semibold">
            Delete message?
          </AlertDialogTitle>

          <AlertDialogDescription className="text-center text-sm text-gray-500 dark:text-gray-400">
            This message will be permanently deleted for everyone. This action
            can&apos;t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="sm:justify-center gap-2 mt-4">
          <AlertDialogCancel className="rounded-full min-w-25">
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            disabled={pending}
            className="
              rounded-full min-w-25
              bg-red-600 hover:bg-red-700 
              dark:bg-red-600 dark:hover:bg-red-700
              text-white
              shadow-md shadow-red-500/20
            "
          >
            {pending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteMsgBtn;
