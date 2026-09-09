"use client";

import { Textarea } from "@/components/ui/textarea";
import { FC, useState } from "react";
import CreateCommentBtn from "./CreateCommentBtn";
import { createComment } from "@/actions/comment/createComment";
import { toast } from "sonner";
import { Account } from "@/types/account.Types";
import ProfileAvatar from "@/components/Avatar/ProfileAvatar";
import { Comment } from "@/types/comment.Types";

const CommentInput: FC<{
  postId: string;
  account: Account;
  addOptimisticComment?: (comment: Comment) => void;
}> = ({
  postId,
  account,
  addOptimisticComment,
}) => {
  const [content, setContent] = useState("");

  return (
    <div className="flex items-start gap-2 sm:gap-3">
      {/* Avatar */}
      <ProfileAvatar
        name={account.username}
        image={account.image}
      />

      {/* Form */}
      <form
        action={async (formData) => {
          if (!content.trim()) {
            return;
          }

          /*
           * Create the optimistic comment BEFORE
           * waiting for the server.
           */
          const optimisticComment: Comment = {
            id: `temp-${Date.now()}`,
            content: content.trim(),
            createdAt: new Date().toISOString(),
            author: account,
            postId,
            accountId: account.id,
          };

          addOptimisticComment?.(optimisticComment);

          const res = await createComment(postId, formData);

          if (res.success) {
            toast.success("Comment created", {
              position: "top-center",
            });

            setContent("");

            return;
          }

          if (
            res?.errors &&
            typeof (res.errors as { message?: unknown }).message === "string"
          ) {
            toast.error(
              (res.errors as { message: string }).message,
              {
                position: "top-center",
              }
            );
          }
        }}
        className="flex-1 relative"
      >
        <Textarea
          placeholder="Add comment now"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full min-h-10 max-h-15 sm:min-h-12.5 sm:max-h-20 rounded-2xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all resize-none overflow-y-auto text-sm sm:text-base pr-12 py-2.5 sm:py-3 px-4 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-500 dark:hover:scrollbar-thumb-gray-500"
        />

        <CreateCommentBtn disabled={!content.trim()} />
      </form>
    </div>
  );
};

export default CommentInput;