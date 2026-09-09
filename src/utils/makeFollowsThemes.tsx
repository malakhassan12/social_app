"use client";

import { FollowRequestEnum } from "@/types/enum/follow-req.enum";
import {
  Clock,
  UserCheck,
  UserPlus,
  UserMinus,
  X,
  Loader2,
} from "lucide-react";

const getButtonStyle = ({
  pending,
  status,
}: {
  pending: boolean;
  status: FollowRequestEnum | null;
}) => {
  // Base with responsive padding and text size
  const base =
    "group relative inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium rounded-full transition-all duration-200 whitespace-nowrap";

  if (pending) {
    return `${base} bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 cursor-wait opacity-70`;
  }

  switch (status) {
    case FollowRequestEnum.ACCEPTED:
      return `${base} bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400
        hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400
        border border-emerald-200 dark:border-emerald-800`;

    case FollowRequestEnum.PENDING:
      return `${base} bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400
        hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400
        border border-yellow-200 dark:border-yellow-800`;

    case FollowRequestEnum.NOT_EXIST:
    case null:
    default:
      return `${base} bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95
        border border-green-400 dark:border-green-600`;
  }
};

// Button Icon (responsive sizing)
const getIcon = ({
  pending,
  status,
}: {
  pending: boolean;
  status: FollowRequestEnum | null;
}) => {
  if (pending) return null;

  // Responsive icon sizes
  const iconSize = "h-3 w-3 sm:h-3.5 sm:w-3.5";
  const containerSize = "h-3 w-3 sm:h-3.5 sm:w-3.5";

  switch (status) {
    case FollowRequestEnum.ACCEPTED:
      return (
        <span className={`relative inline-flex ${containerSize} shrink-0`}>
          <UserCheck
            className={`${iconSize} absolute inset-0 group-hover:opacity-0 transition-opacity`}
          />
          <UserMinus
            className={`${iconSize} absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity`}
          />
        </span>
      );

    case FollowRequestEnum.PENDING:
      return (
        <span className={`relative inline-flex ${containerSize} shrink-0`}>
          <Clock
            className={`${iconSize} absolute inset-0 group-hover:opacity-0 transition-opacity`}
          />
          <X
            className={`${iconSize} absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity`}
          />
        </span>
      );

    case FollowRequestEnum.NOT_EXIST:
    case null:
    default:
      return <UserPlus className={`${iconSize} shrink-0`} />;
  }
};

// Button Text
const getText = ({
  pending,
  status,
}: {
  pending: boolean;
  status: FollowRequestEnum | null;
}) => {
  if (pending) {
    return (
      <span className="inline-flex items-center gap-1">
        <span className="h-3 w-3 sm:h-3.5 sm:w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        <span className="hidden xs:inline">Loading...</span>
        <span className="xs:hidden">...</span>
      </span>
    );
  }

  switch (status) {
    case FollowRequestEnum.ACCEPTED:
      return (
        <span className="relative inline-block text-center min-w-10 sm:min-w-12">
          <span className="group-hover:opacity-0 transition-opacity">
            Friends
          </span>
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
            Un-friend
          </span>
        </span>
      );

    case FollowRequestEnum.PENDING:
      return (
        <span className="relative inline-block text-center min-w-10 sm:min-w-12">
          <span className="group-hover:opacity-0 transition-opacity">
            Requested
          </span>
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
            Cancel
          </span>
        </span>
      );

    case FollowRequestEnum.NOT_EXIST:
    case null:
    default:
      return <span className="text-center">Add Friend</span>;
  }
};

const getButtonFollowStyles = ({
  existFollow,
  pending,
}: {
  existFollow: boolean;
  pending: boolean;
}) => {
  if (pending) {
    return {
      className:
        "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 cursor-wait opacity-70 border border-gray-200 dark:border-gray-700",
      icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
      text: existFollow ? "Unfollowing..." : "Following...",
    };
  }

  if (existFollow) {
    return {
      className:
        "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 border border-emerald-200 dark:border-emerald-800",
      icon: (
        <span className="relative inline-flex h-3.5 w-3.5">
          <UserMinus className="h-3.5 w-3.5 absolute inset-0 group-hover:opacity-0 transition-opacity" />
          <X className="h-3.5 w-3.5 absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" />
        </span>
      ),
      text: (
        <span className="relative inline-block">
          <span className="group-hover:opacity-0 transition-opacity">
            Following
          </span>
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
            Unfollow
          </span>
        </span>
      ),
    };
  }

  return {
    className:
      "bg-purple-500 hover:bg-purple-600 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 border border-purple-400 dark:border-purple-600",
    icon: <UserPlus className="h-3.5 w-3.5" />,
    text: "Follow",
  };
};

export { getButtonStyle, getIcon, getText, getButtonFollowStyles };
