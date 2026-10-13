
"use client";

import { FC } from "react";
import { Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Account } from "@/types/account.Types";
import CreateGroupForm, {  } from "./CreateGroupForm";

interface CreateGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountId: string;
  initialAccounts: Account[];
  initialPage: number;
  initialHasNextPage: boolean;
}

const CreateGroupModal: FC<CreateGroupModalProps> = ({
  open,
  onOpenChange,
  accountId,
  initialAccounts,
  initialPage,
  initialHasNextPage,
}) => {
  const handleClose = (value: boolean) => {
    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="
          p-0 gap-0 flex flex-col
          w-screen max-w-[100vw]
          sm:w-[95vw] sm:max-w-md md:max-w-lg
          h-dvh max-h-dvh
          sm:h-auto sm:max-h-[85vh] md:max-h-[80vh]
          rounded-none sm:rounded-2xl
          overflow-hidden border-0 sm:border
          border-gray-200 dark:border-gray-800
          top-0 translate-y-0
          sm:top-[50%] sm:translate-y-[-50%]
          left-0 translate-x-0
          sm:left-[50%] sm:translate-x-[-50%]
        "
      >
        {/* Header — Page 1's own */}
        <DialogHeader className="shrink-0 px-4 sm:px-5 md:px-6 py-3 sm:py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                Create Group
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                Add a name, photo and select people
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* PAGE 2 — Form (owns selection, search, accounts, pagination) */}
        <CreateGroupForm
          accountId={accountId}
          initialAccounts={initialAccounts}
          initialPage={initialPage}
          initialHasNextPage={initialHasNextPage}
          onCancel={() => handleClose(false)}
          onOpenChange={(value: boolean) => onOpenChange(value)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupModal;
