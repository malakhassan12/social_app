"use client";

import { acceptFollowRequest } from "@/actions/FollowRequest/acceptFollowRequest";
import { Button } from "@/components/ui/button";
import { UserCheck, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const AcceptFollowBtn = ({ followerId }: { followerId: string }) => {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const handleAccept = () => {
    startTransition(async () => {
      const res = await acceptFollowRequest(followerId);

      if (res.success) {
        toast.success("Follow request accepted", {
          position: "top-center",
        });
        router.refresh();
      } else {
        toast.error(res.error?.message || "Something went wrong");
      }
    });
  };

  return (
    <Button
      onClick={handleAccept}
      disabled={pending}
      size="sm"
      aria-label={pending ? "Accepting follow request" : "Accept follow request"}
      className="group h-8 gap-1 rounded-full bg-gradient-to-r from-rose-400 via-orange-400 to-amber-300 px-3 font-semibold text-[#1a1e2b] shadow-[0_4px_12px_-4px_rgba(251,113,133,0.6)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_-6px_rgba(251,146,60,0.7)] hover:brightness-105 active:translate-y-0 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:brightness-100 dark:text-[#0b0a12] dark:shadow-[0_4px_12px_-4px_rgba(251,113,133,0.7)] dark:hover:shadow-[0_6px_16px_-6px_rgba(251,146,60,0.85)]"
    >
      {pending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
      ) : (
        <UserCheck
          className="h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110"
          aria-hidden="true"
        />
      )}
      <span className="text-xs">{pending ? "Accepting" : "Accept"}</span>
    </Button>
  );
};

export default AcceptFollowBtn;