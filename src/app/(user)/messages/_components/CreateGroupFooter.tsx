"use client";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Check, Loader2 } from "lucide-react";
import { FC } from "react";

const CreateGroupFooter: FC<{
  selectedCount: number;
  pending: boolean;
  canSubmit: boolean;
  onCancel: () => void;
}> = ({ selectedCount, pending, canSubmit, onCancel }) => {
  return (
    <DialogFooter
      className="
        shrink-0 px-3 sm:px-5 md:px-6
        py-2.5 sm:py-4
        border-t border-gray-100 dark:border-gray-800
        bg-white dark:bg-gray-900
        flex-row justify-between items-center
        gap-2 sm:gap-4
        pb-[max(env(safe-area-inset-bottom),0.625rem)]
        sm:pb-4 mb-1
      "
    >
      <div className="min-w-0 flex-1">
        <span className="text-[11px] xs:text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 truncate block leading-tight">
          {selectedCount > 0
            ? `${selectedCount} selected`
            : "Select at least 1"}
        </span>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={pending}
          size="sm"
          className="rounded-full h-8 sm:h-9 px-2.5 xs:px-3 sm:px-4 text-[11px] xs:text-xs sm:text-sm font-medium border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors whitespace-nowrap shrink-0"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={!canSubmit}
          size="sm"
          className="rounded-full h-8 sm:h-9 px-3 xs:px-3.5 sm:px-5 text-[11px] xs:text-xs sm:text-sm font-medium bg-green-500 hover:bg-green-600 text-white shadow-sm shadow-green-500/25 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95 gap-1 sm:gap-1.5 whitespace-nowrap shrink-0"
        >
          {pending ? (
            <>
              <Loader2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 animate-spin shrink-0" />
              <span className="hidden xs:inline">Creating...</span>
              <span className="xs:hidden">...</span>
            </>
          ) : (
            <>
              <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
              <span>Create</span>
            </>
          )}
        </Button>
      </div>
    </DialogFooter>
  );
};

export default CreateGroupFooter;