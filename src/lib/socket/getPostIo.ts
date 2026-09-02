// import type { Namespace } from "socket.io";

// const POST_IO_KEY = "__postIo";

// declare global {
//   var __postIo: Namespace | undefined;
// }


// export function setPostIo(io: Namespace) {
//   globalThis.__postIo = io;

// }

// export function getPostIo() {
//   const postIo = globalThis.__postIo;


//   if (!postIo) {
//     throw new Error("Socket.IO has not been initialized");
//   }

//   return postIo;
// }