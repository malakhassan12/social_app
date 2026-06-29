import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getUserId } from "@/helper/getUserId";
import { Comment } from "@/types/comment.Types";
import { getTime } from "@/utils/getTime";
import { MoreHorizontal } from "lucide-react";
import LikeCommentBtn from "../Like/LikeCommentBtn";
import { getLikeComment } from "@/helper/getLikeComment";

const CommentsContent = async ({ comments }: { comments: Comment[] }) => {
  const userId = await getUserId();
  return (
    <div className="space-y-3 max-h-[200px] overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {comments?.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
          No comments yet. Be the first!
        </p>
      ) : (
        comments?.map(async (comment: Comment) => {
          const Liked = await getLikeComment(comment?.id);

          return (
            <div
              key={comment.id}
              className="flex items-start gap-2 sm:gap-3 group"
            >
              {/* Avatar */}
              <Avatar className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 mt-0.5">
                <AvatarFallback className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] sm:text-xs font-medium">
                  {comment.author?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {comment.author?.name || "Unknown"}
                  </p>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {getTime({ time: comment.createdAt })}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 break-words mt-0.5">
                  {comment.content}
                </p>

                {/* Comment Actions */}
                <div className="flex items-center gap-1 mt-1">
                  <LikeCommentBtn
                    commentId={comment.id}
                    initialLikesCount={Liked?.likedCount}
                    initialLiked={Liked?.isLiked}
                  />
                </div>
              </div>

              {/* Actions - More button */}
              {userId == comment?.author?.id && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 sm:h-8 sm:w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default CommentsContent;
