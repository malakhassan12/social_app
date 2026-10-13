"use server";

import getAccounts from "@/helper/chat/getAccounts";

export async function loadMoreAccounts(
  page: number,
  accountId: string,
) {
  const { accounts, hasNextPage } = await getAccounts(page, accountId);
  return {
    accounts: (accounts ?? []).map((a) => ({
      ...a,
      image: a.image ?? "",
    })),
    hasNextPage,
  };
}