"use client";

import updateChattingGroups from "@/actions/settings/updateChattingGroups";
import updateChattingMessages from "@/actions/settings/updateChattingMesseges";
import { Switch } from "@/components/ui/switch";
import { Account } from "@/types/account.Types";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function ChattingTab({ account }: { account: Account }) {
  const [isPending, startTransition] = useTransition();

  const accountId = account.id;

  // Local state so UI updates instantly (optimistic)
  const [isOpenMessages, setIsOpenMessages] = useState(account.isOpenMessages);
  const [isOpenGroup, setIsOpenGroup] = useState(account.isOpenGroup);

  // ---------------------------------------------------
  //  Handler: Allow Messages
  // ---------------------------------------------------

  const handleMessagesChange = (checked: boolean) => {
    setIsOpenMessages(checked); // optimistic update

    startTransition(async () => {
      try {
        const result = await updateChattingMessages(accountId, checked);

        if (!result.success) {
          setIsOpenMessages(!checked);
          toast.error(result.message || "Failed to update messages setting");
          return;
        }

        toast.success(
          result.message || "Messages setting updated successfully",
        );
      } catch (error) {
        console.error(error);

        setIsOpenMessages(!checked);

        toast.error("Failed to update messages setting");
      }
    });
  };

  // ---------------------------------------------------
  //  Handler: Allow Group Additions
  // ---------------------------------------------------

  const handleGroupChange = (checked: boolean) => {
    setIsOpenGroup(checked); // optimistic update

    startTransition(async () => {
      try {
        const result = await updateChattingGroups(accountId, checked);

        if (!result.success) {
          setIsOpenGroup(!checked);
          toast.error(result.message || "Failed to update group setting");
          return;
        }

        toast.success(result.message || "Group setting updated successfully");
      } catch (error) {
        console.error(error);

        setIsOpenGroup(!checked);

        toast.error("Failed to update group setting");
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* ============================================ */}
      {/* CHATTING                                     */}
      {/* ============================================ */}
      <section className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Chatting
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Control who can message you and add you to groups.
          </p>
        </div>

        {/* Allow Messages */}
        <div
          className="flex items-center justify-between gap-4 
                        rounded-lg border border-slate-200 dark:border-slate-800 
                        bg-white dark:bg-slate-950 p-4 transition-colors"
        >
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Allow Messages
            </p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Let other accounts send you direct messages.
            </p>
          </div>
          <Switch
            checked={isOpenMessages}
            onCheckedChange={handleMessagesChange}
            disabled={isPending}
            aria-label="Allow messages"
          />
        </div>

        {/* Allow Group Additions */}
        <div
          className="flex items-center justify-between gap-4 
                        rounded-lg border border-slate-200 dark:border-slate-800 
                        bg-white dark:bg-slate-950 p-4 transition-colors"
        >
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Allow Group Additions
            </p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Let others add you to group conversations.
            </p>
          </div>
          <Switch
            checked={isOpenGroup}
            onCheckedChange={handleGroupChange}
            disabled={isPending}
            aria-label="Allow group additions"
          />
        </div>
      </section>
    </div>
  );
}
