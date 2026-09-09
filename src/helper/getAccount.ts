"use server";

import prisma from "@/lib/prisma";
import { getAccountId } from "./getAccountId";

const getAccount = async (parmsAccount?: string) => {
  const accountId = parmsAccount ?? await getAccountId();

  if (!accountId) {
    return null;
  }

  const user = await prisma.account.findUnique({
    where: { id: accountId },
    select: {
      id : true,
      image: true,
      name: true,
      email: true,
      country: true,
      bio: true,
      type: true,
      username: true,
    },
  });

  return user;
};

export default getAccount;