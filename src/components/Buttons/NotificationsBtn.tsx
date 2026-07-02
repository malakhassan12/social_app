import Link from "next/link";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const NotificationsBtn = ({ count = 0 }: { count?: number }) => {
  return (
    <Link
      href="/notifications"
      className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
      aria-label="Notifications"
    >
      <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      
      {count > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] px-1 text-[9px] font-bold rounded-full flex items-center justify-center"
        >
          {count > 99 ? '99+' : count}
        </Badge>
      )}
    </Link>
  );
};

export default NotificationsBtn;