// import prisma from "@/lib/prisma";
// import { getAccountId } from "../getAccountId";
import { ConversationParticipantType } from "@/generated/prisma/enums";

// const getMessagesConversation = async (
//   conversationId: string,
//   pageInput?: number | string,
// ) => {
//   const accountId = await getAccountId();

//   if (!accountId) {
//     return {
//       success: false,
//       errors: {
//         message: "Unauthorized",
//       },
//     };
//   }

//   const converstion = await prisma.conversation.findUnique({
//     where: { id: conversationId },
//     include: {
//       participants: {
//         include: { account: true },
//       },
//     },
//   });

//   if (!converstion)
//     return {
//       success: false,
//       errors: {
//         message: "Not exist converstion",
//       },
//     };

//   const limit = 10;

//   const page = Math.max(1, Number(pageInput) || 1);

//   const offset = (page - 1) * limit;

//   const [messages, total] = await prisma.$transaction([
//     prisma.message.findMany({
//       where: {
//         conversationId,
//       },
//       include: {
//         sender: true,
//         messageReads: {
//           select: { accountId: true },
//         },
//         messageReactions: {
//           select: {
//             accountId: true,
//             type: true,
//           },
//         },
//       },
//       skip: offset,
//       take: limit,
//     }),

//     prisma.message.count({
//       where: {
//         conversationId,
//       },
//     }),
//   ]);

//   const totalPages = Math.ceil(total / limit);

//   return {
//     success: true,

//     messages,

//     converstion,

//     currentPage: page,
//     limit,
//     total,
//     totalPages,

//     hasNextPage: page < totalPages,
//     hasPreviousPage: page > 1,
//   };
// };

// export default getMessagesConversation;

import prisma from "@/lib/prisma";
import { getAccountId } from "../account/getAccountId";

const getMessagesConversation = async (conversationId: string) => {
  const accountId = await getAccountId();

  if (!accountId) {
    return {
      success: false,
      errors: {
        message: "Unauthorized",
      },
    };
  }

  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,

      participants: {
        some: {
          accountId,
          type: ConversationParticipantType.EXIST,
        },
      },
    },

    include: {
      participants: {
        where: {
          type: ConversationParticipantType.EXIST,
        },
        include: {
          account: true,
        },
      },
    },
  });

  if (!conversation) {
    return {
      success: false,
      errors: {
        message: "Not exist conversation",
      },
    };
  }

  const limit = 10;

  /*
   * Get the latest 10 messages
   */

  const messages = await prisma.message.findMany({
    where: {
      conversationId,
    },

    include: {
      sender: true,

      replyToMessage: {
        select: {
          content: true,
          image: true,
          sender: true,
        },
      },

      messageReads: {
        select: {
          accountId: true,
          readAt: true,
          account: {
            select: {
              username: true,
              id: true,
              image: true,
            },
          },
        },
      },

      messageReactions: {
        select: {
          accountId: true,
          type: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },

    take: limit,
  });

  /*
   * Prisma returned:
   *
   * newest → oldest
   *
   * Reverse them so the UI gets:
   *
   * oldest → newest
   */

  messages.reverse();

  /*
   * Check whether older messages exist
   */

  const oldestMessage = messages[0];

  const hasMoreOlderMessages = oldestMessage
    ? Boolean(
        await prisma.message.findFirst({
          where: {
            conversationId,

            createdAt: {
              lt: oldestMessage.createdAt,
            },
          },

          select: {
            id: true,
          },
        }),
      )
    : false;

  return {
    success: true,

    messages,

    converstion: conversation,

    hasMoreOlderMessages,
  };
};

export default getMessagesConversation;
