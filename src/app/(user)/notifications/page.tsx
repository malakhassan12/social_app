import { Metadata } from "next";
import { FC, Suspense } from "react";
import NotificationsContent from "./_components/NotificationContent";
import NotificationsSkeleton from "@/components/Skelton/NotificationSkelton";

export const metadata: Metadata = {
  title: "Notifications page",
  description: "Your personalized Circle feed.",
  robots: {
    index: false,
    follow: false,
  },
};

const Page: FC<{
  searchParams: Promise<{
    page?: string;
  }>;
}> = async ({ searchParams }) => {
  return (
    <div className="max-w-3xl mx-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Notifications
          </h1>
        </div>
      </div>

      <Suspense fallback={<NotificationsSkeleton />}>
        <NotificationsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default Page;
