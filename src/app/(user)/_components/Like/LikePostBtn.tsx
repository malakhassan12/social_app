"use client";

import { createLikeOnPost } from "@/actions/like/createLikeOnPost";
import { Button } from "@/components/ui/button";
import { LikeResponse } from "@/types/like.Types";
import { Post } from "@/types/post.Types";
import { Heart } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { getSocket } from "@/lib/socket/socket";

const LikePostBtn = ({
  post,
  accountId,
  likedCount = 0,
  isLike,
}: {
  post: Post;
  accountId: string;
  likedCount: number;
  isLike: boolean;
}) => {
  const [pending, startTransition] = useTransition();
  const [like, setLike] = useState(isLike);
  const [likesCount, setLikesCount] = useState(likedCount);

  useEffect(() => {
    const socket = getSocket();

    const handlePostEvent = (payload: unknown) => {
      if (
        typeof payload !== "object" ||
        payload === null ||
        !("action" in payload) ||
        payload.action !== "liked" ||
        !("postId" in payload) ||
        payload.postId !== post.id ||
        !("accountId" in payload) ||
        typeof payload.accountId !== "string" ||
        !("liked" in payload) ||
        typeof payload.liked !== "boolean" ||
        !("likesCount" in payload) ||
        typeof payload.likesCount !== "number"
      ) {
        return;
      }

      setLikesCount(payload.likesCount);
      if (payload.accountId === accountId) {
        setLike(payload.liked);
      }
    };

    socket.on("publish:post", handlePostEvent);
    socket.connect();

    return () => {
      socket.off("publish:post", handlePostEvent);
    };
  }, [accountId, post.id]);

  const handleLike = () => {
    const previousLike = like;
    const previousLikesCount = likesCount;
    const nextLike = !like;

    setLike(nextLike);
    setLikesCount((count) => Math.max(0, count + (nextLike ? 1 : -1)));

    startTransition(async () => {
      try {
        const res = (await createLikeOnPost(post.id)) as LikeResponse;

        if (!res.success) {
          setLike(previousLike);
          setLikesCount(previousLikesCount);
          toast.error(res.errors?.message || "Something went wrong", {
            position: "top-center",
          });
          return;
        }

        setLike(res.liked);
        if (typeof res.likesCount === "number") {
          setLikesCount(res.likesCount);
        }

        toast.success(res.liked ? "Post liked ❤️" : "Like removed", {
          position: "top-center",
        });
      } catch (error) {
        setLike(previousLike);
        setLikesCount(previousLikesCount);
        console.error("Failed to update post like:", error);
        toast.error("Something went wrong", { position: "top-center" });
      }
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
