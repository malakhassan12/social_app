"use client";

import { FC, useState } from "react";
import FollowModal from "./FollowModal";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, UserPlus,  } from "lucide-react";
import { useRouter } from "next/navigation";

const FollowingsContent: FC<{
  currentPage: number | string;
  children: React.ReactNode;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  profileId: string;
}> = ({
  currentPage,
  total,
  children,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  profileId,
}) => {
  const router = useRouter();
  const [isFollowingsOpen, setIsFollowingsOpen] = useState(false);
  const page = Number(currentPage);

  const goToPage = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages || pageNumber === page)
      return;
    const params = new URLSearchParams(window.location.search);
    params.set("pageFollowings", pageNumber.toString());
    router.push(`/profile/${profileId}?${params.toString()}`);
  };

  const nextPage = () => {
    if (hasNextPage) {
      goToPage(page + 1);
    }
  };

  const prevPage = () => {
    if (hasPreviousPage) {
      goToPage(page - 1);
    }
  };

  const startItem = (page - 1) * 10 + 1;
  const endItem = Math.min(page * 10, total);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsFollowingsOpen(true)}
        className="group relative flex items-center gap-4 w-full sm:w-auto px-4 py-3 rounded-2xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all duration-200"
      >
        <div className="relative">
          <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
            <UserPlus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center shadow-lg">
            {total}
          </span>
        </div>
        <div className="text-left">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
            Following
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            View all following
          </p>
        </div>
      </button>

      <FollowModal
        isOpen={isFollowingsOpen}
        onClose={() => setIsFollowingsOpen(false)}
        title="Followings"
        count={total}
        pagination={
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
            <div className="text-sm text-gray-500 dark:text-gray-400 order-2 sm:order-1">
              Showing{" "}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {startItem}
              </span>{" "}
              -{" "}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {endItem}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {total}
              </span>
            </div>

            <div className="flex items-center gap-2 order-1 sm:order-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevPage}
                disabled={!hasPreviousPage}
                className="h-8 px-3 rounded-md text-sm gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <span className="text-sm text-gray-500 dark:text-gray-400 px-2 min-w-16 text-center">
                {page} / {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={nextPage}
                disabled={!hasNextPage}
                className="h-8 px-3 rounded-md text-sm gap-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-1.5 sm:space-y-2">{children}</div>
      </FollowModal>

      {/* Pagination UI */}
    </>
  );
};

export default FollowingsContent;
