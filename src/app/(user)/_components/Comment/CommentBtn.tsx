
"use client";

import { getSocket } from "@/lib/socket/socket";
import { Post } from "@/types/post.Types";
import { MessageCircleIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const CommentBtn = ({ post }: { post: Post }) => {
  const [commentsCount, setCommentsCount] = useState(post._count.comments);

  useEffect(() => {
    const socket = getSocket();

    if (!socket.connected) {
      socket.connect();
    }

    const handleComment = (payload: unknown) => {
      if (
        typeof payload !== "object" ||
        payload === null ||
        !("id" in payload) ||
        typeof payload.id !== "string" ||
        !("postId" in payload) ||
        typeof payload.postId !== "string" ||
        !("commentsCount" in payload) ||
        typeof payload.commentsCount !== "number"
      ) {
        return;
      }

      if (payload.postId !== post.id) {
        return;
      }

      setCommentsCount(payload.commentsCount);
    };

    socket.on("publish:comment", handleComment);

    return () => {
      socket.off("publish:comment", handleComment);
    };
  }, [post.id]);

  return (
    <Link
      href={`/post/${post.id}`}
      aria-label={`View comments on ${post.author.username}'s post (${commentsCount})`}
      className="inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-sm text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-500 dark:hover:bg-blue-900/20 sm:h-9"
    >
      <MessageCircleIcon
        aria-hidden="true"
        className="h-4 w-4"
      />

      <span className="text-xs font-medium">{commentsCount}</span>
    </Link>
  );
};

export default CommentBtn;
