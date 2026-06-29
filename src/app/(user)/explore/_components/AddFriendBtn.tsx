"use client";

import { makeFollow } from "@/actions/Follow/makeFollow";
import { Button } from "@/components/ui/button";
import { FollowResponse } from "@/types/follow.Types";
import { getButtonStyle, getIcon, getText } from "@/utils/makeFollowsThemes";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

const AddFriendBtn = ({
  followingId,
  followStatus,
}: {
  followingId: string;
  followStatus: "PENDING" | "ACCEPTED" | null;
}) => {
  const [status, setStatus] = useState(followStatus);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const handleFollow = () => {
    startTransition(async () => {
      const res = (await makeFollow(followingId)) as FollowResponse;

      if (res.success) {
        setStatus(res.followed ? "PENDING" : null);
        toast.success(res.followed ? "Request sent" : "Unfollowed");
        router.refresh();
      } else {
        toast.error(res?.error?.message);
      }
    });
  };

  return (
    <Button
      disabled={pending}
      onClick={handleFollow}
      className={`w-full mt-3 h-8 gap-1.5 rounded-full text-xs font-medium transition-all duration-300 ${getButtonStyle(
        {
          pending,
          status,
        },
      )} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {pending ? (
        <>
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {getIcon({
            pending,
            status,
          })}
          <span>
            {getText({
              pending,
              status,
            })}
          </span>
        </>
      )}
    </Button>
  );
};

export default AddFriendBtn;
