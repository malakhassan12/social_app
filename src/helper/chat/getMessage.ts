import prisma from "@/lib/prisma";

const getMessage = async (messageId: string) => {
  const message = await prisma.message.findUnique({
    where: { id: messageId },
    select: {
      id: true,
      content: true,
      image: true,
    },
  });

  return message;
};

export default getMessage;
