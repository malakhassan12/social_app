"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import CreateAccountDialog from "./Dialog/CreateAccountDialog";
import { UserEmail } from "@/generated/prisma/client";

export default function CreateAccount({emails} : {emails : UserEmail[]}) {
  const [open, setOpen] = useState(false);

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Create Account
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Add a new profile under your current email and switch between them anytime.
          </p>
        </div>

        {/* Trigger button */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg
                     bg-green-400 hover:bg-green-500 active:bg-green-600
                     text-green-950
                     dark:bg-green-400 dark:hover:bg-green-500 dark:active:bg-green-600
                     dark:text-green-950
                     transition-colors
                     focus:outline-none focus:ring-2 focus:ring-green-500 
                     focus:ring-offset-2 dark:focus:ring-offset-slate-900
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Account</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>

      <CreateAccountDialog open={open} onOpenChange={setOpen} emails={emails} />
    </section>
  );
}