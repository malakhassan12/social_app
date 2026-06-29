import { Clock, UserCheck, UserPlus } from "lucide-react";

const getButtonStyle = ({
  pending,
  status,
}: {
  pending: boolean;
  status: string | null;
}) => {
  if (pending)
    return "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 cursor-wait";
  if (status === "ACCEPTED")
    return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50";
  if (status === "PENDING")
    return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50";
  return "bg-green-400 hover:bg-green-500 text-white shadow-sm hover:shadow-md hover:scale-105 active:scale-95";
};

const getIcon = ({
  pending,
  status,
}: {
  pending: boolean;
  status: string | null;
}) => {
  if (pending) return null;
  if (status === "ACCEPTED") return <UserCheck className="h-3.5 w-3.5" />;
  if (status === "PENDING") return <Clock className="h-3.5 w-3.5" />;
  return <UserPlus className="h-3.5 w-3.5" />;
};

const getText = ({
  pending,
  status,
}: {
  pending: boolean;
  status: string | null;
}) => {
  if (pending) return "Loading...";
  if (status === "ACCEPTED") return "Following";
  if (status === "PENDING") return "Requested";
  return "Add Friend";
};

export { getButtonStyle, getIcon, getText };
