import ProfileAvatar from "@/components/Avatar/ProfileAvatar";
import {
  getNotificationColor,
  getNotificationIcon,
  
} from "@/utils/notificationsThemes";
import DeleteNotificationBtn from "./DeleteNotificationBtn";
import { getTime } from "@/utils/getTime";
import { Notification } from "@/types/notification.Types";
import { FC } from "react";
import Link from "next/link";

type Props = {
  notification: Notification;
  onDelete: (notificationId: string) => void;
};

const NotificationItem: FC<Props> = ({ notification, onDelete }) => {
  const isUnread = !notification.read;

  return (
    <div
      className={`
        flex items-start gap-3 px-4 py-3 transition-all duration-200 
        hover:bg-gray-50 dark:hover:bg-gray-800/30 group
        ${isUnread ? "bg-blue-50/30 dark:bg-blue-900/5" : ""}
        border-b border-gray-100 dark:border-gray-800
        last:border-0
      `}
    >
      {/* Icon */}
      <div className="relative shrink-0">
        <div
          className={`
            h-10 w-10 rounded-full flex items-center justify-center 
            ${getNotificationColor(notification.notificationType)}
            transition-transform duration-200 group-hover:scale-105
          `}
        >
          {getNotificationIcon(notification.notificationType)}
        </div>
        {isUnread && (
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white dark:border-gray-900" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <ProfileAvatar
            name={notification?.creator?.name}
            image={notification?.creator?.image}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
              <Link
                href={`/profile/${notification?.creator?.id as string }`}
                className="font-semibold hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                {notification?.creator?.name}
              </Link>
              <span className="text-gray-600 dark:text-gray-400">
                {" "}
                {notification.content}
              </span>
            </p>

            {/* Timestamp and Type */}
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {getTime({ time: notification.createdAt })}
              </span>
              <span className="text-xs text-gray-300 dark:text-gray-600">•</span>
              <span
                className={`
                  text-[10px] font-medium px-2 py-0.5 rounded-full 
                  ${getNotificationColor(notification.notificationType)}
                `}
              >
                {notification.notificationType}
              </span>
              {isUnread && (
                <span className="text-[10px] font-medium text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">
                  New
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0 self-start mt-1">
        <DeleteNotificationBtn
          notificationId={notification.id}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};

export default NotificationItem;