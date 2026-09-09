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
import { Account } from "@/types/account.Types";
import getAccount from "@/helper/getAccount";
import { getPost } from "@/helper/getPost";
import { getComments } from "@/helper/getComments";
import { notFound } from "next/navigation";
import { Comment } from "@/types/comment.Types";
import { Post } from "@/types/post.Types";
import BackBtn from "@/components/Buttons/BackBtn";

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
  const [post, comments] = await Promise.all([
    getPost(postId),
    getComments(postId),
  ]);

  if (post === null) {
    notFound();
  }

  const commentCount = comments.length;

  const account = await getAccount();

  return (
    <Card className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <PostHeader post={post as unknown as Post} />

        <BackBtn />
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Post Content */}
        <PostContent post={post as unknown as Post} />

        {/* Social Actions */}
        <SocialBtns
          post={post as unknown as Post}
          showComment={false}
          account={account as unknown as Account}
        />

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
          <CommentsContent
            comments={comments as unknown as Comment[]}
            accountId={account?.id as string}
          />

          {/* Comment Input */}
          <CommentInput
            postId={post?.id}
            account={account as unknown as Account}
          />
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
