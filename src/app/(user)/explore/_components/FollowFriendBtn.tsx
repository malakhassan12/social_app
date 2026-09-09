"use client";

import { makeFollow } from "@/actions/Follow/makeFollow";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { getButtonFollowStyles } from "@/utils/makeFollowsThemes";

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
      const res = (await makeFollow(followingId));

      if (res.success) {
        toast.success(existFollow ? 'Unfollowed successfully!' : 'Followed successfully!');
        router.refresh();
      } else {
        toast.error(res?.errors?.message || 'Something went wrong');
      }
    });
  };

  // Get button styles based on state


  const styles = getButtonFollowStyles({pending , existFollow});

  return (
    <Button
      disabled={pending}
      onClick={handleFollow}
      size="sm"
      className={`
        group relative inline-flex items-center justify-center gap-1.5 
        px-3 py-1.5 text-xs font-medium 
        rounded-full transition-all duration-200 
        whitespace-nowrap
        ${styles.className}
        ${pending ? "cursor-not-allowed" : ""}
      `}
    >
      {styles.icon}
      <span>{styles.text}</span>
    </Button>
  );
};

export default FollowFriendBtn;