"use client";

import { Textarea } from "@/components/ui/textarea";
import { FC, useState } from "react";
import CreateCommentBtn from "./CreateCommentBtn";
import { createComment } from "@/actions/comment/createComment";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const CommentInput: FC<{
  postId: string;
}> = ({ postId }) => {
  const [content, setContent] = useState("");

  return (
    <div className="flex items-start gap-2 sm:gap-3">
      {/* Avatar */}
      <Avatar className="h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0 mt-1">
        <AvatarFallback className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium">
          ME
        </AvatarFallback>
      </Avatar>

      {/* Form */}

      <form
        action={async (formData) => {
          if (!content.trim()) {
            return;
          }
          const res = await createComment(postId, formData);

          if (res.success) {
            toast.success("Comment created", { position: "top-center" });
            setContent("");
            return;
          }

          if (
            res?.errors &&
            typeof (res.errors as { message?: unknown }).message === "string"
          ) {
            toast.error((res.errors as { message: string }).message, {
              position: "top-center",
            });
          }
        }}
        className="flex-1 relative"
      >
        <Textarea
          placeholder="Add comment now"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full min-h-[40px] max-h-[60px] sm:min-h-[50px] sm:max-h-[80px] rounded-2xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all resize-none overflow-y-auto text-sm sm:text-base pr-12 py-2.5 sm:py-3 px-4 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-500 dark:hover:scrollbar-thumb-gray-500"
        />
        <CreateCommentBtn disabled={!content.trim()} />{" "}
      </form>
    </div>
  );
};

export default CommentInput;
