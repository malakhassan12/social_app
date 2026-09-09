import { Card } from "@/components/ui/card";
import ProfileAvatar from "../Avatar/ProfileAvatar";
import { MapPin, Mail, Users, FileText, UserPlus } from "lucide-react";
import getProfile from "@/helper/getProfile";

const ProfileCard = async () => {
  const { user, followersTotal, followingsTotal, friendsTotal, postsTotal } =
    await getProfile();

  const numOfFollowings = followingsTotal;
  const numOfFollowers = followersTotal;
  const numOfPosts = postsTotal;
  const numOfRequests = friendsTotal;

  
  return (
    <Card className="w-full max-w-xs mx-auto shadow-md border border-gray-200 dark:border-gray-800 p-4">
      {/* Profile Info */}
      <div className="flex items-center gap-3">
        <ProfileAvatar name={user?.name} image={user?.image} />
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white truncate">
            {user?.name || "User"}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate flex items-center gap-0.5">
            <Mail className="h-3 w-3 shrink-0" />
            {user?.email?.email}
          </p>
          {user?.country && (
            <p className="text-xs text-gray-400 dark:text-gray-500 truncate flex items-center gap-0.5">
              <MapPin className="h-3 w-3 shrink-0" />
              {user.country}
            </p>
          )}
        </div>
      </div>

      {/* Bio */}
      {user?.bio && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 line-clamp-1">
          {user.bio}
        </p>
      )}

      {/* Stats - responsive grid: 2 columns on mobile, 4 on larger */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
        {/* Posts */}
        <div className="text-center">
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            {numOfPosts}
          </p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center justify-center gap-0.5">
            <FileText className="h-2.5 w-2.5" />
            Posts
          </p>
        </div>

        {/* Followers */}
        <div className="text-center">
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            {numOfFollowers}
          </p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center justify-center gap-0.5">
            <Users className="h-2.5 w-2.5" />
            Followers
          </p>
        </div>

        {/* Following */}
        <div className="text-center">
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            {numOfFollowings}
          </p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center justify-center gap-0.5">
            <Users className="h-2.5 w-2.5" />
            Following
          </p>
        </div>

        {/* Friends (Pending Requests) */}
        <div className="text-center">
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            {numOfRequests}
          </p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center justify-center gap-0.5">
            <UserPlus className="h-2.5 w-2.5" />
            Friends
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ProfileCard;
