import Requests from "./_components/Requests";
import Suggestions from "./_components/Suggestions";
import { Metadata } from "next";
import { Suspense } from "react";
import SuggestionsSkeleton from "@/components/Skelton/SuggestionsSkeleton";
import RequestsSkeleton from "@/components/Skelton/requestsSkelton";

export const metadata: Metadata = {
  title: "Explore page",
};

const Page = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Explore
        </h1>
      </div>

      {/* Friend Requests */}
      <Suspense fallback={<RequestsSkeleton />}>
        <Requests />
      </Suspense>

      {/* Suggested Friends */}

      <Suspense fallback={<SuggestionsSkeleton />}>
        <Suggestions  />
      </Suspense>
    </div>
  );
};

export default Page;
