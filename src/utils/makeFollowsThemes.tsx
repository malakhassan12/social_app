"use client";

import { FollowRequestEnum } from "@/types/enum/follow-req.enum";
import { Clock, UserCheck, UserPlus, UserMinus, X } from "lucide-react";

const getButtonStyle = ({
  pending,
  status,
}: {
  pending: boolean;
  status: FollowRequestEnum | null;
}) => {
  // Base with responsive padding and text size
  const base =
    "group relative inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium rounded-full transition-colors duration-200";

  if (pending) {
    return `${base} bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 cursor-wait`;
  }

  switch (status) {
    case FollowRequestEnum.ACCEPTED:
      return `${base} bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400
        hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400`;

    case FollowRequestEnum.PENDING:
      return `${base} bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400
        hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400`;

    case FollowRequestEnum.NOT_EXIST:
    case null:
    default:
      return `${base} bg-green-400 hover:bg-green-500 text-white shadow-sm hover:shadow-md hover:scale-105 active:scale-95`;
  }
};

// --------------------------------------------------------------
// Button Icon (responsive sizing)
// --------------------------------------------------------------
const getIcon = ({
  pending,
  status,
}: {
  pending: boolean;
  status: FollowRequestEnum | null;
}) => {
  if (pending) return null;

  // Responsive icon size: smaller on mobile, slightly larger on desktop
  const iconSize = "h-3 w-3 sm:h-3.5 sm:w-3.5";

  switch (status) {
    case FollowRequestEnum.ACCEPTED:
      return (
        <span className="relative inline-flex h-3 w-3 sm:h-3.5 sm:w-3.5">
          <UserCheck className={`${iconSize} absolute inset-0 group-hover:opacity-0 transition-opacity`} />
          <UserMinus className={`${iconSize} absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity`} />
        </span>
      );

    case FollowRequestEnum.PENDING:
      return (
        <span className="relative inline-flex h-3 w-3 sm:h-3.5 sm:w-3.5">
          <Clock className={`${iconSize} absolute inset-0 group-hover:opacity-0 transition-opacity`} />
          <X className={`${iconSize} absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity`} />
        </span>
      );

    case FollowRequestEnum.NOT_EXIST:
    case null:
    default:
      return <UserPlus className={iconSize} />;
  }
};

// --------------------------------------------------------------
// Button Text (unchanged – text is responsive via base class)
// --------------------------------------------------------------
const getText = ({
  pending,
  status,
}: {
  pending: boolean;
  status: FollowRequestEnum | null;
}) => {
  if (pending) return "Loading...";

  switch (status) {
    case FollowRequestEnum.ACCEPTED:
      return (
        <span className="relative inline-block">
          <span className="group-hover:opacity-0 transition-opacity">Friends</span>
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
            Un-friend
          </span>
        </span>
      );

    case FollowRequestEnum.PENDING:
      return (
        <span className="relative inline-block">
          <span className="group-hover:opacity-0 transition-opacity">Requested</span>
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
            Cancel
          </span>
        </span>
      );

    case FollowRequestEnum.NOT_EXIST:
    case null:
    default:
      return "Add Friend";
  }
};

export { getButtonStyle, getIcon, getText };