import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Heart,
  MessageCircle,
  UserPlus,
  Sparkles,
  Bell,
} from "lucide-react";
import NotificationItem from "./_components/NotificationItem";
import EmptyState from "./_components/EmptyState";
import prisma from "@/lib/prisma";
import { getUserId } from "@/helper/getUserId";
import { NotificationType } from "@/generated/prisma/enums";
import { Notification } from "@/types/notification.Types";


import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications page",
};


const Page = async () => {
  const userId = (await getUserId()) as string;

  const notifications: Notification[] = await prisma.notification.findMany({
    where: {
      userId: userId,
    },
    include: {
      user: {
        select: {
          name: true,
          id: true,
          image: true,
        },
      },
      creator: {
        select: {
          name: true,
          id: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

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
  const publishedCount = notifications.filter(
    (n) => n.notificationType === NotificationType.PUBLISHED,
  ).length;

  return (
    <div className="max-w-3xl mx-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Notifications
          </h1>
          
        </div>
       
      </div>

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
              value="PUBLISHED"
              className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-[#1a1a2e] transition-all text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5 text-purple-500" />
              Published
              {publishedCount > 0 && (
                <span className="ml-1 text-[10px] sm:text-xs text-gray-400">
                  {publishedCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" className="h-1.5" />
        </ScrollArea>

        <TabsContent value="ALL" className="mt-3 sm:mt-4 space-y-2">
          <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-0 divide-y divide-gray-100 dark:divide-gray-800">
              {notifications.length === 0 ? (
                <EmptyState
                  icon={<Bell className="h-8 w-8 text-gray-400" />}
                  message="No notifications yet"
                />
              ) : (
                notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="LIKE" className="mt-3 sm:mt-4 space-y-2">
          <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-0 divide-y divide-gray-100 dark:divide-gray-800">
              {likeCount === 0 ? (
                <EmptyState
                  icon={<Heart className="h-8 w-8 text-gray-400" />}
                  message="No like notifications"
                />
              ) : (
                notifications
                  .filter((n) => n.notificationType === NotificationType.LIKE)
                  .map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                    />
                  ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="COMMENT" className="mt-3 sm:mt-4 space-y-2">
          <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-0 divide-y divide-gray-100 dark:divide-gray-800">
              {commentCount === 0 ? (
                <EmptyState
                  icon={<MessageCircle className="h-8 w-8 text-gray-400" />}
                  message="No comment notifications"
                />
              ) : (
                notifications
                  .filter(
                    (n) => n.notificationType === NotificationType.COMMENT,
                  )
                  .map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                    />
                  ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="FOLLOW" className="mt-3 sm:mt-4 space-y-2">
          <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-0 divide-y divide-gray-100 dark:divide-gray-800">
              {followCount === 0 ? (
                <EmptyState
                  icon={<UserPlus className="h-8 w-8 text-gray-400" />}
                  message="No follow notifications"
                />
              ) : (
                notifications
                  .filter((n) => n.notificationType === NotificationType.FOLLOW)
                  .map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                    />
                  ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="PUBLISHED" className="mt-3 sm:mt-4 space-y-2">
          <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-0 divide-y divide-gray-100 dark:divide-gray-800">
              {publishedCount === 0 ? (
                <EmptyState
                  icon={<Sparkles className="h-8 w-8 text-gray-400" />}
                  message="No published notifications"
                />
              ) : (
                notifications
                  .filter(
                    (n) => n.notificationType === NotificationType.PUBLISHED,
                  )
                  .map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                    />
                  ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
