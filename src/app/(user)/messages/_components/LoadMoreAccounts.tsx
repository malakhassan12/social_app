"use client";

import { Loader2 } from "lucide-react";
import { FC } from "react";

const LoadMoreAccounts: FC<{
  search: string;
  pending: boolean;
  isLoadingMore: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
}> = ({ search, pending, isLoadingMore, hasNextPage, onLoadMore }) => {
  // Hide while searching — search filters already-loaded accounts
  if (search) return null;

  return (
    <div className="py-3 flex justify-center shrink-0">
      {isLoadingMore ? (
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Loading more...
        </div>
      ) : hasNextPage ? (
        <button
          type="button"
          onClick={onLoadMore}
          disabled={pending}
          className="text-xs font-medium text-green-600 dark:text-green-400 hover:underline disabled:opacity-50"
        >
          Load more
        </button>
      ) : (
        <p className="text-[11px] text-gray-400 dark:text-gray-500">
          No more accounts
        </p>
      )}
    </div>
  );
};

export default LoadMoreAccounts;