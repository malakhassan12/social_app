"use client";

import { FC, useState, useTransition } from "react";
import { Pencil, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Comment } from "@/types/comment.Types";
import { updateComment } from "@/actions/comment/updateComment";
import { toast } from "sonner";

interface UpdateCommentBtnProps {
  comment: Comment;
}

const UpdateCommentBtn: FC<UpdateCommentBtnProps> = ({ comment }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [isPending, startTransition] = useTransition();

  const handleUpdate = (formData: FormData) => {
    startTransition(async () => {
      const result = await updateComment(comment, formData);

      if (result.success) {
        toast.success("Comment updated successfully!", {
          position: "top-center",
        });
        setIsOpen(false);
      } else {
        toast.error(
          result?.errors?.message ||
            result?.errors?.content ||
            "Failed to update comment",
          { position: "top-center" },
        );
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="text-xs text-gray-400 hover:text-blue-500 transition-colors duration-200 flex items-center gap-1">
          <Pencil className="h-3 w-3" />
          Edit
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-2xl bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-gray-700 shadow-xl p-0 overflow-hidden max-w-[95vw] mx-auto">
        <form action={handleUpdate}>
          {/* Header */}
          <DialogHeader className="p-4 pb-2 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-base font-semibold text-gray-900 dark:text-white">
                Edit Comment
              </DialogTitle>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="p-4 space-y-3">
            <input type="hidden" name="commentId" value={comment.id} />

            <div className="space-y-1.5">
              <Label
                htmlFor="content"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Comment
              </Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Edit your comment..."
                className="w-full min-h-20 resize-none border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-xl p-3 text-sm"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={500}
                required
              />
              <div className="flex justify-end">
                <span className="text-xs text-gray-400">
                  {content.length}/500
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full px-4 text-sm font-medium border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="rounded-full px-4 text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isPending || !content.trim()}
            >
              {isPending ? (
                <>
                  <span className="h-3.5 w-3.5 mr-1.5 animate-spin rounded-full border-2 border-white border-t-transparent inline-block" />
                  {/*  */}
                  Saving...
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5 mr-1.5" />
                  Save
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateCommentBtn;
