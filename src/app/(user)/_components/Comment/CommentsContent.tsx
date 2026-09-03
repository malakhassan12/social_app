import { Comment } from "@/types/comment.Types";
import { getTime } from "@/utils/getTime";
import LikeCommentBtn from "../Like/LikeCommentBtn";
import { getLikeComment } from "@/helper/getLikeComment";
import ProfileAvatar from "@/components/Avatar/ProfileAvatar";
import CurdCommentBtn from "./CurdCommentBtn";
import CommentRealTime from "./CommentRealTime";
import { getAccountId } from "@/helper/getAccountId";

const CommentsContent = async ({ comments }: { comments: Comment[] }) => {
  const accountId = await getAccountId();
  return (
    <>
      <CommentRealTime />
      <div className="space-y-3 max-h-50 overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-none]">
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
                <ProfileAvatar
                  name={comment.author?.username}
                  image={comment?.author?.image}
                />

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
                  <p className="text-sm text-gray-700 dark:text-gray-300 wrap-break-words mt-0.5">
                    {comment.content}
                  </p>

                  {/* Comment Actions */}
                  <div className="flex items-center gap-1 mt-1">
                    <LikeCommentBtn
                      commentId={comment.id}
                      initialLikesCount={Liked?.likedCount as number}
                      initialLiked={Liked?.isLiked as boolean}
                    />
                  </div>
                </div>

                {/* Actions - More button */}
                {accountId == comment?.author?.id && (
                  <CurdCommentBtn comment={comment} />
                )}
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default CommentsContent;
