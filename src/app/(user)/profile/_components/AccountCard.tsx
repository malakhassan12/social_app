import ProfileAvatar from "@/components/Avatar/ProfileAvatar";
import checkFollowStatus from "@/helper/checkFollowStatus";
import { Friend } from "@/types/friend.Types";
import AddFriendBtn from "../../explore/_components/AddFriendBtn";
import FollowFriendBtn from "../../explore/_components/FollowFriendBtn";
import { FollowRequestEnum } from "@/types/enum/follow-req.enum";
import { Mail, MapPin, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import getStatusOfRequest from "@/actions/FollowRequest/getStatusOfRequest";
import prisma from "@/lib/prisma";
import { AccountType } from "@/generated/prisma/enums";

interface AccountCardProps {
  account: Friend;
  title: string; // "Friends", "Following", or other
}

const AccountCard = async ({ account, title }: AccountCardProps) => {
  const [followStatus, requestStatus] = await Promise.all([
    checkFollowStatus(account.id),
    getStatusOfRequest(account.id),
  ]);

  const profileIsPrivate = await prisma.account.findFirst({
    where: {
      id: account.id,
    },
    select: {
      type: true,
    },
  });
  // Determine which button to render
  const renderButton = () => {
    return (
      <div className="flex items-center gap-1.5">
        {profileIsPrivate?.type !== AccountType.PRIVATE && (
          <FollowFriendBtn
            existFollow={followStatus?.status as boolean}
            followingId={account.id}
          />
        )}

        <AddFriendBtn
          friendShipStatus={requestStatus?.status as FollowRequestEnum}
          followingId={account.id}
        />
      </div>
    );
  };

  return (
    <Card className="border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 hover:border-purple-200 dark:hover:border-purple-800">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center justify-between gap-3">
          {/* Left side: Avatar + Info */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <div className="relative">
              <ProfileAvatar
                image={account.image}
                name={account.username || "User"}
              />
              {/* Online indicator - optional */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-900" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
                  {account.username || "Unknown User"}
                </p>
                {title === "Friends" && (
                  <Badge
                    variant="secondary"
                    className="text-[8px] px-1.5 py-0 h-4 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  >
                    <Users className="h-2.5 w-2.5 mr-0.5" />
                    Friend
                  </Badge>
                )}
              </div>

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
          <div className="shrink-0 flex items-center gap-1.5">
            {renderButton()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountCard;
