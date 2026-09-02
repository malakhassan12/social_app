import type { Server } from "socket.io";

declare global {
  var __io: Server | undefined;
}

export function setIo(io: Server) {
  globalThis.__io = io;
}

export function getIo() {
  const io = globalThis.__io;

  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }

  return io;
}