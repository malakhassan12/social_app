import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const ProfileContentSkeleton = () => {
  const feedItemCount = 3; // number of placeholder posts/shares

  return (
    <>
      {/* ===== ShowFollow Skeleton ===== */}
      <div className="mb-6 flex flex-col items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
        {/* Avatar */}
        <Skeleton className="h-20 w-20 rounded-full" />

        {/* Name */}
        <Skeleton className="h-6 w-40" />

        {/* Bio / handle */}
        <Skeleton className="h-4 w-56" />

        {/* Stats (followers, following, posts) */}
        <div className="flex items-center gap-8 mt-2">
          <div className="text-center">
            <Skeleton className="h-5 w-8 mx-auto" />
            <Skeleton className="h-3 w-12 mt-1" />
          </div>
          <div className="text-center">
            <Skeleton className="h-5 w-8 mx-auto" />
            <Skeleton className="h-3 w-12 mt-1" />
          </div>
          <div className="text-center">
            <Skeleton className="h-5 w-8 mx-auto" />
            <Skeleton className="h-3 w-12 mt-1" />
          </div>
        </div>

        {/* Follow button (if any) */}
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>

      {/* ===== Activity Feed Skeleton ===== */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>

        <div className="space-y-4">
          {Array.from({ length: feedItemCount }).map((_, index) => (
            <Card
              key={index}
              className="border border-gray-200 dark:border-gray-800 shadow-sm"
            >
              <CardContent className="p-4 space-y-3">
                {/* Header: avatar + name + time */}
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-20 mt-1" />
                  </div>
                  <Skeleton className="h-3 w-12" />
                </div>

                {/* Content text */}
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />

                {/* Optional image/video placeholder */}
                <Skeleton className="h-40 w-full rounded-lg" />

                {/* Action buttons (like, comment, share) */}
                <div className="flex items-center gap-6 pt-2">
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-5 w-12" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
};

export default ProfileContentSkeleton;