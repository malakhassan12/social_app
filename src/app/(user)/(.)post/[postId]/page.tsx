import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import PostHeader from "../../_components/Post/PostHeader";
import PostContent from "../../_components/Post/PostContent";
import SocialBtns from "../../_components/Post/SocialBtns";
import CommentsContent from "../../_components/Comment/CommentsContent";
import CommentInput from "../../_components/Comment/CommentInput";
import { Suspense } from "react";
import PostModalSkeleton from "@/components/Skelton/PostModalSkeleton";
import { Account } from "@/types/account.Types";
import getAccount from "@/helper/account/getAccount";
import { getPost } from "@/helper/post/getPost";
import { getComments } from "@/helper/comment/getComments";
import { Post } from "@/types/post.Types";
import { Comment } from "@/types/comment.Types";
import BackBtn from "@/components/Buttons/BackBtn";

const PostModalContent = async ({
  params,
}: {
  params: Promise<{ postId: string }>;
}) => {
  const { postId } = await params;

  const [post, comments] = await Promise.all([
    getPost(postId),
    getComments(postId),
  ]);

  if (post === null) {
    notFound();
  }

  const commentCount = comments?.length;

  const account = await getAccount();
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="bg-white dark:bg-[#1a1a2e] rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <PostHeader post={post as unknown as Post} />

          <BackBtn />
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar:none]">
          <PostContent post={post as unknown as Post} />

          <SocialBtns
            post={post as unknown as Post}
            showComment={false}
            account={account as unknown as Account}
          />

          <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-800">
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

            <CommentsContent
              comments={comments as unknown as Comment[]}
              accountId={account?.id as string}
            />

            <CommentInput
              postId={post?.id}
              account={account as unknown as Account}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default function PostModal({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  return (
    <Suspense fallback={<PostModalSkeleton />}>
      <PostModalContent params={params} />
    </Suspense>
  );
}
