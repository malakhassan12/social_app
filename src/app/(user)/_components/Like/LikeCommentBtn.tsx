"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOptimistic, useTransition } from "react";
import { createLikeOnComment } from "@/actions/like/createLikeOnComment";
import { LikeResponse } from "@/types/like.Types";
import { toast } from "sonner";

type LikeCommentBtnProps = {
  commentId: string;
  initialLikesCount: number;
  initialLiked: boolean;
};

type OptimisticLikeState = {
  liked: boolean;
  likesCount: number;
};

const LikeCommentBtn = ({
  commentId,
  initialLikesCount,
  initialLiked,
}: LikeCommentBtnProps) => {
  const [pending, startTransition] = useTransition();

  const [optimisticLike, setOptimisticLike] =
    useOptimistic<OptimisticLikeState>({
      liked: initialLiked,
      likesCount: initialLikesCount,
    });

  const handleLike = () => {
    const nextLiked = !optimisticLike.liked;

    const nextLikesCount = nextLiked
      ? optimisticLike.likesCount + 1
      : optimisticLike.likesCount - 1;

    // Update UI immediately
    startTransition(async () => {
      setOptimisticLike({
        liked: nextLiked,
        likesCount: nextLikesCount,
      });

      const res = (await createLikeOnComment(commentId)) as LikeResponse;

      if (!res.success) {
        toast.error(res.errors?.message || "Something went wrong");

        // Rollback
        setOptimisticLike({
          liked: optimisticLike.liked,
          likesCount: optimisticLike.likesCount,
        });

        return;
      }

      // Server is the source of truth.
      // Sync with the actual server response.

      toast.success(res.liked ? "Comment liked ❤️" : "Comment unliked");
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      disabled={pending}
      aria-label={
        optimisticLike.liked ? "Unlike comment" : "Like comment"
      }
      aria-pressed={optimisticLike.liked}
    >
      <Heart
        aria-hidden="true"
        className={`h-4 w-4 ${
          optimisticLike.liked ? "fill-red-500 text-red-500" : ""
        }`}
      />

      <span>{optimisticLike.likesCount}</span>
    </Button>
  );
};

export default LikeCommentBtn;
