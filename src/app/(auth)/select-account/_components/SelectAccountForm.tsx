"use client";

import { User, Lock, Globe } from "lucide-react";
import { authSelectAccount } from "@/actions/auth/authSelectAccount";
import ProfileAvatar from "@/components/Avatar/ProfileAvatar";
import { Badge } from "@/components/ui/badge";
import { FC, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Account } from "@/types/account.Types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type SelectAccountFormProp = {
  account: Account;
  userId: string;
};
const SelectAccountForm: FC<SelectAccountFormProp> = ({ account, userId }) => {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const applyAuthSelectAccount = () => {
    startTransition(async () => {
      const result = await authSelectAccount(account.id, userId);

      if (result.success) {
        toast.success("Selected Account successfully!", {
          position: "top-center",
        });
        router.replace('/')
      } else {
        toast.error("Failed to select Account", { position: "top-center" });
      }
    });
  };
  return (
    <>
      <form key={account.id} action={applyAuthSelectAccount}>
        <input type="hidden" name="accountId" value={account.id} />
        <Button
          type="submit"
          disabled={isPending}
          variant="outline"
          className="w-full h-auto p-4 flex items-center gap-4 hover:bg-accent hover:text-accent-foreground transition-colors border-2 border-transparent hover:border-green-500/50"
        >
          <ProfileAvatar image={account.image} name={account.username} />
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2">
              <span className="font-semibold">
                {account.name || account.username}
              </span>
              <Badge
                variant="secondary"
                className="text-xs flex items-center gap-1"
              >
                {account.type === "PUBLIC" ? (
                  <Globe className="h-3 w-3" />
                ) : (
                  <Lock className="h-3 w-3" />
                )}
                {account.type.toLowerCase()}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <User className="h-3 w-3" />@{account.username}
            </div>
          </div>
          <span className="text-sm text-primary font-medium">
            {isPending ? "Selecting..." : "Select →"}
          </span>
        </Button>
      </form>
    </>
  );
};

export default SelectAccountForm;
