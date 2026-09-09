import { NotificationType } from "@/generated/prisma/enums";
import { 
  Heart, 
  MessageCircle, 
  UserPlus, 
  Bell, 
  Share2, 
  UserCheck, 
  Megaphone 
} from "lucide-react";

const getNotificationIcon = (type: NotificationType | string) => {
  switch (type) {
    case "LIKE":
      return <Heart className="h-4 w-4 text-red-500" />;
    case "COMMENT":
      return <MessageCircle className="h-4 w-4 text-blue-500" />;
    case "FOLLOW":
      return <UserPlus className="h-4 w-4 text-green-500" />;
    case "SHARE":
      return <Share2 className="h-4 w-4 text-purple-500" />;
    case "FRIEND":
      return <UserCheck className="h-4 w-4 text-indigo-500" />;
    case "PUBLISHED":
      return <Megaphone className="h-4 w-4 text-orange-500" />;
    default:
      return <Bell className="h-4 w-4 text-gray-500" />;
  }
};

const getNotificationColor = (type: NotificationType | string) => {
  switch (type) {
    case "LIKE":
      return "bg-red-50 dark:bg-red-900/20 text-red-500";
    case "COMMENT":
      return "bg-blue-50 dark:bg-blue-900/20 text-blue-500";
    case "FOLLOW":
      return "bg-green-50 dark:bg-green-900/20 text-green-500";
    case "SHARE":
      return "bg-purple-50 dark:bg-purple-900/20 text-purple-500";
    case "FRIEND":
      return "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500";
    case "PUBLISHED":
      return "bg-orange-50 dark:bg-orange-900/20 text-orange-500";
    default:
      return "bg-gray-50 dark:bg-gray-800/50 text-gray-500";
  }
};

const getNotificationLabel = (type: NotificationType | string) => {
  switch (type) {
    case "LIKE":
      return "Liked your post";
    case "COMMENT":
      return "Commented on your post";
    case "FOLLOW":
      return "Started following you";
    case "SHARE":
      return "Shared your post";
    case "FRIEND":
      return "Accepted your friend request";
    case "PUBLISHED":
      return "Published a new post";
    default:
      return "Notification";
  }
};

const getNotificationBg = (type: NotificationType | string) => {
  switch (type) {
    case "LIKE":
      return "hover:bg-red-50/50 dark:hover:bg-red-900/10";
    case "COMMENT":
      return "hover:bg-blue-50/50 dark:hover:bg-blue-900/10";
    case "FOLLOW":
      return "hover:bg-green-50/50 dark:hover:bg-green-900/10";
    case "SHARE":
      return "hover:bg-purple-50/50 dark:hover:bg-purple-900/10";
    case "FRIEND":
      return "hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10";
    case "PUBLISHED":
      return "hover:bg-orange-50/50 dark:hover:bg-orange-900/10";
    default:
      return "hover:bg-gray-50/50 dark:hover:bg-gray-800/30";
  }
};

export { 
  getNotificationIcon, 
  getNotificationColor, 
  getNotificationLabel,
  getNotificationBg 
};