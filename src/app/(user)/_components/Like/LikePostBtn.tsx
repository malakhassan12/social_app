"use client";

import { createLikeOnPost } from "@/actions/like/createLikeOnPost";
import { Button } from "@/components/ui/button";
import { LikeResponse } from "@/types/like.Types";
import { Post } from "@/types/post.Types";
import { Heart } from "lucide-react";
import { useOptimistic,  useTransition } from "react";
import { toast } from "sonner";

const LikePostBtn = ({
  post,
  likedCount = 0,
  isLike,
}: {
  post: Post;
  likedCount: number;
  isLike: boolean;
}) => {
  const [pending, startTransition] = useTransition();

  const [like, setLike] = useOptimistic(isLike);
  const [likesCount, setLikesCount] = useOptimistic(likedCount);

  const handleLike = () => {
    if (like) {
      setLikesCount((prev) => {
        return likedCount > 0 ? prev - 1 : 0;
      });
      setLike(false);
    } else {
      setLikesCount((prev) => {
        return prev + 1;
      });
      setLike(true);
    }
    startTransition(async () => {
      const res = (await createLikeOnPost(post.id)) as LikeResponse;

      if (!res.success) {
        toast.error(res?.errors?.message || "Something went wrong", {
          position: "top-center",
        });
        return;
      }

      toast.success(res.liked ? "Post liked ❤️" : "Like removed", {
        position: "top-center",
      });
    });
  };

  return (
    <Button
      onClick={handleLike}
      disabled={pending}
      aria-label={like ? "Unlike post" : "Like post"}
      aria-pressed={like}
      variant="ghost"
      size="sm"
      className="
      h-8 sm:h-9 px-2 sm:px-3 
      gap-1 sm:gap-1.5
      text-gray-500
      hover:text-red-500
      rounded-full
      "
    >
      <Heart
        aria-hidden="true"
        className={`h-4 w-4 ${like ? "fill-red-500 text-red-500" : ""}`}
      />

      <span className="text-xs font-medium">{likesCount}</span>
    </Button>
  );
};

export default LikePostBtn;
