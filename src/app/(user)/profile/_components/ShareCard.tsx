import { Card,  CardHeader } from "@/components/ui/card";
import { Share2 } from "lucide-react";
import { getTime } from "@/utils/getTime";
import { Share } from "@/types/share.Types";
import ProfileAvatar from "@/components/Avatar/ProfileAvatar";
import PostCard from "../../_components/Post/Post";
import { Post } from "@/types/post.Types";

const ShareCard = ({ share }: { share: Share }) => {
  const shareTo = share.shareTo ?? { name: "Unknown", image: undefined };
  const isSharedToSelf = share.shareFromId === share.shareToId;

  return (
    <Card className="border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center gap-3 p-4 pb-2">
        <ProfileAvatar image={shareTo.image} name={shareTo.name} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
            {shareTo.name}
          </p>
          <div className="flex items-center gap-1.5">
            <Share2 className="h-3 w-3 text-gray-400" />
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              shared{" "}
              {isSharedToSelf
                ? "to their profile"
                : `By ${share.shareTo?.name ?? "their profile"}`}
            </p>
          </div>
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
          {getTime({ time: share.createdAt })}
        </span>
      </CardHeader>
      <CardHeader className="p-4 pb-2">
        <PostCard post={share?.post as unknown as Post} />
      </CardHeader>
    </Card>
  );
};

export default ShareCard;
