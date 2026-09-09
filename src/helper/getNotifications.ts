import prisma from "@/lib/prisma";
import { getAccountId } from "./getAccountId";
import { Notification } from "@/types/notification.Types";

type PaginatedNotifications = {
  notifications: Notification[];
  currentPage: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

const getNotifications = async (
  pageInput: number | string = 1,
): Promise<PaginatedNotifications> => {
  const accountId = (await getAccountId()) as string;

  const page = Math.max(1, Number(pageInput) || 1);
  const limit = 8;
  const offset = (page - 1) * limit;

  const where = {
    receiverId: accountId,
  };

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where,

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

      skip: offset,
      take: limit,
    }),

    prisma.notification.count({
      where,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    notifications: notifications as Notification[],
    currentPage: page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};

export default getNotifications;

