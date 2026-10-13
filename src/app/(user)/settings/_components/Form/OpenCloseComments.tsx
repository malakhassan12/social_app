"use client";

import updateCommentsSetting from "@/actions/settings/updateCommentsSetting";
import { Switch } from "@/components/ui/switch";
import Form from "next/form";

import { FC, useRef, useTransition } from "react";
import { toast } from "sonner";

const OpenCloseComments: FC<{
  isOpenComments: boolean;
  accountId: string;
}> = ({ isOpenComments, accountId }) => {
  const formRef = useRef<HTMLFormElement>(null);

  const [isPending, startTransition] = useTransition();

  const submit = (formData: FormData) => {
    startTransition(async () => {
      try {
        const result = await updateCommentsSetting(accountId, formData);

        if (!result.success) {
          toast.error(result.message || "Failed to update account type");

          return;
        }

        toast.success(result.message || "Account type updated successfully");
      } catch (error) {
        console.error(error);

        toast.error("Failed to update account type");
      }
    });
  };

  return (
    <Form ref={formRef} action={submit} className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Comments
        </h3>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage who can comment on your posts.
        </p>
      </div>

      {/* Allow comments on all posts */}

      <div
        className="
          flex items-center justify-between gap-4
          rounded-lg border border-slate-200 dark:border-slate-800
          bg-white dark:bg-slate-950 p-4 transition-colors
        "
      >
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Allow comments on all posts
          </p>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Applies to every post you publish.
          </p>
        </div>

        <Switch
          name="allowAllComments"
          defaultChecked={isOpenComments}
          disabled={isPending}
          onCheckedChange={() => {
            startTransition(() => {
              formRef.current?.requestSubmit();
            });
          }}
        />
      </div>
    </Form>
  );
};

export default OpenCloseComments;
