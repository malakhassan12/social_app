"use server";

import prisma from "@/lib/prisma";

import { cookies } from "next/headers";

import {
  getSession,
} from "@/lib/temp-session-for-select-account/session";

const getDeviceSessions = async () => {
  const cookieStore = await cookies();

  const currentToken =
    cookieStore.get("token")?.value;

  if (!currentToken) {
    return [];
  }

  const currentSession =
    await getSession(currentToken);

  if (
    !currentSession?.userId ||
    !currentSession?.deviceSessionId
  ) {
    return [];
  }

  const sessions =
    await prisma.session.findMany({
      where: {
        userId: currentSession.userId,

        revokedAt: null,

        expiresAt: {
          gt: new Date(),
        },
      },

      include: {
        account: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },

      orderBy: {
        lastActiveAt: "desc",
      },
    });

  return sessions.map((session) => ({
    id: session.id,

    accountId: session.accountId,

    accountName:
      session.account.name,

    username:
      session.account.username,

    userAgent:
      session.userAgent,

    ipAddress:
      session.ipAddress,

    createdAt:
      session.createdAt,

    lastActiveAt:
      session.lastActiveAt,

    /*
     * THIS is the important part
     */
    current:
      session.id ===
      currentSession.deviceSessionId,
  }));
};

export default getDeviceSessions;