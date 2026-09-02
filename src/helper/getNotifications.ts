import prisma from "@/lib/prisma";
import { getAccountId } from "./getAccountId";
import { Notification } from "@/types/notification.Types";

const getNotifications = async () => {
  const accountId = (await getAccountId()) as string;

  const notifications: Notification[] = await prisma.notification.findMany({
    where: {
      receiverId: accountId,
    },
    include: {
      receiver: {
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

  return notifications
};

export default getNotifications;
