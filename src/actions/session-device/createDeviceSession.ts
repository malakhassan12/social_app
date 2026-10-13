"use server";

import prisma from "@/lib/prisma";

import { headers } from "next/headers";

const createDeviceSession = async (
  userId: string,
  accountId: string,
) => {
  const headersList = await headers();

  const userAgent =
    headersList.get("user-agent");

  const ipAddress =
    headersList
      .get("x-forwarded-for")
      ?.split(",")[0]
      ?.trim() ||
    headersList.get("x-real-ip");

  const session =
    await prisma.session.create({
      data: {
        userId,
        accountId,
        userAgent,
        ipAddress,
        expiresAt: new Date(
          Date.now() +
            60 * 60 * 24 * 7 * 1000,
        ),
      },
    });

  return session.id;
};

export default createDeviceSession;