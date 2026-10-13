"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

const PostSkeleton = () => {
  return (
    <Card
      className=" mb-4 overflow-hidden rounded-2xl border-0 bg-white dark:bg-gray-900 shadow-lg w-full"
      aria-hidden="true"
    >
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2 sm:p-5 sm:pb-3">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          {/* Avatar */}
          <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />

          <div className="min-w-0 flex-1 space-y-2">
            {/* Username */}
            <div className="h-3.5 w-28 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 sm:h-4 sm:w-32" />
            {/* Time + meta row */}
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-12 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
              <div className="h-2.5 w-14 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        </div>

        {/* Action button (menu) */}
        <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
      </CardHeader>

      {/* Content */}
      <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0">
        <div className="space-y-2.5">
          {/* Caption lines */}
          <div className="h-3 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 w-11/12 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 w-3/4 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />

          {/* Media block */}
          <div className="mt-3 h-56 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700 sm:h-64" />
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="block border-t border-gray-100 bg-gray-50/50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/30 sm:px-5 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Left actions: like / comment / share */}
          <div className="flex items-center gap-3">
            <div className="h-5 w-12 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="h-5 w-12 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="h-5 w-12 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
          </div>
          {/* Right action: save / bookmark */}
          <div className="h-5 w-5 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostSkeleton;