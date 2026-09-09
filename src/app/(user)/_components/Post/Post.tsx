import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Post } from "@/types/post.Types";
import ProfileAvatar from "@/components/Avatar/ProfileAvatar";
import PostFooter from "./PostFooter";
import PostContent from "./PostContent";
import { getTime } from "@/utils/getTime";
import CurdPostBtn from "./CurdPostBtn";
import { Lock,  } from "lucide-react";
import { getAccountId } from "@/helper/getAccountId";

const PostCard = async ({ post }: { post: Post }) => {
  const accountId = await getAccountId();

  return (
    <Card className="mb-4 border-0 bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-5 pb-2 sm:pb-3">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <ProfileAvatar image={post.author.image} name={post.author.name} />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
              {post.author.username}
            </p>
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {getTime({ time: post?.createdAt })}
              </p>
              {post?.isPrivate && (
                <>
                  <span className="text-gray-300 dark:text-gray-600">•</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-0.5 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-full">
                    <Lock className="h-2.5 w-2.5" />
                    Private
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {accountId === post.author.id && <CurdPostBtn post={post} />}
         
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="p-4 sm:p-5 pt-0 sm:pt-0">
        <PostContent post={post} />
      </CardContent>

      {/* Footer */}
      <CardFooter className="px-4 sm:px-5 py-3 sm:py-4 block border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
        <PostFooter post={post} />
      </CardFooter>
    </Card>
  );
};

export default PostCard;
