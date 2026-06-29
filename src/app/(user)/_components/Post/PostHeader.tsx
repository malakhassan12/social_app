import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Post } from "@/types/post.Types";
import { getTime } from "@/utils/getTime";
const PostHeader = ({ post }: { post: Post }) => {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-9 w-9">
        <AvatarImage
          src={post?.author?.image || undefined}
          alt={post?.author?.name}
        />
        <AvatarFallback className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
          {post?.author?.name?.charAt(0).toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="font-semibold text-sm">{post?.author?.name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {getTime({ time: post.createdAt })}
        </p>
      </div>
    </div>
  );
};

export default PostHeader;
