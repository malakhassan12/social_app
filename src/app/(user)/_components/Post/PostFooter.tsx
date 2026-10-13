import CommentInput from "../Comment/CommentInput";
import { FC } from "react";
import { Post } from "@/types/post.Types";
import { Account } from "@/types/account.Types";
import { Lock } from "lucide-react";
import SocialBtnsClient from "./SocialBtnsClient";

const PostFooter: FC<{
  post: Post;
  account: Account;
}> = ({ post, account }) => {
  return (
    <div className="space-y-3">
      {/* Comment Input - Full width */}
      <div className="min-h-10 w-full">
        {post.isOpenComments || account.id === post.accountId ? (
          <CommentInput postId={post.id} account={account} />
        ) : (
          <div className="flex h-10 items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Lock className="h-3.5 w-3.5" />
            <span>Comments disabled</span>
          </div>
        )}
      </div>

      {/* Social Buttons - Centered */}
      <div className="flex items-center justify-center sm:justify-end gap-1">
        <SocialBtnsClient
          post={post}
          account={account}
          isLiked={post.isLiked ?? false}
          likedCount={post._count?.likes ?? 0}
          isShared={post.isShared ?? false}
          sharedCount={post.sharedCount ?? 0}
        />
      </div>
    </div>
  );
};

export default PostFooter;
