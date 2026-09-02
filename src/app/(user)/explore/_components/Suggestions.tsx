import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus,  } from "lucide-react";
import getSuggestions from "@/helper/getSuggestions";
import checkFollowStatus from "@/helper/checkFollowStatus";
import getStatusOfRequest from "@/actions/FollowRequest/getStatusOfRequest";
import { FollowRequestEnum } from "@/types/enum/follow-req.enum";
import SuggestionItem from "./SuggestionsItem";

const Suggestions = async ({ rightPanel = false }: { rightPanel?: boolean }) => {
  const suggestions = await getSuggestions();

  // Fetch follow and request status for all suggestions in parallel
  const suggestionsWithStatus = await Promise.all(
    suggestions.map(async (suggestion) => {
      const [followStatus, requestStatus] = await Promise.all([
        checkFollowStatus(suggestion.id),
        getStatusOfRequest(suggestion.id),
      ]);
      return {
        ...suggestion,
        followStatus: Boolean(followStatus?.status),
        requestStatus: requestStatus.status as FollowRequestEnum,
      };
    })
  );

  const isEmpty = suggestionsWithStatus.length === 0;

  return (
    <Card className="border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-purple-500" />
          Suggested for You
          {!isEmpty && (
            <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full">
              {suggestionsWithStatus.length}
            </span>
          )}
        </CardTitle>
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
                ? "grid grid-cols-1 gap-3"
                : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
            }
          >
            {suggestionsWithStatus.map((suggestion) => (
              <SuggestionItem
                key={suggestion.id}
                suggestion={suggestion}
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