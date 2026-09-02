import Link from "next/link";
import React, { FC } from "react";
import ProfileAvatar from "../Avatar/ProfileAvatar";
import { MapPin, Mail, UserCheck } from "lucide-react";
import { Account } from "@/types/account.Types";

const UserCard: FC<{
  account: Account;
  showStatus?: boolean;
  isFollowing?: boolean;
}> = ({ account, showStatus = false, isFollowing = false }) => {
  return (
    <Link href={`/profile/${account.id}`}>
      <div className="flex items-center gap-3 rounded-xl p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 group cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
        <ProfileAvatar
          image={account.image}
          name={account.name}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
              {account.name}
            </p>
            {showStatus && isFollowing && (
              <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <UserCheck className="h-2.5 w-2.5" />
                Following
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <Mail className="h-3 w-3 text-gray-400" />
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {account.email.email}
            </p>
          </div>
          {account.country && (
            <div className="flex items-center gap-1">
              <MapPin className="h-2.5 w-2.5 text-gray-400" />
              <p className="text-[10px] text-gray-400 truncate">
                {account.country}
              </p>
            </div>
          )}
        </div>
        
      </div>
    </Link>
  );
};

export default UserCard;