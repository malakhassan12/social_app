import ProfileImage from "./ProfileImage";
import { Mail, MapPin, Lock } from "lucide-react";
import { Friend } from "@/types/friend.Types";
import { FC } from "react";
import FollowFriendBtn from "../../explore/_components/FollowFriendBtn";
import AddFriendBtn from "../../explore/_components/AddFriendBtn";
import checkFollowStatus from "@/helper/checkFollowStatus";
import getStatusOfRequest from "@/actions/FollowRequest/getStatusOfRequest";
import { FollowRequestEnum } from "@/types/enum/follow-req.enum";
import prisma from "@/lib/prisma";
import { AccountType } from "@/generated/prisma/enums";
import { getAccountId } from "@/helper/getAccountId";

const ProfileCard: FC<{
  user: Friend;
  profileId: string | undefined;
}> = async ({ user, profileId }) => {
  let followStatus;
  let requestStatus;

  const accountId = await getAccountId();


  let profile: { type: AccountType } | null = null;
  if (profileId) {
    [followStatus, requestStatus] = await Promise.all([
      (await checkFollowStatus(profileId, accountId as string)).status,
      (await getStatusOfRequest(profileId, accountId as string)).status,
    ]);
    profile = await prisma.account.findFirst({
      where: {
        id: profileId,
      },
      select: {
        type: true,
      },
    });
  }



  const isPrivate = profile?.type === AccountType.PRIVATE;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-white dark:bg-gray-900/80 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Profile Image */}
      <div className="relative">
        <ProfileImage name={user?.name} image={user?.image} />
        {isPrivate && (
          <div className="absolute -bottom-1 -right-1 bg-gray-200 dark:bg-gray-700 rounded-full p-0.5">
            <Lock className="h-3 w-3 text-gray-500 dark:text-gray-400" />
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0 w-full">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
            {user?.username || "User"}
          </h2>
          {isPrivate && (
            <span className="text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Lock className="h-2.5 w-2.5" />
              Private
            </span>
          )}
        </div>

        <div className="space-y-0.5 mt-0.5">
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 shrink-0" />
            {user?.email?.email}
          </p>
          {user?.country && (
            <p className="text-sm text-gray-400 dark:text-gray-500 truncate flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {user?.country}
            </p>
          )}
        </div>

        {user?.bio && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
            {user?.bio}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      {profileId && (
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0">
          <AddFriendBtn
            friendShipStatus={requestStatus as unknown as FollowRequestEnum}
            followingId={profileId}
          />
          {!isPrivate && (
            <FollowFriendBtn
              existFollow={followStatus as unknown as boolean}
              followingId={profileId}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
