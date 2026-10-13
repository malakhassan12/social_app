import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UserPlus } from "lucide-react";

interface RequestsSkeletonProps {
  rightPanel?: boolean; // kept for API consistency, not used in skeleton
}

const RequestsSkeleton = ({ rightPanel = false }: RequestsSkeletonProps) => {
  // Number of skeleton items to show
  const skeletonCount = 3;

  return (
    <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-green-500" />
            Friend Requests
            {/* Badge skeleton */}
            <Skeleton className="h-5 w-6 rounded-full" />
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <div
            key={index}
            className="flex flex-wrap items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              {/* Avatar skeleton */}
              <Skeleton className="h-10 w-10 rounded-full" />
              <div>
                {/* Name skeleton */}
                <Skeleton className="h-4 w-24 mb-1.5" />
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Email skeleton */}
                  <Skeleton className="h-3 w-32" />
                  <span className="text-xs text-gray-300 dark:text-gray-600">•</span>
                  {/* Country skeleton with icon placeholder */}
                  <div className="flex items-center gap-0.5">
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {/* Accept button skeleton */}
              <Skeleton className="h-8 w-16 rounded-md" />
              {/* Reject button skeleton */}
              <Skeleton className="h-8 w-16 rounded-md" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RequestsSkeleton;