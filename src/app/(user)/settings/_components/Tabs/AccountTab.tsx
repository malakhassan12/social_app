"use client";

import updateAccount from "@/actions/settings/updateAccount";
import ImageCircle from "@/components/ImageCircle/ImageCircle";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Account } from "@/types/account.Types";
import Form from "next/form";
import { useTransition } from "react";
import { toast } from "sonner";


const COUNTRIES = [
  { value: "EG", label: "Egypt" },
  { value: "US", label: "United States" },
  { value: "UK", label: "United Kingdom" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
];

export default function AccountTab({ account }: { account: Account }) {
  const [isPending, startTransition] = useTransition();

  const submit = (formData: FormData) => {
    startTransition(async () => {
      try {
        const result = await updateAccount(account.id, formData);

        if (!result.success) {
          toast.error(result.message || "Failed to update account");

          return;
        }

        toast.success(result.message || "Account updated successfully");
      } catch (error) {
        console.error(error);

        toast.error("Failed to update account");
      }
    });
  };
  return (
    <Form
      action={""}
      onSubmit={(event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        submit(formData);
      }}
      className="space-y-6"
    >
    

      {/* Username */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Username
        </label>
        <Input
          type="text"
          name="username"
          defaultValue={account.username}
          placeholder="johndoe"
          required
        />
      </div>

      {/* Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Name
        </label>
        <Input
          type="text"
          name="name"
          defaultValue={account.name}
          placeholder="John Doe"
          required
        />
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Bio
        </label>
        <Textarea
          name="bio"
          rows={3}
          defaultValue={account.bio ?? ""}
          placeholder="Tell us about yourself..."
          className="resize-none"
        />
      </div>

      {/* Profile Image */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Profile Image
        </label>
        <ImageCircle pending={isPending} initialImage={account.image ?? ""} />
      </div>

      {/* Country */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Country
        </label>
        <Select name="country" defaultValue={account.country}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent>
            {COUNTRIES.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Email (read-only) */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Email
        </label>
        <Input
          type="email"
          value={account?.email.email}
          readOnly
          disabled
          className="cursor-not-allowed  bg-slate-50 dark:bg-slate-900  text-slate-500 dark:text-slate-400"
        />
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Email is linked to your account and cannot be changed here.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
        <button
          type="button"
          disabled={isPending}
          className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium rounded-lg
                     text-slate-700 dark:text-slate-300
                     bg-white dark:bg-slate-950
                     border border-slate-300 dark:border-slate-700
                     hover:bg-slate-50 dark:hover:bg-slate-800
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium rounded-lg
                     text-white bg-green-600 hover:bg-green-700
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition focus:outline-none focus:ring-2 focus:ring-green-500 
                     focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </Form>
  );
}
