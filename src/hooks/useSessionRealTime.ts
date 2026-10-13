"use client";

import { useEffect } from "react";

import { authLogout } from "@/actions/auth/authLogout";

const SessionRealtime = () => {
  useEffect(() => {
    let cancelled = false;
    let cleanupSocket: (() => void) | undefined;

    const initializeSocket = () => {
      void import("@/lib/socket/socket")
        .then(({ getSocket }) => {
          if (cancelled) return;

          const socket = getSocket();
          const handleSessionRevoked = async () => {
            socket.disconnect();
            await authLogout();
          };

          socket.on("session:revoked", handleSessionRevoked);

          if (!socket.connected) {
            socket.connect();
          }

          cleanupSocket = () => {
            socket.off("session:revoked", handleSessionRevoked);
          };
        })
        .catch((error: unknown) => {
          console.error("Failed to initialize session realtime:", error);
        });
    };

    const timeoutId = window.setTimeout(initializeSocket, 1500);

    return () => {
      cancelled = true;
      cleanupSocket?.();
      window.clearTimeout(timeoutId);
    };
  }, []);

  return null;
};

export default SessionRealtime;