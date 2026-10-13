import { Skeleton } from "@/components/ui/skeleton";

const AccountCircleSkeleton = () => {
  return (
    <div className="flex flex-col items-center gap-2 p-2 rounded-xl min-w-18 sm:min-w-20 shrink-0">
      {/* Avatar with gradient ring - same structure as actual */}
      <div className="relative">
        {/* Gradient ring placeholder */}
        <div className="absolute inset-0 rounded-full bg-linear-to-tr from-purple-500/20 via-pink-500/20 to-orange-400/20 p-0.5">
          <div className="w-full h-full rounded-full bg-white dark:bg-gray-900" />
        </div>

        {/* Avatar - matches ProfileAvatar default size */}
        <div className="relative p-px">
          <Skeleton className="h-14 w-14 sm:h-16 sm:w-16 rounded-full" />
        </div>

        {/* Online indicator - same position/size */}
        <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-gray-200 dark:bg-gray-700 rounded-full border-2 border-white dark:border-gray-900" />
      </div>

      {/* Username - same text size and width */}
      <Skeleton className="h-4 w-12 sm:w-16 rounded-full" />
    </div>
  );
};

const PaginationSkeleton = () => {
  return (
    <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-gray-100 dark:border-gray-800">
      {/* Items counter - "1-10 of 50" */}
      <Skeleton className="h-3 w-16 rounded-full" />

      {/* Controls */}
      <div className="flex items-center gap-1">
        <Skeleton className="h-7 w-7 rounded-full" />
        <Skeleton className="h-3 w-8 rounded-full" />
        <Skeleton className="h-7 w-7 rounded-full" />
      </div>
    </div>
  );
};

const AccountsScrollBarSkeleton = () => {
  return (
    <div className="w-full max-w-2xl  space-y-4">
      {/* Header - same structure */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-5 w-1 bg-purple-500/50 rounded-full" />
          <Skeleton className="h-4 w-24 rounded-full" />
        </div>
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>

      {/* Scroll Container - same card styling */}
      <div className="bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Accounts row - same padding and gap */}
        <div className="flex gap-1 p-3 overflow-hidden">
          {Array.from({ length: 7 }).map((_, index) => (
            <AccountCircleSkeleton key={index} />
          ))}
        </div>

        {/* Pagination */}
        <PaginationSkeleton />
      </div>
    </div>
  );
};

export default AccountsScrollBarSkeleton;