"use client";

import createSharePost from "@/actions/share/createSharePost";
import { Button } from "@/components/ui/button";
import { Post } from "@/types/post.Types";
import { ShareResponse } from "@/types/share.Types";
import { Share2 } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const SharePostBtn = ({
  post,
  isShared,
  sharedCount = 0,
}: {
  post: Post;
  isShared: boolean;
  sharedCount: number;
}) => {
  const [share, setShare] = useState<boolean>(isShared);
  const [pending, setPending] = useState(false);
  const [sharesCount, setSharesCount] = useState<number>(sharedCount);

  const handleShare = async () => {
    try {
      setPending(true);

      const res = (await createSharePost(post)) as ShareResponse;

      if (!res.success) {
        toast.error(res?.errors?.message || "Something went wrong", {
          position: "top-center",
        });
        return;
      }

      setShare(res.shared);
      setSharesCount((prev) => (res.shared ? prev + 1 : prev - 1));

      toast.success(res.shared ? "Post shared successfully" : "Share removed", {
        position: "top-center",
      });
    } catch(error) {
      console.log(error);
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
      size="sm"
      className={`h-8 px-3 gap-1.5 rounded-full transition-all duration-200 ${
        share
          ? "text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          : "text-gray-500 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
      }`}
    >
      <Share2
        className={`h-4 w-4 transition-all ${share ? "fill-blue-500" : ""}`}
      />
      <span className="text-xs font-medium">{sharesCount}</span>
    </Button>
  );
};

export default SharePostBtn;
