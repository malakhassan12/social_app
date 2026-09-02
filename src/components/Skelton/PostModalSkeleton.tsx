import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const PostModalSkeleton = () => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="bg-white dark:bg-[#1a1a2e] rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar:none]">
          {/* Post content */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>

          {/* Social buttons */}
          <div className="flex items-center gap-4 pt-2">
            <Skeleton className="h-8 w-16 rounded-full" />
            <Skeleton className="h-8 w-16 rounded-full" />
            <Skeleton className="h-8 w-16 rounded-full" />
          </div>

          {/* Comments section */}
          <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>

            {/* Comment items */}
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-[80%]" />
                  </div>
                </div>
              ))}
            </div>

            {/* Comment input */}
            <div className="flex items-center gap-2 pt-2">
              <Skeleton className="h-10 flex-1 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PostModalSkeleton;