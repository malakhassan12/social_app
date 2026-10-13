import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CreatePostBarSkeleton = () => (
  <Card
    className="min-h-[22rem] overflow-hidden rounded-2xl border-0 shadow-xl sm:min-h-[19rem]"
    aria-hidden="true"
  >
    <CardContent className="p-0">
      <div className="flex items-center gap-3 border-b border-gray-100 px-4 pb-3 pt-4 sm:px-6 sm:pb-3 sm:pt-5">
        <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>

      <div className="px-4 pb-2 pt-4 sm:px-6">
        <Skeleton className="h-20 w-full rounded-xl sm:h-15" />
      </div>

      <div className="flex justify-end px-4 pb-2 sm:px-6">
        <Skeleton className="h-4 w-12" />
      </div>

      <div className="px-4 pb-3 sm:px-6">
        <div className="flex h-11 items-center gap-2 rounded-xl bg-gray-50 px-2 dark:bg-gray-800/50">
          <Skeleton className="h-7 w-16 rounded-full" />
          <Skeleton className="hidden h-7 w-16 rounded-full sm:block" />
          <Skeleton className="hidden h-7 w-20 rounded-full sm:block" />
          <div className="flex-1" />
          <Skeleton className="h-9 w-20 rounded-full" />
        </div>
      </div>

      <div className="flex min-h-20 flex-col items-start justify-between gap-3 border-t border-gray-100 px-4 pb-4 pt-3 sm:min-h-16 sm:flex-row sm:items-center sm:px-6 sm:pb-5">
        <Skeleton className="h-9 w-32 rounded-full" />
        <Skeleton className="h-9 w-28 rounded-full" />
      </div>
    </CardContent>
  </Card>
);

export default CreatePostBarSkeleton;
