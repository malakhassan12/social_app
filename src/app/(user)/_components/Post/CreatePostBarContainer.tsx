import { getAccountId } from "@/helper/getAccountId";
import getAccount from "@/helper/getAccount";
import CreatePostBar from "@/components/Bar/CreatePostBar";

export default async function CreatePostBarContainer() {
  const accountId = await getAccountId();

  if (!accountId) {
    return null;
  }

  const account = await getAccount(accountId);

  return (
    <CreatePostBar
      userName={account?.username as string}
      image={account?.image as string}
    />
  );
}
