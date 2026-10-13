"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { toast } from "sonner";
import { X } from "lucide-react";

import { Account } from "@/types/account.Types";

import CreateGroupSearch from "@/components/Search/CreateGroupSearch";

import LoadMoreAccounts from "./LoadMoreAccounts";

import { loadMoreAccounts } from "@/actions/chat/loadMoreAccounts";

interface SelectParticipantProps {
  accountId: string;

  initialAccounts: Account[];

  initialPage: number;

  initialHasNextPage: boolean;

  selected: Set<string>;

  setSelected: React.Dispatch<React.SetStateAction<Set<string>>>;

  pending: boolean;
}

export default function SelectParticipant({
  accountId,
  initialAccounts,
  initialPage,
  initialHasNextPage,
  selected,
  setSelected,
  pending,
}: SelectParticipantProps) {
  // =====================================================
  // State
  // =====================================================

  const [search, setSearch] = useState("");
  const [allAccounts, setAllAccounts] = useState<Account[]>(initialAccounts);

  const [page, setPage] = useState<number>(Number(initialPage));

  const [hasNextPage, setHasNextPage] = useState<boolean>(initialHasNextPage);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);

  // =====================================================
  // Sync when parent props change
  // =====================================================

  // =====================================================
  // Selection
  // =====================================================

  const toggleSelect = useCallback(
    (id: string) => {
      setSelected((prev) => {
        const next = new Set(prev);

        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }

        return next;
      });
    },
    [setSelected],
  );

  // =====================================================
  // Load more
  // =====================================================

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasNextPage) {
      return;
    }

    setIsLoadingMore(true);

    try {
      const nextPage = page + 1;

      const res = await loadMoreAccounts(nextPage, accountId);

      const newAccounts = res.accounts as unknown as Account[];

      setAllAccounts((prev) => {
        const seen = new Set(prev.map((account) => account.id));

        const fresh = newAccounts.filter((account) => !seen.has(account.id));

        return [...prev, ...fresh];
      });

      setPage(nextPage);

      setHasNextPage(Boolean(res.hasNextPage));
    } catch (error) {
      console.error("Failed to load more accounts:", error);

      toast.error("Failed to load more accounts");
    } finally {
      setIsLoadingMore(false);
    }
  }, [accountId, page, hasNextPage, isLoadingMore]);

  // =====================================================
  // Scroll listener
  // =====================================================

  useEffect(() => {
    const element = listRef.current;

    if (!element) {
      return;
    }

    const handleScroll = () => {
      const distanceFromBottom =
        element.scrollHeight - element.scrollTop - element.clientHeight;

      if (distanceFromBottom < 120 && !isLoadingMore && hasNextPage) {
        void loadMore();
      }
    };

    element.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      element.removeEventListener("scroll", handleScroll);
    };
  }, [loadMore, isLoadingMore, hasNextPage]);

  // =====================================================
  // Selected accounts
  // =====================================================

  const selectedAccounts = useMemo(
    () => allAccounts.filter((account) => selected.has(account.id)),
    [allAccounts, selected],
  );

  // =====================================================
  // Render
  // =====================================================

  return (
    <>
      {/* =================================================
          Selected chips
         ================================================= */}

      {selectedAccounts.length > 0 && (
        <div className="shrink-0 px-4 sm:px-5 md:px-6 pb-2 flex flex-wrap gap-1.5 max-h-20 sm:max-h-24 overflow-y-auto">
          {selectedAccounts.map((acc) => (
            <span
              key={acc.id}
              className="
                inline-flex
                items-center
                gap-1
                pl-2
                pr-1
                py-0.5
                rounded-full
                bg-green-50
                dark:bg-green-900/20
                border
                border-green-200
                dark:border-green-800
                text-xs
                text-green-700
                dark:text-green-300
              "
            >
              <span className="truncate">{acc.username ?? "User"}</span>

              <button
                type="button"
                onClick={() => toggleSelect(acc.id)}
                disabled={pending}
                className="
                  h-4
                  w-4
                  rounded-full
                  shrink-0
                  flex
                  items-center
                  justify-center
                  hover:bg-green-200
                  dark:hover:bg-green-800
                  transition-colors
                "
                aria-label={`Remove ${acc.username ?? "user"}`}
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* =================================================
          Search + account list
         ================================================= */}

      <CreateGroupSearch
        pending={pending}
        accountId={accountId}
        allAccounts={allAccounts}
        search={search}
        onSearchChange={setSearch}
        selected={selected}
        onToggleSelect={toggleSelect}
        listRef={listRef}
      />

      {/* =================================================
          Load more
         ================================================= */}

      <LoadMoreAccounts
        search={search}
        pending={pending}
        isLoadingMore={isLoadingMore}
        hasNextPage={hasNextPage}
        onLoadMore={loadMore}
      />
    </>
  );
}
