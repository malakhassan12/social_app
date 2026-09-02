"use client";

import { FC } from "react";
import ProfileAvatar from "@/components/Avatar/ProfileAvatar";
import { MapPin, Mail } from "lucide-react";
import FollowFriendBtn from "./FollowFriendBtn";
import AddFriendBtn from "./AddFriendBtn";
import { FollowRequestEnum } from "@/types/enum/follow-req.enum";

interface SuggestionItemProps {
  suggestion: {
    id: string;
    name: string | null;
    image: string | null;
    email: { email: string };
    country: string | null;
  };
  followStatus: boolean;
  requestStatus: FollowRequestEnum; // FollowRequestEnum
  rightPanel?: boolean;
}

const SuggestionItem: FC<SuggestionItemProps> = ({
  suggestion,
  followStatus,
  requestStatus,
  rightPanel,
}) => {
  return (
    <div
      className={`
        group relative flex transition-all duration-300
        ${
          rightPanel
            ? "flex-col items-center text-center p-5"
            : "flex-row items-center flex-wrap p-4 sm:p-5"
        }
        rounded-2xl bg-white dark:bg-gray-900/50 
        border border-gray-200 dark:border-gray-700 
        hover:border-purple-300 dark:hover:border-purple-700 
        hover:shadow-xl hover:shadow-purple-500/10 
        hover:-translate-y-1 
        hover:bg-linear-to-br hover:from-purple-50/50 hover:to-transparent 
        dark:hover:from-purple-900/20 dark:hover:to-transparent
      `}
    >
      {/* Avatar with subtle ring on hover */}
      <div className="relative">
        <ProfileAvatar
          image={suggestion.image}
          name={suggestion.name || "User"}
        />
      </div>

      {/* User info */}
      <div
        className={`flex-1 min-w-0 ${
          rightPanel ? "mt-3" : "ml-3 sm:ml-4"
        }`}
      >
        <p className="font-semibold text-gray-900 dark:text-white truncate text-base">
          {suggestion.name || "Unknown"}
        </p>

        {/* Email – subtle and truncated */}
        <p className="text-xs text-gray-400 dark:text-gray-500 truncate flex items-center gap-1">
          <Mail className="h-3 w-3 shrink-0" />
          {suggestion.email.email}
        </p>

        {/* Country */}
        {suggestion.country && (
          <div className="flex items-center gap-1 mt-0.5 text-gray-400 dark:text-gray-500">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="text-xs truncate">{suggestion.country}</span>
          </div>
        )}
      </div>

      {/* Action buttons – responsive */}
      <div
        className={`
          flex flex-wrap items-center gap-2 mt-3
          ${
            rightPanel
              ? "w-full justify-center"
              : "w-full sm:w-auto sm:justify-end sm:mt-0"
          }
        `}
      >
        <FollowFriendBtn followingId={suggestion.id} existFollow={followStatus} />
        <AddFriendBtn
          friendShipStatus={requestStatus}
          followingId={suggestion.id}
        />
      </div>
    </div>
  );
};

export default SuggestionItem;