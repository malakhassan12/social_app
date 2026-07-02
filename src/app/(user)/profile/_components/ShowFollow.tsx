"use client";

import { Card } from "@/components/ui/card";
import ProfileAvatar from "@/components/Avatar/ProfileAvatar";
import { MapPin, Mail, Users, FileText } from "lucide-react";
import { FC, useState } from "react";
import { Follower, User } from "@/types/profile.Types";
import { Post } from "@/types/post.Types";
import FollowModal from "./FollowModal";
import ProfileImage from "./ProfileImage";

const ShowFollow: FC<{
  user: User;
  posts: Post[];
  followers: Follower[];
  followings: Follower[];
}> = ({ user, posts, followers, followings }) => {
  const [isFollowersOpen, setIsFollowersOpen] = useState(false);
  const [isFollowingsOpen, setIsFollowingsOpen] = useState(false);

  const followersCount = followers?.length || 0;
  const followingsCount = followings?.length || 0;
  const postsCount = posts?.length || 0;

  const followersUsers = followers.map((f) => f.follower);

  const followingUsers = followings.map((f) => f.following);

  return (
    <>
      <Card className="w-full shadow-md border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Avatar */}

          <ProfileImage name={user?.name} image={user?.image} />

          {/* User Info */}
          <div className="flex-1 min-w-0 w-full">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
              {user?.name || "User"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate flex items-center gap-1">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              {user?.email}
            </p>
            {user?.country && (
              <p className="text-sm text-gray-400 dark:text-gray-500 truncate flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                {user.country}
              </p>
            )}
            {user?.bio && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                {user.bio}
              </p>
            )}
          </div>
        </div>

        {/* Stats - Clickable */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {postsCount}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
              <FileText className="h-3.5 w-3.5" />
              Posts
            </p>
          </div>

          {/* Followers - Clickable */}
          <button
            onClick={() => setIsFollowersOpen(true)}
            className="text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg p-2 transition-colors -m-2"
          >
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {followersCount}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
              <Users className="h-3.5 w-3.5" />
              Followers
            </p>
          </button>

          {/* Following - Clickable */}
          <button
            onClick={() => setIsFollowingsOpen(true)}
            className="text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg p-2 transition-colors -m-2"
          >
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {followingsCount}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
              <Users className="h-3.5 w-3.5" />
              Following
            </p>
          </button>
        </div>
      </Card>

      {/* Followers Modal */}
      <FollowModal
        isOpen={isFollowersOpen}
        onClose={() => setIsFollowersOpen(false)}
        title="Followers"
        users={followersUsers}
        currentUserId={user.id}
      />

      {/* Following Modal */}
      <FollowModal
        isOpen={isFollowingsOpen}
        onClose={() => setIsFollowingsOpen(false)}
        title="Following"
        users={followingUsers}
        currentUserId={user.id}
      />
    </>
  );
};

export default ShowFollow;
