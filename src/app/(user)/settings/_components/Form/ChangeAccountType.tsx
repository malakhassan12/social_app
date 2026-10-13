"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { AccountType } from "@/generated/prisma/enums";

import Form from "next/form";

import { useTransition } from "react";

import { toast } from "sonner";

import { useRouter } from "next/navigation";
import changeAccountType from "@/actions/settings/ChangeTypeAccount";
import { ACCOUNT_TYPES } from "@/constants/Settings.constants";


export default function ChangeAccountType({
  accountId,
  type,
}: {
  accountId: string;
  type: AccountType;
}) {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const submit = (formData : FormData) => {

    startTransition(async () => {
      try {
        const result = await changeAccountType(accountId, formData);

        if (!result.success) {
          toast.error(result.message || "Failed to update account type");

          return;
        }

        toast.success(result.message || "Account type updated successfully");

        router.refresh();
      } catch (error) {
        console.error(error);

        toast.error("Failed to update account type");
      }
    });
  };

  return (
    <Form action={submit}  className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Account Type
        </h3>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Control who can see your profile and posts.
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Visibility
        </label>

        <Select name="type" defaultValue={type} disabled={isPending}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select account type" />
          </SelectTrigger>

          <SelectContent>
            {ACCOUNT_TYPES.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          {type === AccountType.PRIVATE
            ? "Only approved followers can see your content."
            : "Anyone can see your profile and posts."}
        </p>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900"
      >
        {isPending ? "Saving..." : "Save Changes"}
      </button>
    </Form>
  );
}
