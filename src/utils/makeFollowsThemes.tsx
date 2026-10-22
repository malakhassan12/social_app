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
  const base =
    "group relative inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold rounded-full transition-all duration-200 whitespace-nowrap";

  if (pending) {
    return `${base} cursor-wait border border-black/[0.06] bg-black/[0.04] text-[#1a1e2b]/50 opacity-70 dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-[#f4ede4]/50`;
  }

  switch (status) {
    case FollowRequestEnum.ACCEPTED:
      return `${base} border border-rose-400/25 bg-rose-400/10 text-rose-600 hover:border-red-400/40 hover:bg-red-400/15 hover:text-red-600 dark:border-rose-300/20 dark:bg-rose-300/[0.08] dark:text-rose-300 dark:hover:border-red-400/30 dark:hover:bg-red-400/10 dark:hover:text-red-400`;

    case FollowRequestEnum.PENDING:
      return `${base} border border-amber-400/30 bg-amber-400/10 text-amber-700 hover:border-red-400/40 hover:bg-red-400/15 hover:text-red-600 dark:border-amber-300/25 dark:bg-amber-300/[0.08] dark:text-amber-300 dark:hover:border-red-400/30 dark:hover:bg-red-400/10 dark:hover:text-red-400`;

    case FollowRequestEnum.NOT_EXIST:
    case null:
    default:
      return `${base} bg-gradient-to-r from-rose-400 via-orange-400 to-amber-300 text-[#1a1e2b] shadow-[0_4px_12px_-4px_rgba(251,113,133,0.6)] hover:-translate-y-0.5 hover:shadow-[0_6px_16px_-6px_rgba(251,146,60,0.7)] hover:brightness-105 active:translate-y-0 active:scale-95 dark:text-[#0b0a12] dark:shadow-[0_4px_12px_-4px_rgba(251,113,133,0.7)] dark:hover:shadow-[0_6px_16px_-6px_rgba(251,146,60,0.85)]`;
  }
};

const getIcon = ({
  pending,
  status,
}: {
  pending: boolean;
  status: FollowRequestEnum | null;
}) => {
  if (pending) return null;

  const iconSize = "h-3 w-3 sm:h-3.5 sm:w-3.5";
  const containerSize = "h-3 w-3 sm:h-3.5 sm:w-3.5";

  switch (status) {
    case FollowRequestEnum.ACCEPTED:
      return (
        <span className={`relative inline-flex ${containerSize} shrink-0`}>
          <UserCheck
            className={`${iconSize} absolute inset-0 transition-opacity group-hover:opacity-0`}
          />
          <UserMinus
            className={`${iconSize} absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100`}
          />
        </span>
      );

    case FollowRequestEnum.PENDING:
      return (
        <span className={`relative inline-flex ${containerSize} shrink-0`}>
          <Clock
            className={`${iconSize} absolute inset-0 transition-opacity group-hover:opacity-0`}
          />
          <X
            className={`${iconSize} absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100`}
          />
        </span>
      );

    case FollowRequestEnum.NOT_EXIST:
    case null:
    default:
      return (
        <UserPlus
          className={`${iconSize} shrink-0 transition-transform duration-200 group-hover:scale-110`}
        />
      );
  }
};

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
        <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent sm:h-3.5 sm:w-3.5" />
        <span className="hidden sm:inline">Loading...</span>
        <span className="sm:hidden">...</span>
      </span>
    );
  }

  switch (status) {
    case FollowRequestEnum.ACCEPTED:
      return (
        <span className="relative inline-block min-w-10 text-center sm:min-w-12">
          <span className="transition-opacity group-hover:opacity-0">
            Friends
          </span>
          <span className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
            Un-friend
          </span>
        </span>
      );

    case FollowRequestEnum.PENDING:
      return (
        <span className="relative inline-block min-w-10 text-center sm:min-w-12">
          <span className="transition-opacity group-hover:opacity-0">
            Requested
          </span>
          <span className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
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
        "cursor-wait border border-black/[0.06] bg-black/[0.04] text-[#1a1e2b]/50 opacity-70 dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-[#f4ede4]/50",
      icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
      text: existFollow ? "Unfollowing..." : "Following...",
    };
  }

  if (existFollow) {
    return {
      className:
        "border border-rose-400/25 bg-rose-400/10 text-rose-600 hover:border-red-400/40 hover:bg-red-400/15 hover:text-red-600 dark:border-rose-300/20 dark:bg-rose-300/[0.08] dark:text-rose-300 dark:hover:border-red-400/30 dark:hover:bg-red-400/10 dark:hover:text-red-400",
      icon: (
        <span className="relative inline-flex h-3.5 w-3.5">
          <UserMinus className="absolute inset-0 h-3.5 w-3.5 transition-opacity group-hover:opacity-0" />
          <X className="absolute inset-0 h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
        </span>
      ),
      text: (
        <span className="relative inline-block">
          <span className="transition-opacity group-hover:opacity-0">
            Following
          </span>
          <span className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
            Unfollow
          </span>
        </span>
      ),
    };
  }

  return {
    className:
      "bg-gradient-to-r from-rose-400 via-orange-400 to-amber-300 text-[#1a1e2b] shadow-[0_4px_12px_-4px_rgba(251,113,133,0.6)] hover:-translate-y-0.5 hover:shadow-[0_6px_16px_-6px_rgba(251,146,60,0.7)] hover:brightness-105 active:translate-y-0 active:scale-95 dark:text-[#0b0a12] dark:shadow-[0_4px_12px_-4px_rgba(251,113,133,0.7)] dark:hover:shadow-[0_6px_16px_-6px_rgba(251,146,60,0.85)]",
    icon: (
      <UserPlus className="h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110" />
    ),
    text: "Follow",
  };
};

export { getButtonStyle, getIcon, getText, getButtonFollowStyles };