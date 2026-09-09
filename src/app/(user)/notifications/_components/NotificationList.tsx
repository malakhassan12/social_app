"use client";

import NotificationItem from "./NotificationItem";
import EmptyState from "./EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NotificationType } from "@/generated/prisma/enums";
import { FC, startTransition, useOptimistic, useEffect } from "react";
import { Notification } from "@/types/notification.Types";
import { deleteNoti } from "@/actions/notification/deleteNotification";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { getSocket } from "@/lib/socket/socket";
import { Button } from "@/components/ui/button";
import { getNotificationIcon } from "@/utils/notificationsThemes";

type NotiListProps = {
  notifications: Notification[];
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
};

const NotificationList: FC<NotiListProps> = ({
  notifications,
  total,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  currentPage,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemsPerPage = 8;

  // Socket
  useEffect(() => {
    const socket = getSocket();
    socket.connect();

    const handleNotificationCreated = () => {
      router.refresh();
    };

    socket.on("publish:notification", handleNotificationCreated);

    return () => {
      socket.off("publish:notification", handleNotificationCreated);
    };
  }, [router]);

  // Optimistic Delete
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
      removeOptimisticNotification(notificationId);
      const result = await deleteNoti(notificationId);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success("Notification deleted");
    });
  };

  // Pagination
  const goToPage = (pageNumber: number) => {
    if (
      pageNumber < 1 ||
      pageNumber > totalPages ||
      pageNumber === currentPage
    ) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    router.push(`/notifications?${params.toString()}`);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, total);

    return (
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-800">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {startItem}
          </span>
          {" - "}
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {endItem}
          </span>
          {" of "}
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {total}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={!hasPreviousPage}
            className="h-8 px-3 rounded-md text-sm"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <span className="text-sm text-gray-500 dark:text-gray-400 px-2">
            {currentPage} / {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={!hasNextPage}
            className="h-8 px-3 rounded-md text-sm"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    );
  };

  const renderNotifications = (
    filteredNotifications: Notification[],
    tab: {
      value: string;
      type?: NotificationType | string;
    },
    showPagination = true,
  ) => {
    if (filteredNotifications.length === 0) {
      return (
        <div className="py-12">
          <EmptyState
            icon={getNotificationIcon(tab.type as string)}
            message={`No ${tab.value.toLowerCase()} notifications`}
          />
        </div>
      );
    }

    return (
      <>
        <div className="divide-y divide-gray-100 dark:divide-gray-800 grid grid-cols-1 gap-3">
          {filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onDelete={handleDelete}
            />
          ))}
        </div>
        {showPagination && renderPagination()}
      </>
    );
  };

  const tabs = [
    { value: "ALL", type: "ALL" },
    { value: "LIKE", type: NotificationType.LIKE },
    { value: "COMMENT", type: NotificationType.COMMENT },
    { value: "FOLLOW", type: NotificationType.FOLLOW },
    { value: "SHARE", type: NotificationType.SHARE },
    { value: "FRIEND", type: NotificationType.FRIEND },
    { value: "PUBLISHED", type: NotificationType.PUBLISHED },
  ];

  return (
    <>
      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className="mt-3 sm:mt-4 space-y-2"
        >
          <Card className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
            <CardContent className="p-0">
              {renderNotifications(
                tab.value === "ALL"
                  ? optimisticNotifications
                  : optimisticNotifications.filter(
                      (notification) =>
                        notification.notificationType === tab.type,
                    ),
                tab,
                tab.value === "ALL",
              )}
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </>
  );
};

export default NotificationList;
