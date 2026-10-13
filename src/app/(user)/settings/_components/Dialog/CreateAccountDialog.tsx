"use client";

import createAccount from "@/actions/auth/createAccount";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ACCOUNT_TYPES, COUNTRIES } from "@/constants/Settings.constants";
import { Loader2, Mail, Plus } from "lucide-react";
import Form from "next/form";
import { useState, useTransition } from "react";
import { toast } from "sonner";



type UserEmail = { id: string; email: string };

export default function CreateAccountDialog({
  open,
  onOpenChange,
  emails,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  emails: UserEmail[];
}) {
  const [isPending, startTransition] = useTransition();
  const [emailId, setEmailId] = useState(emails[0]?.id ?? "");
  const [type, setType] = useState("PUBLIC");
  const [country, setCountry] = useState("");

  const handleSubmit = (formData : FormData) => {


    formData.set("emailId", emailId);
    formData.set("type", type);
    formData.set("country", country);

    startTransition(async () => {
      try {
        const result = await createAccount(formData);

        if (!result.success) {
          toast.error(result.message || "Failed to create account");

          return;
        }

        toast.success(result.message || "Account created successfully");

        onOpenChange(false);

      } catch (error) {
        console.error(error);

        toast.error("Failed to create account");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-slate-200 dark:border-slate-800">
          <DialogTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Create a new account
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 dark:text-slate-400">
            Add another profile under one of your verified emails. You can
            switch between them anytime.
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <Form action={handleSubmit} className="flex flex-col min-h-0">
          {/* Scrollable body */}
          <div className="px-5 sm:px-6 py-5 space-y-5 max-h-[55vh] overflow-y-auto-mx-4 no-scrollbar  overflow-y-auto ">
            {/* Email */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                <Mail className="h-3.5 w-3.5" />
                Email <span className="text-red-500">*</span>
              </label>
              <Select
                value={emailId}
                onValueChange={setEmailId}
                disabled={emails.length === 0}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an email" />
                </SelectTrigger>
                <SelectContent>
                  {emails.map(({ id, email }) => (
                    <SelectItem key={id} value={id}>
                      {email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                The new account will be linked to this email.
              </p>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Username <span className="text-red-500">*</span>
              </label>
              <Input
                name="username"
                type="text"
                placeholder="johndoe"
                required
                minLength={3}
                maxLength={30}
                pattern="[a-zA-Z0-9_]+"
                title="Only letters, numbers, and underscores"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Letters, numbers, and underscores only.
              </p>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Name <span className="text-red-500">*</span>
              </label>
              <Input
                name="name"
                type="text"
                placeholder="John Doe"
                required
                maxLength={60}
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Bio
              </label>
              <Textarea
                name="bio"
                rows={2}
                placeholder="Tell us about this account..."
                className="resize-none"
                maxLength={160}
              />
            </div>

            {/* Type + Country */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Account Type
                </label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ACCOUNT_TYPES.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Country <span className="text-red-500">*</span>
                </label>
                <Select value={country} onValueChange={setCountry}>
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
            </div>
          </div>

          {/* Footer */}
          <DialogFooter
            className="px-4 sm:px-6 py-3.5 sm:py-4  mb-1.5
             border-t border-slate-200 dark:border-slate-800
             flex flex-col-reverse sm:flex-row 
             sm:justify-end 
             gap-2.5 sm:gap-3
             bg-slate-50/50 dark:bg-slate-900/50"
          >
            {/* Cancel */}
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="w-full sm:w-auto 
               px-5 py-2.5 
               text-sm font-medium rounded-lg
               text-slate-700 dark:text-slate-300
               bg-white dark:bg-slate-950
               border border-slate-300 dark:border-slate-700
               hover:bg-slate-50 dark:hover:bg-slate-800
               active:bg-slate-100 dark:active:bg-slate-700
               disabled:opacity-50 disabled:cursor-not-allowed
               transition-colors 
               focus:outline-none focus:ring-2 focus:ring-slate-400
               focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              Cancel
            </button>

            {/* Create */}
            <button
              type="submit"
              disabled={isPending || !country || !emailId}
              className="w-full sm:w-auto 
               inline-flex items-center justify-center gap-2 
               px-5 py-2.5 
               text-sm font-medium rounded-lg
               bg-green-400 hover:bg-green-500 active:bg-green-600
               text-green-950
               dark:bg-green-400 dark:hover:bg-green-500 dark:active:bg-green-600
               dark:text-green-950
               disabled:opacity-50 disabled:cursor-not-allowed
               transition-colors 
               focus:outline-none focus:ring-2 focus:ring-green-500 
               focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Account
                </>
              )}
            </button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
