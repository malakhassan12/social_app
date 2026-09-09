import { NotificationType } from "@/generated/prisma/enums";
import getNotifications from "@/helper/getNotifications";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import {
  Heart,
  MessageCircle,
  UserPlus,
  Share2,
  UserCheck,
  Megaphone,
  Bell,
} from "lucide-react";

import NotificationList from "./NotificationList";

type Props = {
  searchParams: Promise<{
    page?: string;
  }>;
};

async function NotificationsContent({ searchParams }: Props) {
  const { page } = await searchParams;

  const currentPage = Math.max(1, Number(page) || 1);

  const result = await getNotifications(currentPage);

  const { notifications, total, totalPages, hasNextPage, hasPreviousPage } =
    result;


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

  const friendCount = notifications.filter(
    (n) => n.notificationType === NotificationType.FRIEND,
  ).length;

  const publishedCount = notifications.filter(
    (n) => n.notificationType === NotificationType.PUBLISHED,
  ).length;

  // Tab configuration
  const tabs = [
    {
      value: "ALL",
      icon: <Bell className="h-3.5 w-3.5 mr-1.5" />,
      label: "All",
      count: total,
      countColor: "bg-gray-200 dark:bg-gray-700",
    },
    {
      value: "LIKE",
      icon: <Heart className="h-3.5 w-3.5 mr-1.5 text-red-500" />,
      label: "Likes",
      count: likeCount,
      countColor:
        "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
    },
    {
      value: "COMMENT",
      icon: <MessageCircle className="h-3.5 w-3.5 mr-1.5 text-blue-500" />,
      label: "Comments",
      count: commentCount,
      countColor:
        "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    },
    {
      value: "FOLLOW",
      icon: <UserPlus className="h-3.5 w-3.5 mr-1.5 text-green-500" />,
      label: "Follows",
      count: followCount,
      countColor:
        "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    },
    {
      value: "SHARE",
      icon: <Share2 className="h-3.5 w-3.5 mr-1.5 text-purple-500" />,
      label: "Shares",
      count: shareCount,
      countColor:
        "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    },
    {
      value: "FRIEND",
      icon: <UserCheck className="h-3.5 w-3.5 mr-1.5 text-indigo-500" />,
      label: "Friends",
      count: friendCount,
      countColor:
        "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
    },
    {
      value: "PUBLISHED",
      icon: <Megaphone className="h-3.5 w-3.5 mr-1.5 text-orange-500" />,
      label: "Published",
      count: publishedCount,
      countColor:
        "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
    },
  ];

  return (
    <Tabs defaultValue="ALL" className="w-full">
      <ScrollArea className="w-full whitespace-nowrap rounded-xl bg-gray-100 dark:bg-gray-800/50 p-1 overflow-y-hidden">
        <TabsList className="inline-flex w-max bg-transparent p-0">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-[#1a1a2e] transition-all text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 flex items-center"
            >
              {tab.icon}
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={`ml-1.5 text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full ${tab.countColor}`}
                >
                  {tab.count}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        <ScrollBar orientation="horizontal" className="h-1.5" />
      </ScrollArea>

      <NotificationList
        notifications={notifications}
        totalPages={totalPages}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        currentPage={currentPage}
        total={total}
      />
    </Tabs>
  );
}

export default NotificationsContent;
