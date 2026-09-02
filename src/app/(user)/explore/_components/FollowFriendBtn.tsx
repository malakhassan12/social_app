"use client";

import { makeFollow } from "@/actions/Follow/makeFollow";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {  useTransition } from "react";
import { toast } from "sonner";

const FollowFriendBtn = ({
  followingId,
  existFollow,
}: {
  followingId: string;
  existFollow: boolean;
}) => {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const handleFollow = () => {
    startTransition(async () => {
      const res = (await makeFollow(followingId)) ;

      if (res.success) {
        toast.success('You are make follow successfully !');
        router.refresh();
      } else {
        toast.error(res?.errors?.message);
      }
    });
  };

  return (
    <Button
      disabled={pending }
      onClick={handleFollow}
      className={`w-full mt-3 h-8 gap-1.5 rounded-full text-xs font-medium transition-all duration-300  disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {pending ? (
        <>
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>Loading...</span>
        </>
      ) : (
        <>{existFollow ? "un-follow" : "Follow"}</>
      )}
    </Button>
  );
};

export default FollowFriendBtn;
