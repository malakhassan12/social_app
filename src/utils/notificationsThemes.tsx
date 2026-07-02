import { NotificationType } from "@/generated/prisma/enums";
import { Heart, MessageCircle, UserPlus, Bell, Sparkles } from "lucide-react";

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "LIKE":
      return <Heart className="h-4 w-4 text-red-500" />;
    case "COMMENT":
      return <MessageCircle className="h-4 w-4 text-blue-500" />;
    case "FOLLOW":
      return <UserPlus className="h-4 w-4 text-green-500" />;
    case "PUBLISHED":
      return <Sparkles className="h-4 w-4 text-purple-500" />;
    default:
      return <Bell className="h-4 w-4 text-gray-500" />;
  }
};

const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case "LIKE":
      return "bg-red-50 dark:bg-red-900/20 text-red-500";
    case "COMMENT":
      return "bg-blue-50 dark:bg-blue-900/20 text-blue-500";
    case "FOLLOW":
      return "bg-green-50 dark:bg-green-900/20 text-green-500";
    case "PUBLISHED":
      return "bg-purple-50 dark:bg-purple-900/20 text-purple-500";
    default:
      return "bg-gray-50 dark:bg-gray-800/50 text-gray-500";
  }
};

export { getNotificationIcon, getNotificationColor };
