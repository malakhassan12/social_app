import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const CardSkeleton = () => {
  return (
    <Card className="border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      {/* Cover Image */}
      <Skeleton className="w-full h-20 rounded-none" />

      <CardHeader className="relative pt-0 flex flex-col items-center">
        {/* Avatar */}
        <div className="-mt-10 mb-2">
          <Skeleton className="h-20 w-20 rounded-full ring-4 ring-white dark:ring-[#1a1a2e]" />
        </div>

        {/* Name & Info */}
        <div className="text-center w-full space-y-2">
          <Skeleton className="h-5 w-32 mx-auto" />
          <Skeleton className="h-3 w-48 mx-auto" />
          <Skeleton className="h-3 w-24 mx-auto" />
        </div>

        {/* Bio */}
        <div className="mt-3 w-full space-y-1.5">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4 mx-auto" />
        </div>
      </CardHeader>

      {/* Stats */}
      <CardContent className="pb-4 pt-2">
        <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-gray-100 dark:border-gray-800">
          <div className="text-center space-y-1.5">
            <Skeleton className="h-6 w-8 mx-auto" />
            <Skeleton className="h-3 w-12 mx-auto" />
          </div>
          <div className="text-center space-y-1.5 border-l border-r border-gray-100 dark:border-gray-800">
            <Skeleton className="h-6 w-8 mx-auto" />
            <Skeleton className="h-3 w-12 mx-auto" />
          </div>
          <div className="text-center space-y-1.5">
            <Skeleton className="h-6 w-8 mx-auto" />
            <Skeleton className="h-3 w-12 mx-auto" />
          </div>
        </div>

        {/* Edit Button */}
        <div className="mt-4">
          <Skeleton className="h-9 w-full rounded-xl" />
        </div>
      </CardContent>
    </Card>
  );
};

export default CardSkeleton;