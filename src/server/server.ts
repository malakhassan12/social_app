import dotenv from "dotenv";

dotenv.config({
  path: ".env",
});

import { getSession } from "@/lib/session";
import * as cookie from "cookie";
import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

import { setIo } from "@/lib/socket/getIo";

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
  // ========================================
  // Global Socket.IO Authentication
  // ========================================

  // io.use(async (socket, next) => {
  //   try {
  //     // 1. Get Cookie header
  //     const cookieHeader = socket.handshake.headers.cookie;

  //     if (!cookieHeader) {
  //       return next(new Error("Unauthorized"));
  //     }

  //     // 2. Parse cookies
  //     const cookies = cookie.parseCookie(cookieHeader);

  //     // 3. Get session ID
  //     const sessionId = cookies.token;

  //     if (!sessionId) {
  //       return next(new Error("Unauthorized"));
  //     }

  //     // 4. Validate session
  //     const { accountId } = await getSession(sessionId);

  //     if (!accountId) {
  //       return next(new Error("Unauthorized"));
  //     }

  //     // 5. Store authenticated user
  //     socket.data.accountId = accountId;

  //     // 6. Continue connection
  //     next();
  //   } catch (error) {
  //     console.error("Socket authentication error:", error);

  //     next(new Error("Unauthorized"));
  //   }
  // });

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

      const { accountId } = await getSession(sessionId);

      if (!accountId) {
        return next(new Error("Unauthorized"));
      }

      socket.data.accountId = accountId;
      next();
    } catch (error) {
      console.error("Socket authentication error:", error);
      // منع الـ client من محاولة إعادة الاتصال فورًا بشكل جامح
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const authenticatedAccountId = socket.data.accountId; // 👈 Extract verified ID

    console.log("🔥 SOCKET CONNECTED", {
      socketId: socket.id,
      accountId: authenticatedAccountId,
      transport: socket.conn.transport.name,
    });

    // 👈 ADD THIS LINE HERE: Auto-join the private room globally!
    if (authenticatedAccountId) {
      socket.join(`account:${authenticatedAccountId}`);
      console.log(
        `🔌 Socket ${socket.id} joined room: account:${authenticatedAccountId}`,
      );
    }

    socket.conn.on("upgrade", () => {
      console.log("⬆️ SOCKET TRANSPORT UPGRADED", {
        socketId: socket.id,
        transport: socket.conn.transport.name,
      });
    });

    socket.on("disconnect", (reason, details) => {
      console.log("❌ SOCKET DISCONNECTED", {
        socketId: socket.id,
        accountId: socket.data.accountId,
        reason,
        details,
      });
    });
  });

  // ========================================
  // Namespaces
  // ========================================

  // const postIo = io.of("/post");
  // const notiIo = io.of("/noti");

  // ========================================
  // Register namespace instances
  // ========================================

  // setPostIo(postIo);
  // setNotificaionIo(notiIo);

  // ========================================
  // Post namespace
  // ========================================

  // postIo.on("connection", (socket) => {
  //   const accountId = socket.data.accountId;

  //   console.log(
  //     `Post socket connected: ${socket.id}, account: ${accountId}`,
  //   );

  //   socket.join(`account:${accountId}`);

  //   socket.on("disconnect", (reason) => {
  //     console.log(
  //       `Post socket disconnected: ${accountId}`,
  //       reason,
  //     );
  //   });
  // });

  // ========================================
  // Notification namespace
  // ========================================

  // notiIo.on("connection", (socket) => {
  //   const accountId = socket.data.accountId;

  //   console.log(
  //     `Notification socket connected: ${socket.id}, account: ${accountId}`,
  //   );

  //   socket.join(`account:${accountId}`);

  //   socket.on("disconnect", (reason) => {
  //     console.log(
  //       `Notification socket disconnected: ${accountId}`,
  //       reason,
  //     );
  //   });
  // });

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
