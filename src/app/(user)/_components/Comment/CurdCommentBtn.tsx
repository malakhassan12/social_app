import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoreHorizontal } from "lucide-react";
import UpdateCommentBtn from "./UpdateCommentBtn";
import DeleteCommentBtn from "./DeleteCommentBtn";
import { FC } from "react";
import { Comment } from "@/types/comment.Types";

const CurdCommentBtn: FC<{
  comment: Comment;
}> = ({ comment }) => {
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
          <UpdateCommentBtn comment={comment} />

          {/* Divider */}
          <div className="my-1 h-px bg-gray-100 dark:bg-gray-800" />

          {/* Delete Button */}
          <DeleteCommentBtn comment={comment}/>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CurdCommentBtn;
