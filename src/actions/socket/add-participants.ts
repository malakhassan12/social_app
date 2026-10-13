import { getIo } from "@/lib/socket/getIo";

const addParticipants = (
  accountIds: string[],
  conversation: {
    id: string;
    name: string | null;
    image: string | null;
  },
) => {
  const io = getIo();

  for (const accountId of accountIds) {
    io.to(`account:${accountId}`).emit("add:group", {
      conversation,
    });
  }
};

export default addParticipants;
