import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type Props = {
  notificationId: string;
  onDelete: (notificationId: string) => void;
};

const DeleteNotificationBtn = ({
  notificationId,
  onDelete,
}: Props) => {
  return (
    <Button
      onClick={() => onDelete(notificationId)}
      variant="ghost"
      size="icon"
      className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <X className="h-4 w-4 text-gray-400" />
    </Button>
  );
};

export default DeleteNotificationBtn;