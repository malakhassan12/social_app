"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const PostsSection: FC<{
  currentPage: string | number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  children?: React.ReactNode;
  profileId: string | undefined;
}> = ({
  currentPage,
  total,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  children,
  profileId
}) => {
  const router = useRouter();
  const page = Number(currentPage);

  const goToPage = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages || pageNumber === page)
      return;
    const params = new URLSearchParams(window.location.search);
    params.set("pagePosts", pageNumber.toString());
    router.push(`/profile/${profileId}?${params.toString()}`);
  };

  const startItem = (page - 1) * 10 + 1;
  const endItem = Math.min(page * 10, total);

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No posts yet
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Posts will appear here when available
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Posts Grid */}
      <div className="space-y-3">{children}</div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
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
              onClick={() => goToPage(page - 1)}
              disabled={!hasPreviousPage}
              className="h-8 px-3 rounded-md text-sm gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>

            <span className="text-sm text-gray-500 dark:text-gray-400 px-2 min-w-16 text-center">
              {page} / {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(page + 1)}
              disabled={!hasNextPage}
              className="h-8 px-3 rounded-md text-sm gap-1"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsSection;
