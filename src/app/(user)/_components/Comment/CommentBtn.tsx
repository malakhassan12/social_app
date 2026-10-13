// import prisma from "@/lib/prisma";
import { Post } from "@/types/post.Types";
import { MessageCircleIcon } from "lucide-react";
import Link from "next/link";

const CommentBtn =  ({ post }: { post: Post }) => {
  // const comments = await prisma.post.findUnique({
  //   where: { id: post?.id },
  //   include: {
  //     comments: {
  //       select: { id: true },
  //     },
  //   },
  // });
  return (
    <Link
      href={`/post/${post?.id}`}
      aria-label={`View comments on ${post.author.username}'s post (${post._count.comments ?? 0})`}
      className="inline-flex items-center gap-1.5 px-3 h-8 sm:h-9 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors rounded-full text-sm"
    >
      <MessageCircleIcon aria-hidden="true" className="h-4 w-4" />
        <span className="text-xs font-medium">{post._count.comments ?? 0}</span>

    </Link>
  );
};

export default CommentBtn;
