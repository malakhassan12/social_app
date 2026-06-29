"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
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
  const [likesCount, setLikesCount] = useState<number>(initialLikesCount);

  const [liked, setLiked] = useState<boolean>(initialLiked);

  const [pending, startTransition] = useTransition();

  const handleLike = () => {
    startTransition(async () => {
      const res = (await createLikeOnComment(commentId)) as LikeResponse;

      if (!res.success) {
        toast.error(res?.errors?.message || "Something went wrong", {
          position: "top-center",
        });
        return;
      }

      setLiked(res.liked);

      setLikesCount((prev) => (res.liked ? prev + 1 : prev - 1));

      toast.success(res.liked ? "Comment liked ❤️" : "Comment unliked", {
        position: "top-center",
      });
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      disabled={pending}
      className="
        h-6 px-2 gap-1
        text-gray-400
        hover:text-red-500
        hover:bg-red-50
        dark:hover:bg-red-900/20
        rounded-full
        text-[10px]
        font-medium
      "
    >
      <Heart
        className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : ""}`}
      />

      <span className="text-xs font-medium">{likesCount}</span>
    </Button>
  );
};

export default LikeCommentBtn;
