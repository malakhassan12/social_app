"use client";

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
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deletePost } from "@/actions/posts/deletePost";
import { toast } from "sonner";

const DeletePostBtn = ({ postId }: { postId: string }) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async () => {
    setIsPending(true);
    const state = await deletePost(postId);
    const message = state.errors?.message;

    if (message) {
      toast.error(message, { position: "top-center" });
      setIsPending(false);
      return;
    }

    if (state.success) {
      toast.success("Post Deleted successfully!", { position: "top-center" });
    }

    setIsPending(false);
    setIsDeleteOpen(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg px-2 sm:px-3 py-2 h-8 sm:h-9 text-xs sm:text-sm font-medium transition-colors"
        onClick={() => setIsDeleteOpen(true)}
      >
        <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        <span className="hidden xs:inline">Delete Post</span>
        <span className="xs:hidden">Delete</span>
      </Button>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="rounded-2xl bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-gray-700 shadow-xl max-w-[95vw] sm:max-w-md mx-auto p-4 sm:p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Delete Post?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              This action cannot be undone. This will permanently delete your
              post and remove it from all feeds.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 mt-4">
            <AlertDialogCancel className="w-full sm:w-auto rounded-full px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-medium border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors order-2 sm:order-1">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="w-full sm:w-auto rounded-full px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50 order-1 sm:order-2"
            >
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeletePostBtn;