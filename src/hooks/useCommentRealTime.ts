"use client";

import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket/socket";
import { Comment } from "@/types/comment.Types";

export type CommentWithLikes = {
  comment: Comment;
  isLiked: boolean;
  likedCount: number;
};

const useCommentRealTime = (
  initialComments: CommentWithLikes[],
  accountId: string,
) => {
  const [comments, setComments] =
    useState<CommentWithLikes[]>(initialComments);

  useEffect(() => {
    const socket = getSocket();

    socket.connect();

    const handleComment = (payload: unknown) => {
      if (
        typeof payload !== "object" ||
        payload === null ||
        !("id" in payload) ||
        typeof payload.id !== "string" ||
        !("postId" in payload) ||
        typeof payload.postId !== "string" ||
        !("isRemoved" in payload) ||
        typeof payload.isRemoved !== "boolean"
      ) {
        return;
      }

      const updatedComment = payload as Comment;

      setComments((currentComments) => {
        // لو الكومنت اتحذف، نشيله من الـ state.
        if (updatedComment.isRemoved) {
          return currentComments.filter(
            (item) => item.comment.id !== updatedComment.id,
          );
        }

        // لو الكومنت موجود بالفعل، نحدّث بياناته.
        const exists = currentComments.some(
          (item) => item.comment.id === updatedComment.id,
        );

        if (exists) {
          return currentComments.map((item) =>
            item.comment.id === updatedComment.id
              ? { ...item, comment: updatedComment }
              : item,
          );
        }

        // لو كومنت جديد، نضيفه.
        return [
          ...currentComments,
          {
            comment: updatedComment,
            isLiked: updatedComment.isLiked ?? false,
            likedCount: 0,
          },
        ];
      });
    };

    const handleCommentLike = (payload: unknown) => {
      if (
        typeof payload !== "object" ||
        payload === null ||
        !("commentId" in payload) ||
        typeof payload.commentId !== "string" ||
        !("accountId" in payload) ||
        typeof payload.accountId !== "string" ||
        !("liked" in payload) ||
        typeof payload.liked !== "boolean" ||
        !("likesCount" in payload) ||
        typeof payload.likesCount !== "number"
      ) {
        return;
      }

      const event = payload as {
        commentId: string;
        accountId: string;
        liked: boolean;
        likesCount: number;
      };

      setComments((currentComments) =>
        currentComments.map((item) =>
          item.comment.id === event.commentId
            ? {
                ...item,
                isLiked:
                  event.accountId === accountId ? event.liked : item.isLiked,
                likedCount: event.likesCount,
              }
            : item,
        ),
      );
    };

    socket.on("publish:comment", handleComment);
    socket.on("publish:comment-like", handleCommentLike);

    return () => {
      socket.off("publish:comment", handleComment);
      socket.off("publish:comment-like", handleCommentLike);
    };
  }, [accountId]);

  return comments;
};

export default useCommentRealTime;