"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const PaginationAccounts: FC<{
  currentPage: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}> = ({
  currentPage,
  limit,
  total,
  totalPages,
  hasNextPage,
  hasPreviousPage,
}) => {
  const router = useRouter();

  const goToPage = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages || pageNumber === currentPage) return;
    const params = new URLSearchParams(window.location.search);
    params.set("page", pageNumber.toString());
    router.push(`?${params.toString()}`);
  };


  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, total);

  return (
    <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-gray-100 dark:border-gray-800">
      <div className="text-xs text-gray-500 dark:text-gray-400">
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {startItem}-{endItem}
        </span>{" "}
        of{" "}
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {total}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => goToPage(currentPage - 1)}
          disabled={!hasPreviousPage}
          className="h-7 w-7 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <span className="text-xs text-gray-500 dark:text-gray-400 px-1 min-w-8 text-center">
          {currentPage}/{totalPages}
        </span>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => goToPage(currentPage + 1)}
          disabled={!hasNextPage}
          className="h-7 w-7 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PaginationAccounts;