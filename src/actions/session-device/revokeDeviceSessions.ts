"use server";

import prisma from "@/lib/prisma";

import { cookies } from "next/headers";

import {
  deleteSession,
  getSession,
} from "@/lib/temp-session-for-select-account/session";

import redis from "@/lib/redis";

import { getIo } from "@/lib/socket/getIo";

const revokeAllDeviceSessions = async () => {
  try {
    // =====================================================
    // Current token
    // =====================================================

    const cookieStore = await cookies();

    const currentToken =
      cookieStore.get("token")?.value;

    if (!currentToken) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    // =====================================================
    // Current Redis session
    // =====================================================

    const currentSession =
      await getSession(currentToken);

    if (
      !currentSession?.userId ||
      !currentSession?.deviceSessionId
    ) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    // =====================================================
    // Get all OTHER active sessions
    // =====================================================

    const sessions =
      await prisma.session.findMany({
        where: {
          userId:
            currentSession.userId,

          // IMPORTANT:
          // Do NOT revoke current device session
          id: {
            not:
              currentSession.deviceSessionId,
          },

          revokedAt: null,

          expiresAt: {
            gt: new Date(),
          },
        },

        select: {
          id: true,
        },
      });

    if (sessions.length === 0) {
      return {
        success: true,
        message:
          "No other active sessions found",
      };
    }

    // =====================================================
    // Revoke all OTHER sessions in DB
    // =====================================================

    await prisma.session.updateMany({
      where: {
        id: {
          in: sessions.map(
            (session) => session.id,
          ),
        },
      },

      data: {
        revokedAt: new Date(),
      },
    });

    // =====================================================
    // Get Socket.IO instance
    // =====================================================

    const io = getIo();

    // =====================================================
    // Revoke Redis sessions + realtime logout
    // =====================================================

    await Promise.all(
      sessions.map(async (session) => {
        const room =
          `device-session:${session.id}`;

        // =================================================
        // Get Redis auth token
        // =================================================

        const token =
          await redis.get<string>(
            `device-session:${session.id}`,
          );

        // =================================================
        // Invalidate Redis authentication
        // =================================================

        if (token) {
          await deleteSession(token);
        }

        // =================================================
        // Remove reverse mapping
        // =================================================

        await redis.del(
          `device-session:${session.id}`,
        );

        // =================================================
        // Realtime logout
        // =================================================

        io.to(room).emit(
          "session:revoked",
        );

        // =================================================
        // Disconnect target socket(s)
        // =================================================

        const sockets =
          await io
            .in(room)
            .fetchSockets();

        for (
          const socket of sockets
        ) {
          socket.disconnect(true);
        }
      }),
    );

    // =====================================================
    // Result
    // =====================================================

    return {
      success: true,
      message:
        "All other sessions have been revoked",
    };
  } catch (error) {
    console.error(
      "revokeAllDeviceSessions error:",
      error,
    );

    return {
      success: false,
      message:
        "Failed to revoke sessions",
    };
  }
};

export default revokeAllDeviceSessions;