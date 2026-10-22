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
  const getStatusInfo = () => {
    switch (requestStatus) {
      case FollowRequestEnum.PENDING:
        return {
          label: "Pending",
          icon: <Clock className="h-3 w-3" />,
          color:
            "border-amber-400/30 bg-amber-400/10 text-amber-700 dark:border-amber-300/25 dark:bg-amber-300/[0.08] dark:text-amber-300",
        };
      case FollowRequestEnum.ACCEPTED:
        return {
          label: "Friends",
          icon: <Check className="h-3 w-3" />,
          color:
            "border-emerald-400/30 bg-emerald-400/10 text-emerald-700 dark:border-emerald-300/25 dark:bg-emerald-300/[0.08] dark:text-emerald-300",
        };
      case FollowRequestEnum.NOT_EXIST:
        return {
          label: "Not Connected",
          icon: <UserPlus className="h-3 w-3" />,
          color:
            "border-black/[0.08] bg-black/[0.04] text-[#1a1e2b]/60 dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-[#f4ede4]/60",
        };
      default:
        return {
          label: "Add Friend",
          icon: <UserPlus className="h-3 w-3" />,
          color:
            "border-rose-400/30 bg-rose-400/10 text-rose-700 dark:border-rose-300/25 dark:bg-rose-300/[0.08] dark:text-rose-300",
        };
    }
  };

  const statusInfo = getStatusInfo();
  const showStatusBadge = requestStatus !== FollowRequestEnum.NOT_EXIST;

  return (
    <div
      className={`
        group relative flex w-full transition-all duration-300
        rounded-2xl border border-black/[0.06] bg-white
        shadow-[0_1px_3px_rgba(0,0,0,0.04)]
        hover:-translate-y-0.5 hover:border-rose-400/30
        hover:shadow-[0_12px_32px_-12px_rgba(251,113,133,0.35)]
        dark:border-white/[0.06] dark:bg-[#0f0d18]
        dark:hover:border-rose-300/25
        dark:hover:shadow-[0_12px_32px_-12px_rgba(251,113,133,0.5)]
        ${
          rightPanel
            ? "flex-col items-center gap-3 p-5 text-center sm:p-6"
            : "flex-col items-center gap-3 p-4 sm:flex-row sm:gap-4 sm:p-5 sm:text-left"
        }
      `}
    >
      {/* Status Badge */}
      {showStatusBadge && (
        <div
          className={`absolute ${
            rightPanel ? "right-4 top-4" : "right-3 top-3 sm:right-4 sm:top-4"
          }`}
        >
          <span
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium shadow-sm sm:text-xs ${statusInfo.color}`}
          >
            {statusInfo.icon}
            {statusInfo.label}
          </span>
        </div>
      )}

      {/* More Options */}
      <div
        className={`absolute ${
          rightPanel ? "left-4 top-4" : "left-3 top-3 sm:left-4 sm:top-4"
        }`}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full text-[#1a1e2b]/45 opacity-0 transition-all group-hover:opacity-100 hover:bg-rose-400/10 hover:text-rose-600 focus-visible:opacity-100 dark:text-[#f4ede4]/45 dark:hover:bg-rose-300/10 dark:hover:text-rose-300"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem asChild>
              <Link href={`/profile/${suggestion.id}`}>View Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Message</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600 dark:text-red-400">
              Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="relative">
          <ProfileAvatar
            image={suggestion.image}
            name={suggestion.username || "User"}
          />
          <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400 shadow-sm dark:border-[#0f0d18]">
            <span className="sr-only">Online</span>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div
        className={`min-w-0 flex-1 ${
          rightPanel ? "w-full text-center" : "w-full sm:text-left"
        }`}
      >
        <p className="truncate text-sm font-semibold text-[#1a1e2b] sm:text-base dark:text-[#f4ede4]">
          {suggestion.username || "Unknown User"}
        </p>

        <p
          className={`mt-0.5 flex items-center gap-1.5 truncate text-xs text-[#1a1e2b]/55 dark:text-[#f4ede4]/55 ${
            rightPanel ? "justify-center" : "justify-center sm:justify-start"
          }`}
        >
          <Mail className="h-3 w-3 shrink-0" />
          <span className="truncate">{suggestion.email.email}</span>
        </p>

        {suggestion.country && (
          <p
            className={`mt-0.5 flex items-center gap-1.5 text-xs text-[#1a1e2b]/55 dark:text-[#f4ede4]/55 ${
              rightPanel ? "justify-center" : "justify-center sm:justify-start"
            }`}
          >
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{suggestion.country}</span>
          </p>
        )}
      </div>

      {/* Actions */}
      <div
        className={`
          flex w-full flex-wrap items-center gap-2
          ${
            rightPanel
              ? "mt-2 justify-center"
              : "mt-1 justify-center sm:mt-0 sm:w-auto sm:justify-end"
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