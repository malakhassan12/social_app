"use client";

import { createLikeOnPost } from "@/actions/like/createLikeOnPost";
import { Button } from "@/components/ui/button";
import { LikeResponse } from "@/types/like.Types";
import { Post } from "@/types/post.Types";
import { Heart } from "lucide-react";
import { useTransition, useState } from "react";
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
  const [likesCount, setLikesCount] = useState<number>(likedCount);
  const [liked, setLiked] = useState<boolean>(isLike);
  const [pending, startTransition] = useTransition();

  const handleLike = () => {
    startTransition(async () => {
      const res = (await createLikeOnPost(post.id)) as LikeResponse;

      if (!res.success) {
        toast.error(res?.errors?.message || "Something went wrong", {
          position: "top-center",
        });
        return;
      }

      setLiked(res.liked);

      setLikesCount((prev) => (res.liked ? prev + 1 : prev - 1));

      toast.success(res.liked ? "Post liked ❤️" : "Like removed", {
        position: "top-center",
      });
    });
  };

  return (
    <Button
      onClick={handleLike}
      disabled={pending}
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
        className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : ""}`}
      />

      <span className="text-xs font-medium">{likesCount}</span>
    </Button>
  );
};

export default LikePostBtn;
