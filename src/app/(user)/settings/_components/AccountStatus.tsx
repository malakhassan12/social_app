"use client";

import changeAccountStatus from "@/actions/settings/ChangeAccountStatus";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AccountStatus as AccountStatusType } from "@/generated/prisma/enums";
import { Account } from "@/types/account.Types";
import { useState, useTransition } from "react";
import { toast } from "sonner";

const ACCOUNT_STATUSES = [
  {
    value: "ACTIVE",
    label: "Active",
    desc: "Your account is fully operational.",
    color: "text-green-600 dark:text-green-400",
    dot: "bg-green-500",
  },
  {
    value: "DEACTIVATED",
    label: "Deactivated",
    desc: "Hidden from others. Reactivate anytime.",
    color: "text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  {
    value: "SUSPENDED",
    label: "Suspended",
    desc: "Restricted by moderation.",
    color: "text-red-600 dark:text-red-400",
    dot: "bg-red-500",
  },
];

export default function AccountStatus({ account }: { account: Account }) {
  const [isPending, startTransition] = useTransition();

  const [status, setStatus] = useState<string>(account?.status ?? "ACTIVE");

  /* ---------------------------------------------------
   *  Handler: Change account status
   * --------------------------------------------------- */
  const handleStatusChange = (value: AccountStatusType) => {
    const previousStatus = status;

    setStatus(value);

    startTransition(async () => {
      try {
        const result = await changeAccountStatus(account.id, value);

        if (!result.success) {
          setStatus(previousStatus);

          toast.error(result.message || "Failed to update account status");

          return;
        }

        toast.success(result.message || "Account status updated successfully");
      } catch (error) {
        console.error(error);

        setStatus(previousStatus);

        toast.error("Failed to update account status");
      }
    });
  };
  const current = ACCOUNT_STATUSES.find((s) => s.value === status);

  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Account Status
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Control your account&apos;s current state.
        </p>
      </div>

      {/* Current status card */}
      <div
        className="rounded-lg border border-slate-200 dark:border-slate-800 
                        bg-white dark:bg-slate-950 p-4 transition-colors"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex items-center gap-3">
            <span
              className={`h-2.5 w-2.5 rounded-full shrink-0 ${current?.dot}`}
            />
            <div className="min-w-0">
              <p className={`text-sm font-semibold ${current?.color}`}>
                {current?.label}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                {current?.desc}
              </p>
            </div>
          </div>

          {/* Active toggle — only ACTIVE ↔ DEACTIVATED */}
          {status !== "SUSPENDED" && (
            <Switch
              checked={status === "ACTIVE"}
              onCheckedChange={(checked) =>
                handleStatusChange(checked ? "ACTIVE" : "DEACTIVATED")
              }
              disabled={isPending}
              aria-label="Toggle active status"
            />
          )}
        </div>
      </div>

      {/* Full status chooser */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Change Status
        </label>
        <Select
          value={status}
          onValueChange={handleStatusChange}
          disabled={isPending || status === "SUSPENDED"}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ACCOUNT_STATUSES.map(({ value, label, dot }) => (
              <SelectItem key={value} value={value}>
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${dot}`} />
                  <span>{label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </section>
  );
}
