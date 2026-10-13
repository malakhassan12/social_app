import { FC } from "react";
import PaginationAccounts from "./PaginationAccounts";
import getAccountsChats from "@/helper/chat/getChats";
import { getAccountId } from "@/helper/account/getAccountId";
import AccountsTab from "./AccountsTab";
import CreateGroupTab from "./CreateGroupTab";
import CloseConversationBtn from "./CloseConversationBtn";

const AccountsScrollBar: FC<{
  searchParams: Promise<{
    page?: number | string;
    pageAccounts?: number | string;
  }>;
}> = async ({ searchParams }) => {
  const { page, pageAccounts } = await searchParams;

  const accountId = await getAccountId();

  const result = await getAccountsChats(
    page as number | string,
    accountId as string,
  );

  if (!result.success) {
    console.error(result.errors.message);
    return null;
  }

  const {
    conversations,
    currentPage,
    limit,
    total,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  } = result;

  return (
    <div className="w-full space-y-3 sm:space-y-4">
      {/* ── Header ───────────────────────────── */}
      <div className="flex items-center justify-between gap-3">
        {/* Left: Back button + section title */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <CloseConversationBtn />

          <div className="flex min-w-0 items-center gap-2">
            <span
              className="h-5 w-1 shrink-0 rounded-full bg-emerald-500"
              aria-hidden="true"
            />
            <h2 className="truncate text-sm font-semibold tracking-wide text-foreground sm:text-base">
              Conversations
            </h2>
          </div>
        </div>

        {/* Right: New group action */}
        <CreateGroupTab
          accountId={accountId as string}
          pageAccounts={pageAccounts}
        />
      </div>

      {/* ── List card ────────────────────────── */}
      <div
        className="
          overflow-hidden
          rounded-2xl
          border border-border/60
          bg-card
          shadow-sm
        "
      >
        <AccountsTab
          accountId={accountId as string}
          conversations={conversations}
        />

        <PaginationAccounts
          currentPage={currentPage ?? 1}
          limit={limit ?? 10}
          total={total ?? 0}
          totalPages={totalPages ?? 1}
          hasNextPage={hasNextPage ?? false}
          hasPreviousPage={hasPreviousPage ?? false}
        />
      </div>
    </div>
  );
};

export default AccountsScrollBar;