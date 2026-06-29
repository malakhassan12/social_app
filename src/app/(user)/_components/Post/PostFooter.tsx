import SocialBtns from "./SocialBtns";
import CommentInput from "../Comment/CommentInput";
import { FC } from "react";
import { Post } from "@/types/post.Types";

const PostFooter: FC<{
  post: Post;
}> = ({ post }) => {
  return (
    <div className="space-y-3 ">
      {/* Actions with Comment Input Between */}
      <div className="flex flex-wrap  justify-center items-center gap-2">
        {/* Left Buttons */}

        {/* Comment Input - Between Buttons */}
        <div className="flex-1 min-w-25 relative">
          <CommentInput postId={post.id} />
        </div>

        <div className="flex items-center gap-0.5 sm:gap-1">
          <SocialBtns post={post} />
        </div>
      </div>
    </div>
  );
};

export default PostFooter;
