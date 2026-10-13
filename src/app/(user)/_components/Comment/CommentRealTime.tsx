
"use client";

import CommentItem from "./CommentItem";
import useCommentRealTime, {
  CommentWithLikes,
} from "@/hooks/useCommentRealTime";

type Props = {
  initialComments: CommentWithLikes[];
  accountId: string;
};

export default function CommentRealTime({
  initialComments,
  accountId,
}: Props) {
  const comments = useCommentRealTime(initialComments, accountId);

  return (
    <div className="space-y-3 max-h-50 overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-none]">
      {comments.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
          No comments yet. Be the first!
        </p>
      ) : (
        comments.map(({ comment, isLiked, likedCount }) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            accountId={accountId}
            isLiked={isLiked}
            likedCount={likedCount}
          />
        ))
      )}
    </div>
  );
}
