"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SuggestionItem from "../../explore/_components/SuggestionsItem";
import { FollowRequestEnum } from "@/types/enum/follow-req.enum";
import { Account } from "@/types/account.Types";
import { useRouter } from "next/navigation";
import BackBtn from "@/components/Buttons/BackBtn";

const SuggestionPagination: FC<{
  suggestions: (Account & {
    followStatus: boolean;
    requestStatus: FollowRequestEnum;
  })[];
  currentPage: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}> = ({ 
  suggestions, 
  currentPage,
  total,
  totalPages,
  hasNextPage,
  hasPreviousPage
}) => {
  const router = useRouter();
  const itemsPerPage = 8;

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    router.push(`/suggestions?page=${page}`);
  };

  const nextPage = () => {
    if (hasNextPage) {
      goToPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (hasPreviousPage) {
      goToPage(currentPage - 1);
    }
  };

  if (suggestions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-6xl mb-4">👤</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No suggestions available
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Check back later for new suggestions
        </p>
      </div>
    );
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, total);

  return (
    <div className="space-y-6">
      {/* Back Button & Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BackBtn />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Suggestions
          </h1>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {total} suggestions
        </span>
      </div>

      {/* Suggestions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {suggestions.map((suggestion) => (
          <SuggestionItem
            key={suggestion.id}
            suggestion={suggestion}
            followStatus={suggestion.followStatus}
            requestStatus={suggestion.requestStatus}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400 order-2 sm:order-1">
            Showing <span className="font-medium text-gray-700 dark:text-gray-300">{startItem}</span> -{' '}
            <span className="font-medium text-gray-700 dark:text-gray-300">{endItem}</span> of{' '}
            <span className="font-medium text-gray-700 dark:text-gray-300">{total}</span>
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

            <span className="text-sm text-gray-500 dark:text-gray-400 px-2">
              {currentPage} / {totalPages}
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
      )}
    </div>
  );
};

export default SuggestionPagination;