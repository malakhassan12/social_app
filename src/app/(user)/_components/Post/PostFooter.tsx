import CommentInput from "../Comment/CommentInput";
import { FC } from "react";
import { Post } from "@/types/post.Types";
import SocialBtns from "./SocialBtns";
import getAccount from "@/helper/getAccount";
import { Account } from "@/types/account.Types";

const PostFooter: FC<{
  post: Post;
}> = async({ post }) => {
  const account = await getAccount()
  return (
    <div className="space-y-3">
      {/* Comment Input - Full width */}
      <div className="w-full">
        <CommentInput postId={post.id} account={account as unknown as Account} />
      </div>

      {/* Social Buttons - Centered */}
      <div className="flex items-center justify-center sm:justify-end gap-1">
        <SocialBtns post={post} account={account  as unknown as Account} />
      </div>
    </div>
  );
};

export default PostFooter;