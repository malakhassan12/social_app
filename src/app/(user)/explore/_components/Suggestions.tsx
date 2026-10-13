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
    <Card className="border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-purple-500" />
            Suggested for You
            {!isEmpty && (
              <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full">
                {suggestionsWithStatus.length}
              </span>
            )}
          </CardTitle>

          {!isEmpty && !rightPanel && (
            <Link href="/suggestions">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-full px-3 h-8 transition-all duration-200"
              >
                Show All
                <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="text-center py-12">
            <UserPlus className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-400 dark:text-gray-500">
              No suggestions available
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Check back later for new people to follow
            </p>
          </div>
        ) : (
          <div
            className={
              rightPanel
                ? "flex flex-col gap-3"
                : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4"
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
