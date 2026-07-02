import ProfileAvatar from "@/components/Avatar/ProfileAvatar";
import {
  getNotificationColor,
  getNotificationIcon,
} from "@/utils/notificationsThemes";
import DeleteNotificationBtn from "./DeleteNotificationBtn";
import { getTime } from "@/utils/getTime";
import { Notification } from "@/types/notification.Types";
import { getUserId } from "@/helper/getUserId";

const NotificationItem = async ({
  notification,
}: {
  notification: Notification;
}) => {
  const userId = await getUserId();
  return (
    <div
      className={`flex items-start gap-3 p-4 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/30 group ${
        !notification.read ? "bg-blue-50/50 dark:bg-blue-900/10  " : ""
      }`}
    >
      {/* Icon */}
      <div
        className={`shrink-0 h-9 w-9 rounded-full flex items-center justify-center ${getNotificationColor(notification.notificationType)}`}
      >
        {getNotificationIcon(notification.notificationType)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <ProfileAvatar
              name={notification?.creator?.name}
              image={notification?.creator?.image}
            />
            <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
              <span className="font-semibold">
                {userId === notification?.creatorId
                  ? "You are "
                  : notification?.creator?.name}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {" "}
                {notification.content}
              </span>
            </p>
          </div>
        </div>

        {/* Timestamp and Type */}
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {getTime({ time: notification.createdAt })}
          </span>
          <span className="text-xs text-gray-300 dark:text-gray-600">•</span>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${getNotificationColor(notification.notificationType)}`}
          >
            {notification.notificationType}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <DeleteNotificationBtn notificationId={notification.id} />
      </div>
    </div>
  );
};

export default NotificationItem;
