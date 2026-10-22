import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, UserPlus } from "lucide-react";
import getSuggestions, {
  SuggestionAccount,
} from "@/helper/suggestion/getSuggestions";
import checkFollowStatus from "@/helper/follow/checkFollowStatus";
import getStatusOfRequest from "@/helper/friend/getStatusOfRequest";
import { FollowRequestEnum } from "@/types/enum/follow-req.enum";
import SuggestionItem from "./SuggestionsItem";
import { Account } from "@/types/account.Types";
import { getAccountId } from "@/helper/account/getAccountId";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Suggestions = async ({
  rightPanel = false,
}: {
  rightPanel?: boolean;
}) => {
  const accountId = await getAccountId();
  const { suggestions } = await getSuggestions(accountId as string);

  // Fetch follow and request status for all suggestions in parallel
  const suggestionsWithStatus = await Promise.all(
    suggestions.map(async (suggestion: SuggestionAccount) => {
      const [followStatus, requestStatus] = await Promise.all([
        checkFollowStatus(suggestion.id, accountId as string),
        getStatusOfRequest(suggestion.id, accountId as string),
      ]);
      return {
        ...suggestion,
        followStatus: Boolean(followStatus?.status),
        requestStatus: requestStatus.status as FollowRequestEnum,
      };
    }),
  );

  const isEmpty = suggestionsWithStatus.length === 0;

  return (
    <Card
      className={`overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-xl shadow-black/[0.06] dark:border-white/[0.06] dark:bg-[#0f0d18] dark:shadow-black/40 ${
        rightPanel ? "" : "hover:shadow-2xl hover:shadow-black/[0.10] dark:hover:shadow-black/60"
      } transition-shadow duration-300`}
    >
      <CardHeader className="border-b border-black/[0.06] px-4 pb-3 pt-4 sm:px-6 sm:pt-5 dark:border-white/[0.08]">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex min-w-0 items-center gap-2 text-base font-semibold text-[#1a1e2b] sm:text-lg dark:text-[#f4ede4]">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-rose-400/10 text-rose-600 dark:bg-rose-300/10 dark:text-rose-300">
              <UserPlus className="h-4 w-4" />
            </span>
            <span className="truncate">Suggested for You</span>
            
          </CardTitle>

          {!isEmpty && !rightPanel && (
            <Link href="/suggestions">
              <Button
                variant="ghost"
                size="sm"
                className="group h-8 shrink-0 rounded-full px-3 text-xs font-medium text-rose-600 transition-all duration-200 hover:bg-rose-400/10 hover:text-rose-700 dark:text-rose-300 dark:hover:bg-rose-300/10 dark:hover:text-rose-200"
              >
                Show All
                <ChevronRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
          )}
        </div>
      </CardHeader>

      <CardContent className={rightPanel ? "p-3 sm:p-4" : "p-4 sm:p-6"}>
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-10 text-center sm:py-12">
            <span className="mb-3 grid size-14 place-items-center rounded-full bg-rose-400/10 ring-1 ring-inset ring-rose-400/20 dark:bg-rose-300/10 dark:ring-rose-300/20">
              <UserPlus className="h-6 w-6 text-rose-500 dark:text-rose-300" />
            </span>
            <p className="text-sm font-semibold text-[#1a1e2b] dark:text-[#f4ede4]">
              No suggestions available
            </p>
            <p className="mt-1 max-w-xs text-xs text-[#1a1e2b]/55 dark:text-[#f4ede4]/55">
              Check back later for new people to follow
            </p>
          </div>
        ) : (
          <div
            className={
              rightPanel
                ? "flex flex-col gap-3"
                : "grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 2xl:grid-cols-4"
            }
          >
            {suggestionsWithStatus.map((suggestion) => (
              <SuggestionItem
                key={suggestion.id}
                suggestion={suggestion as unknown as Account}
                rightPanel={rightPanel}
                followStatus={suggestion.followStatus}
                requestStatus={suggestion.requestStatus}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Suggestions;