"use client";

import { FC } from "react";
import ProfileAvatar from "@/components/Avatar/ProfileAvatar";
import {
  MapPin,
  Mail,
  UserPlus,
  Check,
  Clock,
  MoreHorizontal,
} from "lucide-react";
import FollowFriendBtn from "./FollowFriendBtn";
import AddFriendBtn from "./AddFriendBtn";
import { FollowRequestEnum } from "@/types/enum/follow-req.enum";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Account } from "@/types/account.Types";
import { AccountType } from "@/generated/prisma/enums";

interface SuggestionItemProps {
  suggestion: Account;
  followStatus: boolean;
  requestStatus: FollowRequestEnum;
  rightPanel?: boolean;
}

const SuggestionItem: FC<SuggestionItemProps> = ({
  suggestion,
  followStatus,
  requestStatus,
  rightPanel,
}) => {
  // Get status label and icon
  const getStatusInfo = () => {
    switch (requestStatus) {
      case FollowRequestEnum.PENDING:
        return {
          label: "Pending",
          icon: <Clock className="h-3 w-3" />,
          color:
            "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
        };
      case FollowRequestEnum.ACCEPTED:
        return {
          label: "Friends",
          icon: <Check className="h-3 w-3" />,
          color:
            "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
        };
      case FollowRequestEnum.NOT_EXIST:
        return {
          label: "Not Connected",
          icon: <UserPlus className="h-3 w-3" />,
          color:
            "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
        };
      default:
        return {
          label: "Add Friend",
          icon: <UserPlus className="h-3 w-3" />,
          color:
            "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
        };
    }
  };

  const statusInfo = getStatusInfo();
  const showStatusBadge = requestStatus !== FollowRequestEnum.NOT_EXIST;

  return (
    <div
      className={`
        group relative flex transition-all duration-200
        ${
          rightPanel
            ? "flex-col items-center text-center p-5 sm:p-6"
            : "flex-col items-center flex-wrap p-4 sm:p-5 gap-3"
        }
        rounded-2xl bg-white dark:bg-gray-900/80 
        border border-gray-200/80 dark:border-gray-700/80 
        hover:border-purple-300 dark:hover:border-purple-600 
        hover:shadow-xl hover:shadow-purple-500/10 
        hover:-translate-y-1 
        hover:bg-linear-to-br hover:from-purple-50/40 hover:to-transparent 
        dark:hover:from-purple-900/15 dark:hover:to-transparent
        ${rightPanel ? "hover:scale-[1.02]" : ""}
      `}
    >
      {/* Status Badge - Top Right */}
      {showStatusBadge && (
        <div
          className={`absolute top-3 right-3 ${rightPanel ? "top-4 right-4" : ""}`}
        >
          <span
            className={`
            text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5
            border ${statusInfo.color}
            shadow-sm
          `}
          >
            {statusInfo.icon}
            {statusInfo.label}
          </span>
        </div>
      )}

      {/* More Options - Top Left */}
      <div
        className={`absolute top-3 left-3 ${rightPanel ? "top-4 left-4" : ""}`}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem>
              <Link href={`/profile/${suggestion.id}`}>View Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Message</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Report</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Avatar Section */}
      <div className={`relative ${rightPanel ? "mt-2" : "hrink-0"}`}>
        <div className="relative">
          <ProfileAvatar
            image={suggestion.image}
            name={suggestion.username || "User"}
          />
          {/* Online Status Indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-900 shadow-sm">
            <span className="sr-only">Online</span>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className={`flex-1 min-w-0 ${rightPanel ? "mt-3 w-full" : ""}`}>
        <div className="flex items-center gap-2">
          <p className="font-semibold text-gray-900 dark:text-white truncate text-sm sm:text-base">
            {suggestion.username || "Unknown User"}
          </p>
        </div>

        {/* Email */}
        <p className="text-xs text-gray-400 dark:text-gray-500 truncate flex items-center gap-1.5">
          <Mail className="h-3 w-3 shrink-0" />
          <span className="truncate">{suggestion.email.email}</span>
        </p>

        {/* Country with flag emoji - optional enhancement */}
        {suggestion.country && (
          <div className="flex items-center gap-1.5 mt-0.5 text-gray-400 dark:text-gray-500">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="text-xs truncate">{suggestion.country}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div
        className={`
          flex flex-wrap items-center gap-2
          ${
            rightPanel
              ? "w-full justify-center mt-4"
              : "w-full justify-center sm:w-auto sm:justify-end sm:mt-0 ml-0 sm:ml-2"
          }
        `}
      >
        {suggestion.type !== AccountType.PRIVATE && (
          <FollowFriendBtn
            followingId={suggestion.id}
            existFollow={followStatus}
          />
        )}

        <AddFriendBtn
          friendShipStatus={requestStatus}
          followingId={suggestion.id}
        />
      </div>
    </div>
  );
};

export default SuggestionItem;
