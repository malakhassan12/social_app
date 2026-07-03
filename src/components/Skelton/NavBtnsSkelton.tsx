import { Skeleton } from "@/components/ui/skeleton";

const NavBtnsSkeleton = () => {
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {/* Mode Toggle */}
      <Skeleton className="h-8 w-8 sm:h-9 sm:w-9 rounded-full" />

      {/* Notifications with dot */}
      <div className="relative">
        <Skeleton className="h-8 w-8 sm:h-9 sm:w-9 rounded-full" />
        <Skeleton className="absolute -top-0.5 -right-0.5 h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full" />
      </div>

      {/* Profile Avatar */}
      <Skeleton className="h-8 w-8 sm:h-9 sm:w-9 rounded-full ring-2 ring-gray-200 dark:ring-gray-700" />
    </div>
  );
};

export default NavBtnsSkeleton;