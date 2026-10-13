"use client";

// import { io } from "socket.io-client";

// export const socket = io({
//   reconnectionAttempts: 5,
//   reconnectionDelay: 3000, // استنى 3 ثواني بين كل محاولة
//   reconnectionDelayMax: 15000, // أقصى تأخير 15 ثانية
//   randomizationFactor: 0.5,
// });

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket() {
  if (!socket) {
    socket = io({
      autoConnect: false,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000, // استنى 3 ثواني بين كل محاولة
      reconnectionDelayMax: 15000, // أقصى تأخير 15 ثانية
      randomizationFactor: 0.5,
    });
  }

  return socket;
}
