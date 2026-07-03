import { Post } from "@/types/post.Types";
import Link from "next/link";
import  { FC } from "react";
import ProfileAvatar from "../Avatar/ProfileAvatar";
import { FileText, Heart, Clock } from "lucide-react";
import { getTime } from "@/utils/getTime";

const PostCard: FC<{
  post: Post;
  showStats?: boolean;
}> = ({ post, showStats = true }) => {
  const likeCount = post.likes?.length || 0;

  return (
    <Link href={`/post/${post.id}`}>
      <div className="mb-2 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-all duration-200 group cursor-pointer hover:shadow-md">
        {/* Header */}
        <div className="flex items-center gap-3">
          <ProfileAvatar image={post.author.image} name={post.author.name} />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
              {post.author.name}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {getTime({ time: post.createdAt })}
              </span>
              {post.isPrivate && (
                <span className="text-[10px] bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded-full">
                  Private
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-3 flex gap-2">
          <FileText className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" />
          <p className="line-clamp-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {post.desc}
          </p>
        </div>

        {/* Images Preview */}
        {post.image && post.image.length > 0 && (
          <div className="mt-3 flex gap-1.5">
            {post.image.slice(0, 3).map((img, index) => (
              <div
                key={index}
                className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800"
              >
                <img
                  src={img}
                  alt="Post image"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {post.image.length > 3 && (
              <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs text-gray-500">
                +{post.image.length - 3}
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        {showStats && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <Heart className="h-3.5 w-3.5 text-red-400" />
              <span>{likeCount}</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 ml-auto">
              <Clock className="h-3 w-3" />

              <span> {getTime({ time: post.createdAt })}</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default PostCard;
