"use client";

import { FC, useState } from "react";
import { Comment } from "@/types/comment.Types";
import { getTime } from "@/utils/getTime";
import LikeCommentBtn from "../Like/LikeCommentBtn";
import ProfileAvatar from "@/components/Avatar/ProfileAvatar";
import CurdCommentBtn from "./CurdCommentBtn";

type CommentItemProps = {
  comment: Comment;
  accountId: string;
  isLiked: boolean;
  likedCount: number;
};

const CommentItem: FC<CommentItemProps> = ({
  comment,
  accountId,
  isLiked,
  likedCount,
}) => {
  const [content, setContent] = useState(comment.content);

  return (
    <div className="flex items-start gap-2 sm:gap-3 group">
      <ProfileAvatar
        name={comment.author?.username}
        image={comment.author?.image}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {comment.author?.username || "Unknown"}
          </p>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {getTime({ time: comment.createdAt })}
          </span>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 wrap-break-words mt-0.5">
          {content}
        </p>

        <div className="flex items-center gap-1 mt-1">
          <LikeCommentBtn
            commentId={comment.id}
            initialLikesCount={likedCount}
            initialLiked={isLiked}
          />
        </div>
      </div>

      {accountId === comment.author?.id && (
        <CurdCommentBtn comment={comment} onUpdated={setContent} />
      )}
    </div>
  );
};

export default CommentItem;
