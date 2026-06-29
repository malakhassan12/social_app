import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Post } from "@/types/post.Types";
import ProfileAvatar from "@/components/Avatar/ProfileAvatar";
import { getUserId } from "@/helper/getUserId";
import PostFooter from "./PostFooter";
import PostContent from "./PostContent";
import { getTime } from "@/utils/getTime";

const PostCard = async ({ post }: { post: Post }) => {
  const userId = await getUserId();
  return (
    <Card className=" border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <div className="flex items-center gap-3">
          <ProfileAvatar image={post.author.image} name={post.author.name} />
          <div>
            <p className="font-semibold text-sm">{post.author.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {getTime({ time: post?.createdAt })}
            </p>
          </div>
        </div>
        {userId === post.author.id && (
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>

      {/* Content */}
      <CardContent className="p-4 pt-2">
        <PostContent post={post} />
      </CardContent>

      {/* Footer */}
      <CardFooter className=" pt-3 block border-t border-gray-100 dark:border-gray-800">
        <PostFooter post={post} />
      </CardFooter>
    </Card>
  );
};

export default PostCard;
