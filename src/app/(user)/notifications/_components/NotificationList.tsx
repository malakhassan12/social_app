"use client";

import NotificationItem from "./NotificationItem";
import EmptyState from "./EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Heart, MessageCircle, UserPlus, Bell, Share2 } from "lucide-react";
import { NotificationType } from "@/generated/prisma/enums";
import { FC, startTransition, useEffect, useOptimistic } from "react";
import { Notification } from "@/types/notification.Types";
import { deleteNoti } from "@/actions/notification/deleteNotification";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { socket } from "@/lib/socket/socket";

type NotiListProps = {
  notifications: Notification[];
  unreadCount: number;

  likeCount: number;
  commentCount: number;

  followCount: number;

  shareCount: number;
};

const NotificationList: FC<NotiListProps> = ({
  notifications,
  //   unreadCount,
  likeCount,
  commentCount,
  followCount,
  shareCount,
}) => {
  //

  const router = useRouter();

  useEffect(() => {
    const handlePostCreated = () => {
      router.refresh();
    };

    socket.on("publish:notification", handlePostCreated);

    return () => {
      socket.off("publish:notification", handlePostCreated);
    };
  }, [router]);

  const [optimisticNotifications, removeOptimisticNotification] = useOptimistic(
    notifications,
    (notifications, deletedId: string) => {
      return notifications.filter(
        (notification) => notification.id !== deletedId,
      );
    },
  );

  const handleDelete = (notificationId: string) => {
    startTransition(async () => {
      // 1️⃣ UI immediately removes notification
      removeOptimisticNotification(notificationId);

      // 2️⃣ Call server action
      const result = await deleteNoti(notificationId);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success("Notification deleted");
    });
  };
  return (
    <>
      <TabsContent value="ALL" className="mt-3 sm:mt-4 space-y-2">
        <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
          <CardContent className="p-0 divide-y divide-gray-100 dark:divide-gray-800">
            {optimisticNotifications.length === 0 ? (
              <EmptyState
                icon={<Bell className="h-8 w-8 text-gray-400" />}
                message="No notifications yet"
              />
            ) : (
              optimisticNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onDelete={handleDelete}
                ></NotificationItem>
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
              optimisticNotifications
                .filter((n) => n.notificationType === NotificationType.LIKE)
                .map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onDelete={handleDelete}
                  ></NotificationItem>
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
              optimisticNotifications
                .filter((n) => n.notificationType === NotificationType.COMMENT)
                .map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onDelete={handleDelete}
                  ></NotificationItem>
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
              optimisticNotifications
                .filter((n) => n.notificationType === NotificationType.FOLLOW)
                .map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onDelete={handleDelete}
                  ></NotificationItem>
                ))
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="SHARE" className="mt-3 sm:mt-4 space-y-2">
        <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
          <CardContent className="p-0 divide-y divide-gray-100 dark:divide-gray-800">
            {shareCount === 0 ? (
              <EmptyState
                icon={<Share2 className="h-8 w-8 text-gray-400" />}
                message="No Shared notifications"
              />
            ) : (
              optimisticNotifications
                .filter((n) => n.notificationType === NotificationType.SHARE)
                .map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onDelete={handleDelete}
                  ></NotificationItem>
                ))
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </>
  );
};

export default NotificationList;
