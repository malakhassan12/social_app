// components/NotificationsSkeleton.tsx

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ScrollArea,
  ScrollBar,
} from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, MessageCircle, UserPlus, Sparkles,  } from "lucide-react";

const NotificationsSkeleton = () => {
  const skeletonCount = 3; // number of notification items to show

  return (
    <Tabs defaultValue="ALL" className="w-full">
      <ScrollArea className="w-full whitespace-nowrap flex justify-between rounded-xl bg-gray-100 dark:bg-gray-800/50 p-1">
        <TabsList className="inline-flex w-max bg-transparent p-0">
          {/* ALL tab */}
          <TabsTrigger
            value="ALL"
            className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-[#1a1a2e] transition-all text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
            disabled
          >
            All
            <Skeleton className="ml-1.5 h-4 w-6 rounded-full inline-block" />
          </TabsTrigger>

          {/* LIKE tab */}
          <TabsTrigger
            value="LIKE"
            className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-[#1a1a2e] transition-all text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
            disabled
          >
            <Heart className="h-3.5 w-3.5 mr-1.5 text-red-500" />
            Likes
            <Skeleton className="ml-1 h-4 w-4 rounded-full inline-block" />
          </TabsTrigger>

          {/* COMMENT tab */}
          <TabsTrigger
            value="COMMENT"
            className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-[#1a1a2e] transition-all text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
            disabled
          >
            <MessageCircle className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
            Comments
            <Skeleton className="ml-1 h-4 w-4 rounded-full inline-block" />
          </TabsTrigger>

          {/* FOLLOW tab */}
          <TabsTrigger
            value="FOLLOW"
            className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-[#1a1a2e] transition-all text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
            disabled
          >
            <UserPlus className="h-3.5 w-3.5 mr-1.5 text-green-500" />
            Follows
            <Skeleton className="ml-1 h-4 w-4 rounded-full inline-block" />
          </TabsTrigger>

          {/* PUBLISHED tab */}
          <TabsTrigger
            value="PUBLISHED"
            className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-[#1a1a2e] transition-all text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
            disabled
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5 text-purple-500" />
            Published
            <Skeleton className="ml-1 h-4 w-4 rounded-full inline-block" />
          </TabsTrigger>
        </TabsList>
        <ScrollBar orientation="horizontal" className="h-1.5" />
      </ScrollArea>

      {/* Only the ALL tab content is shown – others can be added if needed */}
      <TabsContent value="ALL" className="mt-3 sm:mt-4 space-y-2">
        <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
          <CardContent className="p-0 divide-y divide-gray-100 dark:divide-gray-800">
            {Array.from({ length: skeletonCount }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 sm:p-4"
              >
                {/* Avatar skeleton */}
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />

                {/* Text blocks */}
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>

                {/* Time skeleton */}
                <Skeleton className="h-3 w-12 shrink-0" />
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Optionally add other TabsContent with the same skeleton for completeness */}
      {["LIKE", "COMMENT", "FOLLOW", "PUBLISHED"].map((tab) => (
        <TabsContent key={tab} value={tab} className="mt-3 sm:mt-4 space-y-2">
          <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-0 divide-y divide-gray-100 dark:divide-gray-800">
              {Array.from({ length: skeletonCount }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 sm:p-4"
                >
                  <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-3 w-12 shrink-0" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default NotificationsSkeleton;