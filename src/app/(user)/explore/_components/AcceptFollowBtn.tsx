"use client";

import { acceptFollow } from "@/actions/Follow/acceptFollow";
import { Button } from "@/components/ui/button";
import { UserCheck } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const AcceptFollowBtn = ({
  followerId,
}: {
  followerId: string;
}) => {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const handleAccept = () => {
    startTransition(async () => {
      const res = await acceptFollow(followerId);

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
      className="h-8 px-3 gap-1 bg-green-400 hover:bg-green-500 text-white rounded-full transition-all hover:scale-105 active:scale-95"
    >
      <UserCheck className="h-3.5 w-3.5" />

      <span className="text-xs">
        {pending ? "..." : "Accept"}
      </span>

    </Button>
  );
};

export default AcceptFollowBtn;