import { Prisma } from "@/generated/prisma/client";
import { ConversationType } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { ConversationParticipantType } from "@/generated/prisma/enums";

/*
 * ========================================
 * CHAT PARTICIPANT
 * ========================================
 */

export type ChatParticipant = {
  id: string;
  username: string;
  email: string;
  image: string;
};

/*
 * ========================================
 * UNIFIED CHAT
 * ========================================
 *
 * This represents BOTH:
 *
 * 1. Existing conversation
 * 2. Account without a conversation yet
 */

export type Chat = {
  id: string;

  name: string | undefined | null;

  image: string | undefined | null;

  type: ConversationType;

  participants: ChatParticipant[];
};

/*
 * ========================================
 * SUCCESS RESPONSE
 * ========================================
 */

export type GetAccountsChatsSuccess = {
  success: true;

  conversations: Chat[];

  currentPage: number;
  limit: number;

  total: number;
  totalPages: number;

  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

/*
 * ========================================
 * ERROR RESPONSE
 * ========================================
 */

export type GetAccountsChatsError = {
  success: false;

  errors: {
    message: string;
  };
};

/*
 * ========================================
 * FULL RESPONSE
 * ========================================
 */

export type GetAccountsChatsResponse =
  | GetAccountsChatsSuccess
  | GetAccountsChatsError;

const getAccountsChats = async (
  pageInput: number | string,
  accountId: string,
): Promise<GetAccountsChatsResponse> => {
  if (!accountId) {
    return {
      success: false,
      errors: {
        message: "Unauthorized",
      },
    };
  }

  const limit = 10;

  const page = Math.max(1, Number(pageInput) || 1);

  const offset = (page - 1) * limit;

  /*
   * ========================================
   * ACCOUNTS
   * ========================================
   */
  const where: Prisma.AccountWhereInput = {
    id: {
      not: accountId,
    },

    // At least ONE of these relationships must exist
    OR: [
      {
        followers: {
          some: {
            followerId: accountId,
          },
        },
      },

      {
        following: {
          some: {
            followingId: accountId,
          },
        },
      },

      {
        followRequestsSent: {
          some: {
            receiverId: accountId,
            status: "ACCEPTED",
          },
        },
      },

      {
        followRequestsReceived: {
          some: {
            requesterId: accountId,
            status: "ACCEPTED",
          },
        },
      },
    ],

    // AND they must NOT have a DIRECT conversation with me
    conversationParticipants: {
      none: {
        conversation: {
          type: ConversationType.DIRECT,

          participants: {
            some: {
              accountId,
              type: ConversationParticipantType.EXIST,
            },
          },
        },
      },
    },
  };

  /*
   * ========================================
   * GET ACCOUNTS + GROUPS
   * ========================================
   */

  const [accounts, totalAccounts, conversations, totalConversations] =
    await Promise.all([
      /*
       * ========================================
       * ACCOUNTS
       * ========================================
       */

      prisma.account.findMany({
        where,

        select: {
          id: true,
          username: true,
          email: true,
          image: true,

          conversationParticipants: {
            where: {
              type: ConversationParticipantType.EXIST,
              conversation: {
                type: ConversationType.DIRECT,

                participants: {
                  some: {
                    accountId,
                    type: ConversationParticipantType.EXIST,
                  },
                },
              },
            },

            select: {
              conversationId: true,

              conversation: {
                select: {
                  type: true,
                },
              },
            },
          },
        },

        orderBy: {
          id: "asc",
        },

        skip: offset,
        take: limit,
      }),

      /*
       * ========================================
       * TOTAL ACCOUNTS
       * ========================================
       */

      prisma.account.count({
        where,
      }),

      /*
       * ========================================
       * GROUP / EXISTING CONVERSATIONS
       * ========================================
       */

      prisma.conversation.findMany({
        where: {
          participants: {
            some: {
              accountId,
              type: ConversationParticipantType.EXIST,
            },
          },
          isRemoved : false
        },

        select: {
          id: true,
          type: true,
          name: true,
          image: true,

          participants: {
            where: {
              type: ConversationParticipantType.EXIST,
            },
            select: {
              account: {
                select: {
                  id: true,
                  username: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
        },

        orderBy: {
          updatedAt: "desc",
        },

        skip: offset,
        take: limit,
      }),

      /*
       * ========================================
       * TOTAL CONVERSATIONS
       * ========================================
       */

      prisma.conversation.count({
        where: {
          participants: {
            some: {
              accountId,
              type: ConversationParticipantType.EXIST,
            },
          },
        },
      }),
    ]);

  const accountsWithConversation: Chat[] = accounts.map((account) => {
    const conversation = account.conversationParticipants[0];

    return {
      /*
       * If conversation exists:
       *     id = conversationId
       *
       * If not:
       *     id = account.id
       */

      id: conversation?.conversationId ?? null,

      /*
       * An account chat is logically DIRECT
       * even if the conversation has not been created yet.
       */

      type: ConversationType.DIRECT,

      name: "",
      image: "",

      /*
       * Same shape as group participants:
       * ALWAYS an array.
       */

      participants: [
        {
          id: account.id,
          username: account.username,
          email: account.email.email,
          image: account.image ?? "",
        },
      ],
    };
  });





  /*
   * ========================================
   * FORMAT GROUPS
   * ========================================
   */

  const formattedConversations: Chat[] = conversations.map((conversation) => ({
    id: conversation.id,

    type: conversation.type,

    name: conversation.name,

    image: conversation.image,

    participants: conversation.participants.map((participant) => ({
      id: participant.account.id,

      username: participant.account.username,

      email: participant.account.email.email,

      image: participant.account.image ?? "",
    })),
  }));

  /*
   * ========================================
   * PAGINATION
   * ========================================
   */

  const total = totalAccounts + totalConversations;

  const totalPages = Math.ceil(total / limit);

  const finalConversations: Chat[] = [
    ...formattedConversations,
    ...accountsWithConversation,
  ];

  return {
    success: true,

    conversations: finalConversations,

    currentPage: page,

    limit,

    total,

    totalPages,

    hasNextPage: page < totalPages,

    hasPreviousPage: page > 1,
  };
};

export default getAccountsChats;
