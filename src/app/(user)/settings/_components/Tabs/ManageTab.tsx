import { Account } from "@/types/account.Types";
import SwitchAccounts from "../SwitchAccounts";
import AccountStatus from "../AccountStatus";
import getAllUserAccounts from "@/helper/settings/getAllUserAccounts";
import CreateAccount from "../CreateAccount";
import getEmails from "@/helper/settings/getEmails";
import { UserEmail } from "@/generated/prisma/client";

export default async function ManageTab({ account }: { account: Account }) {
  const accounts = await getAllUserAccounts(account.id);

  const emails = await getEmails(account.id);
  return (
    <div className="space-y-8">
      <CreateAccount emails={emails as UserEmail[]} />

      <div className="border-t border-slate-200 dark:border-slate-800" />

      {/* ============================================ */}
      {/* SWITCH BETWEEN ACCOUNTS                      */}
      {/* ============================================ */}

      <SwitchAccounts account={account} accounts={accounts as Account[]} />

      {/* Divider */}
      <div className="border-t border-slate-200 dark:border-slate-800" />

      {/* ============================================ */}
      {/* ACCOUNT STATUS                               */}
      {/* ============================================ */}

      <AccountStatus account={account} />
      {/* Divider */}
    </div>
  );
}
