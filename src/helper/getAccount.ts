"use server";

import prisma from "@/lib/prisma";
import { getAccountId } from "./getAccountId";

const getAccount = async (parmsAccount: string | undefined = undefined) => {
  let accountId = (await getAccountId()) as string;

  if(parmsAccount)
    accountId = parmsAccount;

  if (!accountId) {
    return null;
  }

  const user = await prisma.account.findUnique({
    where: { id: accountId },
    select: {
      image: true,
      name: true,
      email: true,
      country: true,
      bio: true,
    },
  });

  return user;
};

export default getAccount;
