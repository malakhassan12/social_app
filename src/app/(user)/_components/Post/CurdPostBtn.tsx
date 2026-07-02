"use client";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import DeletePostBtn from "./DeletePostBtn";
import UpdatePostBtn from "./UpdatePostBtn";
import CopyPostBtn from "./CopyPostBtn";
import Link from "next/link";
import { Post } from "@/types/post.Types";

const CurdPostBtn = ({ post }: { post: Post }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800/50 transition-colors"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-48 p-1 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg bg-white dark:bg-[#1a1a2e]"
        align="start"
      >
        <div className="space-y-0.5">
          {/* Edit Button */}
          <UpdatePostBtn post={post} />

          {/* Copy Link Button */}
          <CopyPostBtn postId={post?.id} />

          {/* View Post Button */}
          <Link
            href={`/post/${post?.id}`}
            className="w-full flex items-center gap-2 text-gray-600 hover:text-green-500 hover:bg-green-50 dark:text-gray-300 dark:hover:text-green-400 dark:hover:bg-green-900/20 rounded-lg px-3 py-2 h-9 text-sm font-medium transition-colors duration-200"
          >
            <Eye className="h-4 w-4" />
            <span>View Post</span>
            <span className="ml-auto text-[10px] bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-full text-gray-400">
              New
            </span>
          </Link>

          {/* Divider */}
          <div className="my-1 h-px bg-gray-100 dark:bg-gray-800" />

          {/* Delete Button */}
          <DeletePostBtn postId={post?.id} />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CurdPostBtn;
