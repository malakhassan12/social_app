"use client";

import createFollowRequest from "@/actions/FollowRequest/createFollowRequest";
import { FollowRequestEnum } from "@/types/enum/follow-req.enum";
import { useRouter } from "next/navigation";
import { FC, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getButtonStyle, getIcon, getText } from "@/utils/makeFollowsThemes";

type AddFriendProp = {
  friendShipStatus: FollowRequestEnum;
  followingId: string;
};

const AddFriendBtn: FC<AddFriendProp> = ({ friendShipStatus, followingId }) => {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const handleRequestFollow = () => {
    startTransition(async () => {
      const res = await createFollowRequest(followingId);

      if (res.success) {
        // Show appropriate toast message based on previous status
        const message =
          friendShipStatus === FollowRequestEnum.NOT_EXIST
            ? "Request sent successfully"
            : "Unfollowed successfully";
        toast.success(message);
        router.refresh(); // refresh to get the new status from server
      } else {
        toast.error(res?.errors?.message || "Something went wrong");
      }
    });
  };

  // Determine style, icon, text based on current status and pending
  const buttonStyle = getButtonStyle({ pending, status: friendShipStatus });
  const icon = getIcon({ pending, status: friendShipStatus });
  const text = getText({ pending, status: friendShipStatus });

  return (
    <Button
      onClick={handleRequestFollow}
      disabled={pending}
      className={`
    px-2 sm:px-3 py-1 sm:py-1.5 
    text-[10px] sm:text-xs font-medium 
    rounded-full transition-all duration-200 
    ${buttonStyle}
  `}
    >
      {icon && <span className="mr-1">{icon}</span>}
      <span className="p-1">{text}</span>
    </Button>
  );
};

export default AddFriendBtn;
