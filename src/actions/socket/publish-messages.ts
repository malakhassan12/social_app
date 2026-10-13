// import { Message } from "@/generated/prisma/client";
// import prisma from "@/lib/prisma";

// import { getIo } from "@/lib/socket/getIo";

// const publishMessages = async (conversationId: string, message: Message) => {
//   const conversation = await prisma.conversation.findUnique({
//     where: {
//       id: conversationId,
//     },

//     select: {
//       participants: {
//         select: {
//           accountId: true,
//         },
//       },
//     },
//   });

//   if (!conversation) {
//     return;
//   }

//   const io = getIo();

//   io.to(`conversation:${conversationId}`).emit("publish:message", message);
// };

// export default publishMessages;


import { Message } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { getIo } from "@/lib/socket/getIo";

const publishMessages = async (
  conversationId: string,
  message: Message,
) => {
  const conversation =
    await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      select: {
        participants: {
          select: {
            accountId: true,
          },
        },
      },
    });

  if (!conversation) {
    return;
  }

  const io = getIo();

  const conversationRoom =
    `conversation:${conversationId}`;

  // 1. Send the message to everyone currently inside
  //    this conversation.
  io
    .to(conversationRoom)
    .emit("publish:message", message);

  // 2. Get all sockets currently joined
  //    to this conversation.
  const socketsInConversation =
    await io.in(conversationRoom).fetchSockets();

  // 3. Get account IDs of users currently inside.
  const joinedAccountIds = new Set(
    socketsInConversation
      .map((socket) => socket.data.accountId)
      .filter(Boolean),
  );

  // 4. For participants who are NOT currently inside
  //    the conversation, send unread event.
  for (const participant of conversation.participants) {
    const participantId = participant.accountId;

    // Don't count sender's own message as unread.
    if (participantId === message.senderId) {
      continue;
    }

    // Participant but not currently joined.
    if (!joinedAccountIds.has(participantId)) {
      io
        .to(`account:${participantId}`)
        .emit("message:unread", {
          conversationId,
          messageId: message.id,
        });
    }
  }
};

export default publishMessages;