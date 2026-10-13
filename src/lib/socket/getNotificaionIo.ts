import type { Namespace } from "socket.io";


declare global {
  var __notiIo: Namespace | undefined;
}


export function setNotificaionIo(io: Namespace) {
  globalThis.__notiIo = io;

}

export function getNotificaionIo() {
  const notiIo = globalThis.__notiIo;


  if (!notiIo) {
    throw new Error("Socket.IO has not been initialized");
  }

  return notiIo;
}