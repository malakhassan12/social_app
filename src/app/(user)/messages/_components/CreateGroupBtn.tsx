"use client";

import { Button } from "@/components/ui/button";
import { ComponentProps, FC, useState } from "react";
import { Users } from "lucide-react";
import CreateGroupModal from "./CreateGroupModal";

const CreateGroupBtn: FC<{
  accountId: string;
  initialAccounts: {
    id: string;
    username: string;
    email: { email: string };
    image: string;
  }[];
  initialPage: number;
  initialHasNextPage: boolean;
}> = ({ accountId, initialAccounts, initialPage, initialHasNextPage }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        size="sm"
        className="
          gap-1.5 sm:gap-2
          h-8 sm:h-9
          px-2.5 sm:px-4
          rounded-full
          bg-linear-to-br from-green-400 to-emerald-500
          hover:from-green-500 hover:to-emerald-600
          text-white
          text-xs sm:text-sm font-medium
          shadow-sm sm:shadow-md
          shadow-green-400/25
          transition-all
          active:scale-95
          whitespace-nowrap
          shrink-0
        "
      >
        <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
        <span className="hidden xs:inline">Create group</span>
        <span className="xs:hidden">Group</span>
      </Button>

      <CreateGroupModal
        open={open}
        onOpenChange={setOpen}
        accountId={accountId}
        initialAccounts={
          initialAccounts as ComponentProps<typeof CreateGroupModal>["initialAccounts"]
        }
        initialPage={initialPage}
        initialHasNextPage={initialHasNextPage}
      />
    </>
  );
};

export default CreateGroupBtn;