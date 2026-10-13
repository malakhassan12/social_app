"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface PostsPaginationProps {
  currentPage: number | string;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const PostsPagination: FC<PostsPaginationProps> = ({
  currentPage,
  limit,
  total,
  totalPages,
  hasNextPage,
  hasPreviousPage,
}) => {
  const router = useRouter();
  const page = Number(currentPage);

  const goToPage = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages || pageNumber === page) return;
    const params = new URLSearchParams(window.location.search);
    params.set("page", pageNumber.toString());
    router.push(`/?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
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
  );
};

export default PostsPagination;