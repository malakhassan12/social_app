import { Post } from "@/types/post.Types";
import { MessageCircleIcon } from "lucide-react";
import Link from "next/link";

const CommentBtn = ({ post }: { post: Post }) => {
  return (
    <>
      <Link
        href={`/post/${post?.id}`}
        className="inline-flex items-center gap-1.5 px-3 h-8 sm:h-9 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors rounded-full text-sm"
      >
        <MessageCircleIcon className="h-4 w-4" />
      </Link>
    </>
  );
};

export default CommentBtn;
