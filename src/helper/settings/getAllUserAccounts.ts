"use server";

import prisma from "@/lib/prisma";

const getAllUserAccounts = async (currentAccountId: string) => {
  try {
    if (!currentAccountId) {
      return [];
    }

    // Get the User who owns the current account
    const currentAccount = await prisma.account.findUnique({
      where: {
        id: currentAccountId,
      },
      select: {
        email: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!currentAccount) {
      return [];
    }

    const userId = currentAccount.email.userId;

    // Get ALL accounts owned by this User
    const accounts = await prisma.account.findMany({
      where: {
        email: {
          userId,
        },
      },
      select: {
        id: true,
        username: true,
        name: true,
        image: true,
        country: true,
        type: true,
        status: true,
        emailId: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return accounts;
  } catch (error) {
    console.error("getAllUserAccounts error:", error);

    return [];
  }
};

export default getAllUserAccounts;
