import { Account } from "@/types/account.Types";
import ChangeAccountType from "../Form/ChangeAccountType";
import OpenCloseComments from "../Form/OpenCloseComments";

export default function PrivacyTab({ account }: { account: Account }) {
  return (
    <section className="space-y-8">
      {/* ============================================ */}
      {/* ACCOUNT TYPE                                 */}
      {/* ============================================ */}

      <ChangeAccountType accountId={account.id} type={account.type} />

      {/* Divider */}
      <div className="border-t border-slate-200 dark:border-slate-800" />

      {/* ============================================ */}
      {/* COMMENTS                                     */}
      {/* ============================================ */}

      <OpenCloseComments
        accountId={account.id}
        isOpenComments={account?.isOpenComments as boolean}
      />
    </section>
  );
}
