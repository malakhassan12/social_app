// lib/socket-client.ts
"use client";

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getPostSocket() {
  if (!socket) {
    socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/post`, {
      withCredentials: true, // عشان يبعت الكوكيز
      transports: ["websocket"],
    });
  }
  return socket;
}