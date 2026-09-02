import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const SelectAccountSkeleton = () => {
  const accountCount = 3; // number of account placeholders

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md border-green-500 border-2 shadow-xl">
        <CardHeader className="text-center">
          {/* Title */}
          <Skeleton className="h-7 w-48 mx-auto" />
          {/* Description */}
          <Skeleton className="h-4 w-64 mx-auto mt-2" />
        </CardHeader>

        <CardContent className="space-y-4">
          {Array.from({ length: accountCount }).map((_, index) => (
            <div
              key={index}
              className="w-full h-auto p-4 flex items-center gap-4 rounded-xl border-2 border-transparent"
            >
              {/* Avatar skeleton */}
              <Skeleton className="h-12 w-12 rounded-full shrink-0" />

              <div className="flex-1 text-left space-y-2">
                {/* Name + Badge row */}
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                {/* Username with icon */}
                <div className="flex items-center gap-1">
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>

              {/* "Select →" arrow */}
              <Skeleton className="h-4 w-14" />
            </div>
          ))}

          {/* Footer link */}
          <div className="pt-2 text-center">
            <Skeleton className="h-4 w-40 mx-auto" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SelectAccountSkeleton;