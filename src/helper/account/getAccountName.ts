import prisma from "@/lib/prisma";

const getAccountName = async (accountId: string) => {
  const account = await prisma.account.findFirst({
    where: {
      id: accountId,
    },
  });

  if (!account) {
    return {
      success: false,
      errors: {
        message: "Not exist this account in the system",
      },
    };
  }

  return account?.username;
};

export default getAccountName;
