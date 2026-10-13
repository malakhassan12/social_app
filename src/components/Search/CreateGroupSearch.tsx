"use client";

import { Check, Search, Users } from "lucide-react";
import { Input } from "../ui/input";
import { FC, RefObject } from "react";
import ProfileAvatar from "../Avatar/ProfileAvatar";
import { Account } from "@/types/account.Types";

const CreateGroupSearch: FC<{
  pending: boolean;
  accountId: string;
  allAccounts: Account[];
  search: string;
  onSearchChange: (value: string) => void;
  selected: Set<string>;
  onToggleSelect: (id: string) => void;
  listRef: RefObject<HTMLDivElement | null>;
}> = ({
  pending,
  accountId,
  allAccounts,
  search,
  onSearchChange,
  selected,
  onToggleSelect,
  listRef,
}) => {
  const query = search.trim().toLowerCase();

  const filteredAccounts = allAccounts.filter((acc) => {
    if (acc.id === accountId) return false;
    if (!query) return true;
    return (
      acc.username?.toLowerCase().includes(query) ||
      acc.email.email?.toLowerCase().includes(query)
    );
  });

  return (
    <>
      {/* Search bar */}
      <div className="shrink-0 px-4 sm:px-5 md:px-6 pt-2 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search people..."
            className="pl-9 h-9 sm:h-10 rounded-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-sm"
            disabled={pending}
          />
        </div>
      </div>

      {/* Scrollable list */}
      <div
        ref={listRef}
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-2 sm:px-3 pb-2"
      >
        {filteredAccounts.length === 0 ? (
          <div className="py-10 sm:py-12 md:py-16 text-center">
            <div className="mx-auto h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {search ? "No matches found" : "No accounts available"}
            </p>
          </div>
        ) : (
          <ul className="space-y-0.5">
            {filteredAccounts.map((acc) => {
              const isSelected = selected.has(acc.id);
              return (
                <li key={acc.id}>
                  <button
                    type="button"
                    onClick={() => onToggleSelect(acc.id)}
                    disabled={pending}
                    className={`w-full flex items-center gap-3 px-3 py-2 sm:py-2.5 rounded-lg transition-colors text-left ${
                      isSelected
                        ? "bg-green-50 dark:bg-green-900/20"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }`}
                  >
                    <ProfileAvatar
                      image={acc.image}
                      name={acc.username ?? "User"}
                    />

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {acc.username ?? "Unknown User"}
                      </p>
                      {acc.email && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {acc.email.email}
                        </p>
                      )}
                    </div>

                    <div
                      className={`h-5 w-5 shrink-0 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-green-500 border-green-500"
                          : "border-2 border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3 text-white" />}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
};

export default CreateGroupSearch;