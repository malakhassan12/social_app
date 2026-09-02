import { Card } from "@/components/ui/card";
import { MapPin, Mail } from "lucide-react";
import { FC } from "react";
import { Friend } from "@/types/friend.Types";
import { Post } from "@/types/post.Types";
import ProfileImage from "./ProfileImage";
import FollowStats from "./FollowStats";
import AccountCard from "./AccountCard";

const ShowFollow: FC<{
  user: Friend;
  posts: Post[];
  followers: Friend[];
  followings: Friend[];
  friends?: Friend[];
}> = ({ user, followers, followings, friends = [] }) => {
  return (
    <Card className="w-full shadow-md border border-gray-200 dark:border-gray-800 p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <ProfileImage name={user?.name} image={user?.image} />
        <div className="flex-1 min-w-0 w-full">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
            {user?.username || "User"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate flex items-center gap-1">
            <Mail className="h-3.5 w-3.5 shrink-0" />
            {user?.email?.email}
          </p>
          {user?.country && (
            <p className="text-sm text-gray-400 dark:text-gray-500 truncate flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {user?.country}
            </p>
          )}
          {user?.bio && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {user?.bio}
            </p>
          )}
        </div>
      </div>

      {/* Rendered HERE on the server, then passed down as opaque children */}
      <FollowStats
        followersCount={followers.length}
        followingsCount={followings.length}
        friendsCount={friends.length}
        followersContent={followers.map((f) => (
          <AccountCard key={f.id} account={f} title="Followers" />
        ))}
        followingsContent={followings.map((f) => (
          <AccountCard key={f.id} account={f} title="Following" />
        ))}
        friendsContent={friends.map((f) => (
          <AccountCard key={f.id} account={f} title="Friends" />
        ))}
      />
    </Card>
  );
};

export default ShowFollow;