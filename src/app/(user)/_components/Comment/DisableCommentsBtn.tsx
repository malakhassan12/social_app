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

import {
  useState,
  useTransition,
} from "react";

import {
  Lock,
  MessageSquareOff,
} from "lucide-react";

import { toast } from "sonner";

import disableComments from "@/actions/posts/disableComments";

const DisableCommentsBtn = ({
  postId,
  accountId,
  isOpenComments,
}: {
  postId: string;
  accountId: string;
  isOpenComments: boolean;
}) => {
  const [
    isDialogOpen,
    setIsDialogOpen,
  ] = useState(false);

  const [
    isPending,
    startTransition,
  ] = useTransition();

  const [
    commentsOpen,
    setCommentsOpen,
  ] = useState(isOpenComments);

  const handleToggle = () => {
    startTransition(async () => {
      const result =
        await disableComments(
          postId,
          accountId,
          commentsOpen,
        );

      const message =
        result.errors?.message ||
        result.message;

      if (!result.success) {
        toast.error(
          message ||
            "Failed to update comments",
          {
            position: "top-center",
          },
        );

        return;
      }

      setCommentsOpen(
        result?.isOpenComments as boolean
      );

      toast.success(
        result.message,
        {
          position: "top-center",
        },
      );

      setIsDialogOpen(false);
    });
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() =>
          setIsDialogOpen(true)
        }
        className={`w-full justify-start gap-2 rounded-lg px-2 sm:px-3 py-2 h-8 sm:h-9 text-xs sm:text-sm font-medium transition-colors ${
          commentsOpen
            ? "text-gray-500 hover:text-gray-800 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800"
            : "text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-900/20"
        }`}
      >
        {commentsOpen ? (
          <MessageSquareOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        ) : (
          <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        )}

        <span className="hidden xs:inline">
          {commentsOpen
            ? "Turn Off Comments"
            : "Enable Comments"}
        </span>

        <span className="xs:hidden">
          {commentsOpen
            ? "Turn Off"
            : "Enable"}
        </span>
      </Button>

      <AlertDialog
        open={isDialogOpen}
        onOpenChange={
          setIsDialogOpen
        }
      >
        <AlertDialogContent className="rounded-2xl bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-gray-700 shadow-xl max-w-[95vw] sm:max-w-md mx-auto p-4 sm:p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              {commentsOpen
                ? "Turn Off Comments?"
                : "Enable Comments?"}
            </AlertDialogTitle>

            <AlertDialogDescription className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {commentsOpen
                ? "People will no longer be able to comment on this post. You can turn them back on anytime."
                : "People will be able to comment on this post again."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 mt-4">
            <AlertDialogCancel
              disabled={isPending}
              className="w-full sm:w-auto rounded-full px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-medium border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors order-2 sm:order-1"
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleToggle}
              disabled={isPending}
              className={`w-full sm:w-auto rounded-full px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white transition-colors disabled:opacity-50 order-1 sm:order-2 ${
                commentsOpen
                  ? "bg-amber-500 hover:bg-amber-600"
                  : "bg-emerald-500 hover:bg-emerald-600"
              }`}
            >
              {isPending
                ? commentsOpen
                  ? "Turning off..."
                  : "Enabling..."
                : commentsOpen
                  ? "Turn Off"
                  : "Enable"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DisableCommentsBtn;