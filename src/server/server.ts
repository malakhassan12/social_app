import dotenv from "dotenv";

dotenv.config({
  path: ".env",
});

import { getSession } from "@/lib/temp-session-for-select-account/session";
import * as cookie from "cookie";
import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

import { setIo } from "@/lib/socket/getIo";
import { getRelevantAccountIds } from "@/helper/account/getRelevantAccountIds";
import prisma from "@/lib/prisma";
import markMessageAsRead from "@/actions/chat/markMessageAsRead";

const dev = process.env.NODE_ENV !== "production";

const hostname = "localhost";
const port = 3000;

const app = next({
  dev,
  hostname,
  port,
});

const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  setIo(io);

  io.use(async (socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie;

      if (!cookieHeader) {
        return next(new Error("Unauthorized"));
      }

      const cookies = cookie.parseCookie(cookieHeader);

      const sessionId = cookies.token;

      if (!sessionId) {
        return next(new Error("Unauthorized"));
      }

      const { accountId, deviceSessionId } = await getSession(sessionId);

      if (!accountId) {
        return next(new Error("Unauthorized"));
      }

      const account = await prisma.account.findUnique({
        where: {
          id: accountId,
        },
        select: {
          name: true,
          image: true,
        },
      });

      socket.data.accountId = accountId;

      socket.data.accountName = account?.name || "Account";

      socket.data.accountImage = account?.image || null;

      socket.data.deviceSessionId = deviceSessionId;

      next();
    } catch (error) {
      console.error("Socket authentication error:", error);

      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", async (socket) => {
    const authenticatedAccountId = socket.data.accountId;

    const deviceSessionId = socket.data.deviceSessionId;

    console.log("🔥 SOCKET CONNECTED", {
      socketId: socket.id,
      accountId: authenticatedAccountId,
      deviceSessionId,
      transport: socket.conn.transport.name,
    });

    if (deviceSessionId) {
      socket.join(`device-session:${deviceSessionId}`);
    }

    if (authenticatedAccountId) {
      // ✅ افحص الأول، قبل الـ join
      const roomBefore = io.sockets.adapter.rooms.get(
        `account:${authenticatedAccountId}`,
      );
      const wasOffline = !roomBefore || roomBefore.size === 0;

      // ✅ بعد كده اعمل join
      socket.join(`account:${authenticatedAccountId}`);

      console.log(
        `🔌 Socket ${socket.id} joined room: account:${authenticatedAccountId}`,
      );

      if (wasOffline) {
        const relevantIds = await getRelevantAccountIds(authenticatedAccountId);

        for (const relevantId of relevantIds) {
          io.to(`account:${relevantId}`).emit(
            "presence:online",
            authenticatedAccountId,
          );
        }
      }
    }

    socket.on(
      "message:read",
      async (
        { messageId }: { messageId: string },
        callback?: (response: { success: boolean; message: string }) => void,
      ) => {
        try {
          if (!messageId) {
            callback?.({ success: false, message: "Message ID is required" });
            return;
          }

          const accountId = socket.data.accountId;

          if (!accountId) {
            callback?.({ success: false, message: "Unauthorized" });
            return;
          }

          const result = await markMessageAsRead(messageId, accountId);

          if (!result.success) {
            callback?.({ success: false, message: result.message });
            return;
          }

          const { data, senderId,  } = result;

         

          io.to(`account:${senderId}`).emit("message:read", {
            messageId: data?.messageId,
            accountId: data?.accountId, // مين اللي قرا الرسالة
            readAt: data?.readAt,
          });


          callback?.({ success: true, message: "Message marked as read" });
        } catch (error) {
          console.error("message:read error:", error);
          callback?.({
            success: false,
            message: "Failed to mark message as read",
          });
        }
      },
    );

    socket.conn.on("upgrade", () => {
      console.log("⬆️ SOCKET TRANSPORT UPGRADED", {
        socketId: socket.id,
        transport: socket.conn.transport.name,
      });
    });

    socket.on("disconnect", async (reason) => {
      console.log("❌ SOCKET DISCONNECTED", {
        socketId: socket.id,
        accountId: authenticatedAccountId,
        reason,
      });

      if (!authenticatedAccountId) return;

      // ✅ لازم > 1 مش > 0 — لأن الـ socket الحالي لسه فعليًا
      // عضو في الـ room في اللحظة دي (Socket.io بتشيله بعد ما الـ handler يخلص)
      const roomAfter = io.sockets.adapter.rooms.get(
        `account:${authenticatedAccountId}`,
      );
      const stillOnline = roomAfter && roomAfter.size > 1;

      if (!stillOnline) {
        console.log(`🔴 ${authenticatedAccountId} is offline`);

        const relevantIds = await getRelevantAccountIds(authenticatedAccountId);

        for (const relevantId of relevantIds) {
          io.to(`account:${relevantId}`).emit(
            "presence:offline",
            authenticatedAccountId,
          );
        }
      }
    });

    socket.on(
      "typing:start",
      ({ conversationId }: { conversationId: string }) => {
        if (!authenticatedAccountId) return;

        // ابعت لكل الموجودين في المحادثة (غير المرسل نفسه)
        socket.to(`conversation:${conversationId}`).emit("typing:start", {
          accountId: socket.data.accountId,
          accountName: socket.data.accountName,
          accountImage: socket.data.accountImage,
          conversationId,
        });
      },
    );

    socket.on(
      "typing:stop",
      ({ conversationId }: { conversationId: string }) => {
        if (!authenticatedAccountId) return;

        socket.to(`conversation:${conversationId}`).emit("typing:stop", {
          accountId: socket.data.accountId,

          conversationId,
        });
      },
    );

    socket.on(
      "conversation:join",
      ({ conversationId }: { conversationId: string }) => {
        socket.join(`conversation:${conversationId}`);
      },
    );

    socket.on(
      "conversation:leave",
      ({ conversationId }: { conversationId: string }) => {
        socket.leave(`conversation:${conversationId}`);
      },
    );
  });

  // ========================================
  // HTTP Server
  // ========================================

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
