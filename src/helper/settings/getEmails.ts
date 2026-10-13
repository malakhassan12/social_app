"use server"
import prisma from "@/lib/prisma";

const getEmails = async (currentAccountId: string) => {
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

    // Get ALL emails owned by this User
    const emails = await prisma.userEmail.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        email: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return emails;
  } catch (error) {
    console.error("getEmails error:", error);

    return [];
  }
};

export default getEmails;
