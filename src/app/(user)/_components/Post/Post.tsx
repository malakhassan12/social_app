import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Post } from "@/types/post.Types";
import ProfileAvatar from "@/components/Avatar/ProfileAvatar";
import { getUserId } from "@/helper/getUserId";
import PostFooter from "./PostFooter";
import PostContent from "./PostContent";
import { getTime } from "@/utils/getTime";
import CurdPostBtn from "./CurdPostBtn";
import { Lock } from "lucide-react";

const PostCard = async ({ post }: { post: Post }) => {
  const userId = await getUserId();
  return (
    <Card className=" border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <div className="flex items-center gap-3">
          <ProfileAvatar
            image={post.author.image}
            name={post.author.name}
          />
          <div>
            <p className="font-semibold text-sm text-gray-900 dark:text-white">
              {post.author.name}
            </p>
            <div className="flex items-center gap-1.5">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {getTime({ time: post?.createdAt })}
              </p>
              {post?.isPrivate && (
                <>
                  <span className="text-gray-300 dark:text-gray-600">•</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-0.5">
                    <Lock className="h-3 w-3" />
                    Private
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {userId === post.author.id && <CurdPostBtn post={post} />}
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
