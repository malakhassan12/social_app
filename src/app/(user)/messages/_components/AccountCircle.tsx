"use client";

import { FC } from "react";
import ProfileAvatar from "@/components/Avatar/ProfileAvatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChatParticipant } from "@/helper/chat/getChats";
import AccountOnlineStatus from "./AccountOnlineStatus";

const AccountCircle: FC<{
  account: ChatParticipant;
  conversationId: string | undefined | null;
  unreadCount?: number;
  initialOnline: boolean;
}> = ({ account, conversationId, unreadCount = 0, initialOnline }) => {
  const pathname = usePathname();
  const currentConversationId = pathname?.split("/")[2] || null;
  const isSelected = !!conversationId && currentConversationId === conversationId;

  const href = conversationId
    ? `/messages/${conversationId}?accountId=${account.id}`
    : `/messages/${undefined}?accountId=${account.id}`;

  return (
    <Link
      href={href}
      aria-current={isSelected ? "page" : undefined}
      className={`
        group relative flex flex-col items-center gap-1.5
        p-2 rounded-xl
        min-w-16 sm:min-w-18
        transition-colors duration-200
        ${
          isSelected
            ? "bg-purple-50 dark:bg-purple-950/40"
            : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
        }
      `}
    >
      <div className="relative">
        {/* Avatar with ring when selected */}
        <div
          className={`
            rounded-full p-0.5
            ${isSelected ? "ring-2 ring-purple-500" : ""}
          `}
        >
          <ProfileAvatar
            image={account.image}
            name={account.username || "Group"}
          />
        </div>

        {/* Online indicator */}
        <AccountOnlineStatus
          accountId={account.id}
          initialOnline={initialOnline}
        />

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span
            className="
              absolute -top-1 -right-1
              h-5 min-w-5 px-1
              rounded-full
              bg-purple-500 text-white
              text-[10px] font-bold
              flex items-center justify-center
              ring-2 ring-white dark:ring-gray-900
            "
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </div>

      {/* Username */}
      <span
        className={`
          text-xs truncate max-w-16 sm:max-w-18
          ${
            isSelected
              ? "font-semibold text-purple-600 dark:text-purple-400"
              : "font-medium text-gray-600 dark:text-gray-400"
          }
        `}
      >
        {account.username || "Group"}
      </span>
    </Link>
  );
};

export default AccountCircle;