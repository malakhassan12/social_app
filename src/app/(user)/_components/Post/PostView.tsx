"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Post as PostType } from "@/types/post.Types";
import ProfileAvatar from "@/components/Avatar/ProfileAvatar";
import PostFooter from "./PostFooter";
import PostContent from "./PostContent";
import { getTime } from "@/utils/getTime";
import { Lock, AlertCircle } from "lucide-react";
import { Account } from "@/types/account.Types";
import Link from "next/link";
import dynamic from "next/dynamic";

const CurdPostBtn = dynamic(() => import("./CurdPostBtn"), {
  loading: () => null,
});

const PostView = ({ post, account }: { post: PostType; account: Account }) => {
  // Handle removed post UI
  if (post?.isRemoved) {
    return (
      <Card className="mb-4 overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-xl shadow-black/[0.06] dark:border-white/[0.06] dark:bg-[#0f0d18] dark:shadow-black/40">
        <CardContent className="flex flex-col items-center justify-center gap-3 p-6 text-center sm:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-400/10 ring-1 ring-inset ring-rose-400/20 dark:bg-rose-300/10 dark:ring-rose-300/20">
            <AlertCircle className="h-6 w-6 text-rose-600 dark:text-rose-300" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1a1e2b] sm:text-base dark:text-[#f4ede4]">
              Content Not Available
            </p>
            <p className="mt-1 text-xs text-[#1a1e2b]/55 sm:text-sm dark:text-[#f4ede4]/55">
              This post has been removed or is no longer available.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group/post mb-4 overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-xl shadow-black/[0.06] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/[0.10] dark:border-white/[0.06] dark:bg-[#0f0d18] dark:shadow-black/40 dark:hover:shadow-black/60">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2 sm:p-5 sm:pb-3">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <ProfileAvatar image={post.author.image} name={post.author.name} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#1a1e2b] sm:text-base dark:text-[#f4ede4]">
              <Link
                href={`profile/${post?.accountId}`}
                className="transition-colors hover:text-rose-600 dark:hover:text-rose-300"
              >
                {post.author.username}
              </Link>
            </p>
            <div className="flex flex-wrap items-center gap-1.5">
              <p className="text-xs text-[#1a1e2b]/55 dark:text-[#f4ede4]/55">
                {getTime({ time: post?.createdAt })}
              </p>
              {post?.isPrivate && (
                <>
                  <span className="text-[#1a1e2b]/30 dark:text-[#f4ede4]/30">
                    •
                  </span>
                  <span className="flex items-center gap-0.5 rounded-full border border-rose-400/25 bg-rose-400/10 px-1.5 py-0.5 text-xs text-rose-600 dark:border-rose-300/20 dark:bg-rose-300/[0.08] dark:text-rose-300">
                    <Lock aria-hidden="true" className="h-2.5 w-2.5" />
                    Private
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {account?.id === post.author.id && (
            <CurdPostBtn post={post} accountId={account.id} />
          )}
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0">
        <PostContent post={post} />
      </CardContent>

      {/* Footer */}
      <CardFooter className="block border-t border-black/[0.06] bg-[#fdf9f3] px-4 py-3 sm:px-5 sm:py-4 dark:border-white/[0.08] dark:bg-[#171421]">
        <PostFooter post={post} account={account as unknown as Account} />
      </CardFooter>
    </Card>
  );
};

export default PostView;