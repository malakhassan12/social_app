import { Card, CardHeader } from "@/components/ui/card";
import { Share2 } from "lucide-react";
import { getTime } from "@/utils/getTime";
import { Share } from "@/types/share.Types";
import ProfileAvatar from "@/components/Avatar/ProfileAvatar";
import PostView from "../../_components/Post/PostView";
import { Post } from "@/types/post.Types";
import { Account } from "@/types/account.Types";

const ShareCard = ({ share, account }: { share: Share; account: Account }) => {
  const shareTo = share?.shareTo ?? { name: "Unknown", image: undefined };
  const isSharedToSelf = share?.shareFromId === share?.shareToId;

  return (
    <Card className="mb-4 overflow-hidden rounded-2xl border border-black/6 bg-white shadow-xl shadow-black/6 transition-all duration-300 hover:shadow-2xl hover:shadow-black/10 dark:border-white/6 dark:bg-[#0f0d18] dark:shadow-black/40 dark:hover:shadow-black/60">
      <CardHeader className="flex flex-row items-center gap-3 p-4 pb-2">
        <ProfileAvatar image={shareTo?.image} name={shareTo?.name} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[#1a1e2b] dark:text-[#f4ede4]">
            {shareTo?.name}
          </p>
          <div className="flex items-center gap-1.5">
            <Share2 className="h-3 w-3 text-rose-500 dark:text-rose-300" />
            <p className="truncate text-xs text-[#1a1e2b]/55 dark:text-[#f4ede4]/55">
              shared{" "}
              {isSharedToSelf
                ? "to their profile"
                : `By ${share?.shareTo?.name ?? "their profile"}`}
            </p>
          </div>
        </div>
        <span className="shrink-0 text-xs text-[#1a1e2b]/40 tabular-nums dark:text-[#f4ede4]/40">
          {getTime({ time: share.createdAt })}
        </span>
      </CardHeader>
      <CardHeader className="p-4 pb-2 pt-2">
        <PostView
          post={share?.post as unknown as Post}
          account={account as Account}
        />
      </CardHeader>
    </Card>
  );
};

export default ShareCard;