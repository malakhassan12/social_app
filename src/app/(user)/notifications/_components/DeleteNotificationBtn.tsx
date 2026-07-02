"use client";
import { deleteNoti } from "@/actions/notification/deleteNotification";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";

const DeleteNotificationBtn = ({
  notificationId,
}: {
  notificationId: string;
}) => {
  const handleClick = async () => {
    const res = await deleteNoti(notificationId);

    if (res?.success) {
      toast.success("Success", {
        description: res?.message,
        position: "top-center",
      });
    } else {
      toast.error(res?.message, { position: "top-center" });
    }
  };
  return (
    <Button
      onClick={handleClick}
      variant="ghost"
      size="icon"
      className="h-7 w-7 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <X className="h-4 w-4 text-gray-400" />
    </Button>
  );
};

export default DeleteNotificationBtn;
