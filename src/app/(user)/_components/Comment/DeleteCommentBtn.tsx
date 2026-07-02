"use client";

import { FC, useState } from "react";
import { Trash2, AlertTriangle, } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteComment } from "@/actions/comment/deleteComment";
import { toast } from "sonner";
import { Comment } from "@/types/comment.Types";

interface DeleteCommentBtnProps {
  comment: Comment;
}

const DeleteCommentBtn: FC<DeleteCommentBtnProps> = ({ comment }) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async () => {
    setIsPending(true);
    const state = await deleteComment(comment);
    const message = state?.errors?.message;

    if (message) {
      toast.error(message, { position: "top-center" });
      setIsPending(false);
      return;
    }

    if (state.success) {
      toast.success("Comment deleted successfully!", {
        position: "top-center",
      });
    }

    setIsPending(false);
    setIsDeleteOpen(false);
  };

  return (
    <>
      <button
        className="text-xs text-gray-400 hover:text-red-500 transition-colors duration-200 flex items-center gap-1"
        onClick={() => setIsDeleteOpen(true)}
      >
        <Trash2 className="h-3 w-3" />
        Delete
      </button>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="rounded-2xl bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-gray-700 shadow-xl max-w-[95vw] sm:max-w-md mx-auto p-4 sm:p-6">
          <AlertDialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </div>
                <AlertDialogTitle className="text-base font-semibold">
                  Delete Comment?
                </AlertDialogTitle>
              </div>
              
            </div>
          </AlertDialogHeader>

          <AlertDialogDescription className="text-sm text-gray-500 dark:text-gray-400">
            This action cannot be undone. This will permanently delete this
            comment.
          </AlertDialogDescription>

          <AlertDialogFooter className="flex-col-reverse sm:flex-row gap-2 mt-4">
            <AlertDialogCancel className="w-full sm:w-auto rounded-full px-4 py-1.5 text-sm">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="w-full sm:w-auto rounded-full px-4 py-1.5 text-sm bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
            >
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteCommentBtn;
