import getAccounts from "@/helper/chat/getAccounts";
import CreateGroupBtn from "./CreateGroupBtn";

export default async function CreateGroupTab({
  accountId,
  pageAccounts,
}: {
  accountId: string;
  pageAccounts?: string | number;
}) {
  const { accounts, hasNextPage } = await getAccounts(
    pageAccounts ?? 1,
    accountId,
  );

  return (
    <CreateGroupBtn
      accountId={accountId as string}
      initialAccounts={(accounts ?? []).map((account) => ({
        ...account,
        image: account.image ?? "",
      }))}
      initialPage={Number(pageAccounts) || 1}
      initialHasNextPage={hasNextPage as boolean}
    />
  );
}