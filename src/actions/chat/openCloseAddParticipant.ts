"use server";

import prisma from "@/lib/prisma";
import { getIo } from "@/lib/socket/getIo";
import { revalidatePath } from "next/cache";

const openCloseAddParticipant = async (
  conversationId: string,
  value: boolean,
  accountId: string,
) => {
  if (!accountId) {
    throw new Error("Unauthorized");
  }

  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      conversationId_accountId: { conversationId, accountId },
    },
    select: { isAdmin: true },
  });

  if (!participant?.isAdmin) {
    throw new Error("Only an admin can change addition status");
  }

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { isOpenAddition: value },
  });

  const io = getIo();

  const conversationRoom = `conversation:${conversationId}`;

  io.to(conversationRoom).emit("manage:addition", {
    conversationId,
    isOpenAddition: value,
  });

  revalidatePath(`/messages/${conversationId}`);

  return {
    success: true,
    message: value
      ? "Addition opened successfully"
      : "Addition closed successfully",
  };
};

export default openCloseAddParticipant;
