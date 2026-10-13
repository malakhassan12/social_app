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
        const message =
          friendShipStatus === FollowRequestEnum.NOT_EXIST
            ? "Request sent successfully"
            : "Un-friendship successfully";
        toast.success(message);
        router.refresh();
      } else {
        toast.error(res?.errors?.message || "Something went wrong");
      }
    });
  };

  // Get status info using utility functions
  const buttonStyle = getButtonStyle({ pending, status: friendShipStatus });
  const icon = getIcon({ pending, status: friendShipStatus });
  const text = getText({ pending, status: friendShipStatus });

  return (
    <Button
      onClick={handleRequestFollow}
      disabled={pending}
      size="sm"
      className={`${buttonStyle} w-fit`}
    >
      <div className="flex items-center gap-2">
        {icon && <span className="shrink-0">{icon}</span>}

        <span className="whitespace-nowrap">{text}</span>
      </div>
    </Button>
  );
};

export default AddFriendBtn;
