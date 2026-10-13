import getAccounts from "@/helper/chat/getAccounts";
import AddParticipantBtn from "./AddParticipantBtn";
import { ConversationParticipantChat } from "./ChatControllerBtn";
export default async function AddParticipantTab({
  accountId,
  conversationId,
  initialParticipants,
}: {
  accountId: string;
  conversationId: string;
  initialParticipants: ConversationParticipantChat[];
}) {
  const { accounts, hasNextPage } = await getAccounts(1, accountId);

  const participantAccountIds = new Set(
    initialParticipants.map(
      (participant) => participant.accountId,
    ),
  );

  const availableAccounts = (accounts ?? []).filter(
    (account) => !participantAccountIds.has(account.id),
  );

  return (
    <AddParticipantBtn
      accountId={accountId}
      conversationId={conversationId}
      initialAccounts={availableAccounts.map((account) => ({
        ...account,
        image: account.image ?? "",
      }))}
      initialPage={1}
      initialHasNextPage={hasNextPage as boolean}
    />
  );
}