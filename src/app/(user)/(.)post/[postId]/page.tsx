import Link from "next/link";
import { X } from "lucide-react";
import { Card } from "@/components/ui/card";
import PostHeader from "../../_components/Post/PostHeader";
import PostContent from "../../_components/Post/PostContent";
import SocialBtns from "../../_components/Post/SocialBtns";
import CommentsContent from "../../_components/Comment/CommentsContent";
import CommentInput from "../../_components/Comment/CommentInput";

const PostModal = async ({
  params,
}: {
  params: Promise<{ postId: string }>;
}) => {
  const { postId } = await params;

  const [postData, commentsData] = await Promise.all([
    fetch(`${process.env.API_V1}/api/post/${postId}`).then(async (res) => {
      if (!res.ok) {
        const error = await res
          .json()
          .catch(() => ({ message: "Failed to fetch post" }));
        throw new Error(error.message || `Failed to fetch post: ${res.status}`);
      }
      return res.json();
    }),
    fetch(`${process.env.API_V1}/api/comment/${postId}`).then(async (res) => {
      if (!res.ok) {
        const error = await res
          .json()
          .catch(() => ({ message: "Failed to fetch comments" }));
        throw new Error(
          error.message || `Failed to fetch comments: ${res.status}`,
        );
      }
      return res.json();
    }),
  ]);
  const post = postData?.post;
  const comments = commentsData?.comments || [];
  const commentCount = comments.length;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="bg-white dark:bg-[#1a1a2e] rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <PostHeader post={post} />
          <Link
            href="/"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </Link>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Post Content */}
          <PostContent post={post} />

          {/* Social Actions */}
          <SocialBtns post={post} showComment={false} />
          {/* Comments Section */}
          <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            {/* Comments Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Comments
              </h3>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {commentCount === 0
                  ? "No comments yet"
                  : commentCount === 1
                    ? "1 comment"
                    : `${commentCount} comments`}
              </span>
            </div>

            {/* Comments List */}
            <CommentsContent comments={comments} />

            {/* Comment Input */}
            <CommentInput postId={post?.id} />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PostModal;
