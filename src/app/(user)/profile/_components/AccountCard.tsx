import ProfileAvatar from "@/components/Avatar/ProfileAvatar";
import checkFollowStatus from "@/helper/checkFollowStatus";
import { Friend } from "@/types/friend.Types";
import AddFriendBtn from "../../explore/_components/AddFriendBtn";
import FollowFriendBtn from "../../explore/_components/FollowFriendBtn";
import { FollowRequestEnum } from "@/types/enum/follow-req.enum";
import { Mail, MapPin } from "lucide-react";
import getStatusFriendship from "@/actions/FollowRequest/getStatusFriendship";

interface AccountCardProps {
  account: Friend;
  title: string; // "Friends", "Following", or other
}

const AccountCard = async ({ account, title }: AccountCardProps) => {
  const [followStatus, requestStatus] = await Promise.all([
    checkFollowStatus(account.id),
    getStatusFriendship(account.id),
  ]);

  // Determine which button to render
  const renderButton = () => {
    if (title === "Friends") {
      return (
        <AddFriendBtn
          friendShipStatus={requestStatus?.status as FollowRequestEnum}
          followingId={account.id}
        />
      );
    }
    if (title === "Following") {

      return (
        <>
          <FollowFriendBtn
            existFollow={followStatus?.status as boolean}
            followingId={account.id}
          />
          <AddFriendBtn
            friendShipStatus={requestStatus?.status as FollowRequestEnum}
            followingId={account.id}
          />
        </>
      );
    }

    if (title == "Followers") {
      return (
        <>
          <FollowFriendBtn
            existFollow={followStatus?.status as boolean}
            followingId={account.id}
          />
          <AddFriendBtn
            friendShipStatus={requestStatus?.status as FollowRequestEnum}
            followingId={account.id}
          />
        </>
      );
    }
  };

  return (
    <div className="group flex items-center justify-between p-3 sm:p-4 rounded-xl transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
      {/* Left side: Avatar + Info */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
        <ProfileAvatar image={account.image} name={account.name || "User"} />

        <div className="min-w-0 flex-1">
          <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white truncate">
            {account.name || "Unknown User"}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 text-xs text-gray-500 dark:text-gray-400 truncate">
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3 shrink-0" />
              {account.email?.email || "No email"}
            </span>
            {account.country && (
              <>
                <span className="hidden sm:inline text-gray-300 dark:text-gray-600">
                  •
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 shrink-0" />
                  {account.country}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right side: Action Button */}
      <div className="shrink-0 ml-2 sm:ml-4">{renderButton()}</div>
    </div>
  );
};

export default AccountCard;
