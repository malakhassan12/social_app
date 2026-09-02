import { NotificationType } from "@/generated/prisma/enums";
import getNotifications from "@/helper/getNotifications";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Heart, MessageCircle, UserPlus,  Share2 } from "lucide-react";
import NotificationList from "./NotificationList";

async function NotificationsContent() {
  const notifications = await getNotifications();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const likeCount = notifications.filter(
    (n) => n.notificationType === NotificationType.LIKE,
  ).length;

  const commentCount = notifications.filter(
    (n) => n.notificationType === NotificationType.COMMENT,
  ).length;

  const followCount = notifications.filter(
    (n) => n.notificationType === NotificationType.FOLLOW,
  ).length;

  const shareCount = notifications.filter(
    (n) => n.notificationType === NotificationType.SHARE,
  ).length;

  return (
    <>
      {/* Tabs with ScrollArea */}
      <Tabs defaultValue="ALL" className="w-full">
        <ScrollArea className="w-full whitespace-nowrap flex justify-between rounded-xl bg-gray-100 dark:bg-gray-800/50 p-1">
          <TabsList className="inline-flex w-max bg-transparent p-0">
            <TabsTrigger
              value="ALL"
              className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-[#1a1a2e] transition-all text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
            >
              All
              <span className="ml-1.5 text-[10px] sm:text-xs bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">
                {notifications.length}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="LIKE"
              className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-[#1a1a2e] transition-all text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
            >
              <Heart className="h-3.5 w-3.5 mr-1.5 text-red-500" />
              Likes
              {likeCount > 0 && (
                <span className="ml-1 text-[10px] sm:text-xs text-gray-400">
                  {likeCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="COMMENT"
              className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-[#1a1a2e] transition-all text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
            >
              <MessageCircle className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
              Comments
              {commentCount > 0 && (
                <span className="ml-1 text-[10px] sm:text-xs text-gray-400">
                  {commentCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="FOLLOW"
              className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-[#1a1a2e] transition-all text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
            >
              <UserPlus className="h-3.5 w-3.5 mr-1.5 text-green-500" />
              Follows
              {followCount > 0 && (
                <span className="ml-1 text-[10px] sm:text-xs text-gray-400">
                  {followCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="SHARE"
              className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-[#1a1a2e] transition-all text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
            >
              <Share2 className="h-3.5 w-3.5 mr-1.5 text-purple-500" />
              Share
              {shareCount > 0 && (
                <span className="ml-1 text-[10px] sm:text-xs text-gray-400">
                  {shareCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" className="h-1.5" />
        </ScrollArea>

        <NotificationList
          notifications={notifications}
          unreadCount={unreadCount}
          likeCount={likeCount}
          commentCount={commentCount}
          followCount={followCount}
          shareCount={shareCount}
        />
      </Tabs>
    </>
  );
}

export default NotificationsContent;
