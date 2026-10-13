"use server";

import prisma from "@/lib/prisma";
import { getAccountId } from "./getAccountId";
import { AccountType } from "@/generated/prisma/enums";

const isAccountPrivate = async () => {
  const accountId = (await getAccountId()) as string;

  if (!accountId) {
    return {
      success: false,
      errors: {
        message: "Unauthorized",
      },
    };
  }

  const account = await prisma.account.findUnique({
    where: {
      id: accountId,
    },
    select: {
      type: true,
    },
  });

  return account?.type === AccountType.PRIVATE ? true : false;
};

export default isAccountPrivate;
