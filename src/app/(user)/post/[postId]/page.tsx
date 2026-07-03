import { Card } from "@/components/ui/card";
import CommentInput from "../../_components/Comment/CommentInput";
import PostHeader from "../../_components/Post/PostHeader";
import PostContent from "../../_components/Post/PostContent";
import CommentsContent from "../../_components/Comment/CommentsContent";
import SocialBtns from "../../_components/Post/SocialBtns";

import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { Suspense } from "react";
import PostSkelton from "@/components/Skelton/PostSkelton";

type Props = {
  params: Promise<{
    postId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { postId } = await params;

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      desc: true,
    },
  });

  return {
    title: post?.desc ?? "Post details",
  };
}

async function Page({ params }: { params: Promise<{ postId: string }> }) {
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
    <Card className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
        <PostHeader post={post} />
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
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
  );
}
const LatestPosts = async ({
  params,
}: {
  params: Promise<{ postId: string }>;
}) => {
  return (
    <div className="p-4">
      <Suspense fallback={<PostSkelton />}>
        <Page params={params} />
      </Suspense>
    </div>
  );
};

export default LatestPosts;
