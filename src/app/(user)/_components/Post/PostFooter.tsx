import CommentInput from "../Comment/CommentInput";
import { FC } from "react";
import { Post } from "@/types/post.Types";
import SocialBtns from "./SocialBtns";

const PostFooter: FC<{
  post: Post;
}> = ({ post }) => {
  return (
    <div className="space-y-3">
      {/* Comment Input - Full width */}
      <div className="w-full">
        <CommentInput postId={post.id} />
      </div>

      {/* Social Buttons - Centered */}
      <div className="flex items-center justify-center sm:justify-end gap-1">
        <SocialBtns post={post} />
      </div>
    </div>
  );
};

export default PostFooter;