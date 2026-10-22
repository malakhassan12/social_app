"use client";

import createSharePost from "@/actions/share/createSharePost";
import { Button } from "@/components/ui/button";
import { Post } from "@/types/post.Types";
import { ShareResponse } from "@/types/share.Types";
import { Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getSocket } from "@/lib/socket/socket";

type SharePostBtnProps = {
  post: Post;
  accountId: string;
  isShared: boolean;
  sharedCount?: number;
};

const SharePostBtn = ({
  post,
  accountId,
  isShared,
  sharedCount = 0,
}: SharePostBtnProps) => {
  const [pending, setPending] = useState(false);
  const [share, setShare] = useState(isShared);
  const [sharesCount, setSharesCount] = useState(sharedCount);

  useEffect(() => {
    const socket = getSocket();

    const handlePostEvent = (payload: unknown) => {
      if (
        typeof payload !== "object" ||
        payload === null ||
        !("action" in payload) ||
        payload.action !== "shared" ||
        !("postId" in payload) ||
        payload.postId !== post.id ||
        !("shared" in payload) ||
        typeof payload.shared !== "boolean" ||
        !("sharedCount" in payload) ||
        typeof payload.sharedCount !== "number"
      ) {
        return;
      }

      setSharesCount(payload.sharedCount);
      if ("accountId" in payload && payload.accountId === accountId) {
        setShare(payload.shared);
      }
    };

    socket.on("publish:post", handlePostEvent);
    socket.connect();

    return () => {
      socket.off("publish:post", handlePostEvent);
    };
  }, [accountId, post.id]);

  const handleShare = async () => {
    const previousShare = share;
    const previousCount = sharesCount;

    try {
      setShare(!share);
      setSharesCount((currentCount) =>
        Math.max(0, currentCount + (share ? -1 : 1)),
      );

      setPending(true);

      const res = (await createSharePost(post)) as ShareResponse;

      if (!res.success) {
        toast.error(res?.errors?.message || "Something went wrong", {
          position: "top-center",
        });

        setShare(previousShare);
        setSharesCount(previousCount);
        return;
      }

      setShare(res.shared);
      if (typeof res.sharedCount === "number") {
        setSharesCount(res.sharedCount);
      }

      toast.success(res.shared ? "Post shared successfully" : "Share removed", {
        position: "top-center",
      });
    } catch (error) {
      setShare(previousShare);
      setSharesCount(previousCount);
      console.error("Failed to share post:", error);

      toast.error("Failed to share post", {
        position: "top-center",
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleShare}
      disabled={pending}
      aria-label={share ? "Remove share" : "Share post"}
      aria-pressed={share}
      size="sm"
      className={`h-8 px-3 gap-1.5 rounded-full transition-all duration-200 ${
        share
          ? "text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          : "text-gray-500 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
      }`}
    >
      <Share2
        aria-hidden="true"
        className={`h-4 w-4 transition-all ${share ? "fill-blue-500" : ""}`}
      />
      <span className="text-xs font-medium">{sharesCount}</span>
    </Button>
  );
};

export default SharePostBtn;
