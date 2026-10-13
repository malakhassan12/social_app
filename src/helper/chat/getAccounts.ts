"use server";

import {  Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";

const getAccounts = async (pageInput: number | string, accountId: string) => {
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

    
   
  };

  const [accounts, total] = await Promise.all([
    prisma.account.findMany({
      where,

      select: {
        id: true,
        username: true,
        email: {
            select :{
                email : true
            }
        },
        image: true,
      },

      orderBy: {
        id: "asc",
      },

      skip: offset,
      take: limit,
    }),
    prisma.account.count({
      where,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    success: true,

    accounts,
    
    limit,

    total,

    totalPages,

    hasNextPage: page < totalPages,

    hasPreviousPage: page > 1,
  };
};

export default getAccounts;
