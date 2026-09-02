"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {  useTransition } from "react";
import { createLikeOnComment } from "@/actions/like/createLikeOnComment";
import { LikeResponse } from "@/types/like.Types";
import { toast } from "sonner";

const LikeCommentBtn = ({
  commentId,
  initialLikesCount,
  initialLiked,
}: {
  commentId: string;
  initialLikesCount: number;
  initialLiked: boolean;
}) => {
  const [pending, startTransition] = useTransition();

  const handleLike = () => {
    startTransition(async () => {
      const res = await createLikeOnComment(commentId) as LikeResponse;

      if (!res.success) {
        toast.error(res.errors?.message || "Something went wrong");
        return;
      }

      toast.success(
        res.liked ? "Comment liked ❤️" : "Comment unliked",
      );
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      disabled={pending}
    >
      <Heart
        className={`h-4 w-4 ${
          initialLiked ? "fill-red-500 text-red-500" : ""
        }`}
      />

      <span>{initialLikesCount}</span>
    </Button>
  );
};

export default LikeCommentBtn;
