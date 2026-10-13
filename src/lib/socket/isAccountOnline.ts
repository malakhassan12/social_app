import "server-only";
import { getIo } from "./getIo";

const isAccountOnline = (accountId: string): boolean => {
  const io = getIo();
  if (!io) return false;

  // اسأل الـ room نفسها - لو فيها sockets يبقى الحساب متصل
  const room = io.sockets.adapter.rooms.get(`account:${accountId}`);
  return !!room && room.size > 0;
};

export default isAccountOnline;