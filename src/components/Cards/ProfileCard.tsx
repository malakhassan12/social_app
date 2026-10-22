import ProfileAvatar from "../Avatar/ProfileAvatar";
import { MapPin, Mail, Users, FileText, UserPlus } from "lucide-react";
import getProfile from "@/helper/profile/getProfile";
import GlowingCard from "../animata/card/glowing-card";

const ProfileCard = async () => {
  const { user, followersTotal, followingsTotal, friendsTotal, postsTotal } =
    await getProfile();

  const numOfFollowings = followingsTotal;
  const numOfFollowers = followersTotal;
  const numOfPosts = postsTotal;
  const numOfRequests = friendsTotal;

  return (
    <GlowingCard
      fromColor="#fb7185"
      viaColor="#fb923c"
      toColor="#fcd34d"
      radius="3xl"
      glowOpacity={35}
      className="mx-auto w-full max-w-xs"
    >
      {/* Profile Info */}
      <div className="flex items-center gap-3">
        <ProfileAvatar name={user?.name} image={user?.image} />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-bold text-[#1a1e2b] dark:text-[#f4ede4]">
            {user?.username || "User"}
          </h2>
          <p className="flex items-center gap-1 truncate text-xs text-[#1a1e2b]/55 dark:text-[#f4ede4]/55">
            <Mail className="h-3 w-3 shrink-0" />
            {user?.email?.email}
          </p>
          {user?.country && (
            <p className="flex items-center gap-1 truncate text-xs text-[#1a1e2b]/55 dark:text-[#f4ede4]/55">
              <MapPin className="h-3 w-3 shrink-0" />
              {user.country}
            </p>
          )}
        </div>
      </div>

      {/* Bio */}
      {user?.bio && (
        <p className="line-clamp-1 text-xs text-[#1a1e2b]/60 dark:text-[#f4ede4]/60">
          {user.bio}
        </p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 border-t border-black/6 pt-3 sm:grid-cols-4 dark:border-white/8">
        <div className="text-center">
          <p className="text-sm font-bold text-[#1a1e2b] dark:text-[#f4ede4]">
            {numOfPosts}
          </p>
          <p className="flex items-center justify-center gap-0.5 text-[10px] text-[#1a1e2b]/55 dark:text-[#f4ede4]/55">
            <FileText className="h-2.5 w-2.5" />
            Posts
          </p>
        </div>

        <div className="text-center">
          <p className="text-sm font-bold text-[#1a1e2b] dark:text-[#f4ede4]">
            {numOfFollowers}
          </p>
          <p className="flex items-center justify-center gap-0.5 text-[10px] text-[#1a1e2b]/55 dark:text-[#f4ede4]/55">
            <Users className="h-2.5 w-2.5" />
            Followers
          </p>
        </div>

        <div className="text-center">
          <p className="text-sm font-bold text-[#1a1e2b] dark:text-[#f4ede4]">
            {numOfFollowings}
          </p>
          <p className="flex items-center justify-center gap-0.5 text-[10px] text-[#1a1e2b]/55 dark:text-[#f4ede4]/55">
            <Users className="h-2.5 w-2.5" />
            Following
          </p>
        </div>

        <div className="text-center">
          <p className="text-sm font-bold text-[#1a1e2b] dark:text-[#f4ede4]">
            {numOfRequests}
          </p>
          <p className="flex items-center justify-center gap-0.5 text-[10px] text-[#1a1e2b]/55 dark:text-[#f4ede4]/55">
            <UserPlus className="h-2.5 w-2.5" />
            Friends
          </p>
        </div>
      </div>
    </GlowingCard>
  );
};

export default ProfileCard;