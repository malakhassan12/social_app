"use client";

import switchAccount from "@/actions/settings/switchAccount";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Account } from "@/types/account.Types";

import { useRouter } from "next/navigation";

import { useTransition } from "react";

import { toast } from "sonner";


export default function SwitchAccounts({
  account,
  accounts,
}: {
  account: Account;
  accounts: Account[];
}) {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  /* ---------------------------------------------------
   * Handler: Switch between accounts
   * --------------------------------------------------- */

  const handleSwitchAccount = (
    accountId: string,
  ) => {
    startTransition(async () => {
      try {
        const result =
          await switchAccount(
            accountId,
          );

        if (!result.success) {
          toast.error(
            result.message ||
              "Failed to switch account",
          );

          return;
        }

        toast.success(
          result.message ||
            "Account switched successfully",
        );

        router.refresh();
      } catch (error) {
        console.error(error);

        toast.error(
          "Failed to switch account",
        );
      }
    });
  };

  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Switch Between Accounts
        </h3>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Quickly jump between accounts you own.
        </p>
      </div>

      <div className="space-y-2">
        <Select
          defaultValue={account.id}
          onValueChange={
            handleSwitchAccount
          }
          disabled={isPending}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an account" />
          </SelectTrigger>

          <SelectContent>
            {accounts.map((acc) => (
              <SelectItem
                key={acc.id}
                value={acc.id}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {acc.name}
                  </span>

                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    @{acc.username}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          You&apos;ll be redirected to the selected
          account&apos;s settings.
        </p>
      </div>
    </section>
  );
}