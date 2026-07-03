import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const SuggestionsSkeleton = ({
  rightPanel = false,
}: {
  rightPanel?: boolean;
}) => {
  const count = rightPanel ? 3 : 6;
  const skeletonItems = Array.from({ length: count }, (_, index) => ({
    id: `suggestion-skeleton-${index}`,
  }));

  return (
    <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-8 rounded-full" />
        </div>
      </CardHeader>
      <CardContent>
        <div
          className={
            rightPanel
              ? "grid grid-cols-1 gap-3"
              : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
          }
        >
          {skeletonItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center p-4 rounded-xl border border-gray-100 dark:border-gray-800"
            >
              <Skeleton className="h-16 w-16 rounded-full" />
              <Skeleton className="h-4 w-24 mt-2" />
              <Skeleton className="h-3 w-32 mt-1" />
              <Skeleton className="h-3 w-20 mt-0.5" />
              <Skeleton className="h-8 w-full mt-3 rounded-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SuggestionsSkeleton;
