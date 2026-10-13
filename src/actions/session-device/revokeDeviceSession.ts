"use server";

import prisma from "@/lib/prisma";

import { cookies } from "next/headers";

import {
  getSession,
  deleteSession,
} from "@/lib/temp-session-for-select-account/session";

import redis from "@/lib/redis";

import { getIo } from "@/lib/socket/getIo";

const revokeDeviceSession = async (sessionId: string) => {
  /*
   * =====================================
   * 1. Get current token
   * =====================================
   */

  const cookieStore = await cookies();

  const currentToken = cookieStore.get("token")?.value;

  if (!currentToken) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  /*
   * =====================================
   * 2. Get current REAL session
   * =====================================
   */

  const currentSession = await getSession(currentToken);

  /*
   * =====================================
   * 3. Prevent revoking current device
   * =====================================
   */

  if (sessionId === currentSession.deviceSessionId) {
    return {
      success: false,
      message: "You cannot revoke the current session",
    };
  }

  /*
   * =====================================
   * 4. Find target Prisma session
   * =====================================
   */

  const targetSession = await prisma.session.findFirst({
    where: {
      id: sessionId,

      userId: currentSession.userId,

      revokedAt: null,

      expiresAt: {
        gt: new Date(),
      },
    },

    select: {
      id: true,
    },
  });

  if (!targetSession) {
    return {
      success: false,
      message: "Session not found",
    };
  }

  /*
   * =====================================
   * 5. Find Redis auth token
   * =====================================
   *
   * session.id
   * ↓
   * device-session:<session.id>
   * ↓
   * real auth token
   */

  const targetToken = await redis.get<string>(
    `device-session:${targetSession.id}`,
  );

  /*
   * =====================================
   * 6. Revoke DB session
   * =====================================
   */

  await prisma.session.update({
    where: {
      id: targetSession.id,
    },

    data: {
      revokedAt: new Date(),
    },
  });

  /*
   * =====================================
   * 7. Delete Redis auth token
   * =====================================
   */

  if (targetToken) {
    await deleteSession(targetToken);
  }

  /*
   * =====================================
   * 8. Remove reverse mapping
   * =====================================
   */

  await redis.del(`device-session:${targetSession.id}`);

  console.log("1️⃣ revokeDeviceSession START");

  const io = getIo();

  console.log("2️⃣ getIo SUCCESS");

  const room = `device-session:${targetSession.id}`;

  console.log("3️⃣ ROOM:", room);

  io.to(room).emit("session:revoked");

  console.log("4️⃣ EVENT SENT");

  /*
   * =====================================
   * DONE
   * =====================================
   */

  return {
    success: true,
    message: "Session revoked successfully",
  };
};

export default revokeDeviceSession;
