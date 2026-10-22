import getStatusOfRequest from "@/helper/friend/getStatusOfRequest";
import checkFollowStatus from "@/helper/follow/checkFollowStatus";
import { getAccountId } from "@/helper/account/getAccountId";
import getSuggestions, {
  PaginatedSuggestions,
  SuggestionAccount,
} from "@/helper/suggestion/getSuggestions";
import { FollowRequestEnum } from "@/types/enum/follow-req.enum";
import SuggestionPagination from "./_components/SuggestionPagination";
import { Account } from "@/types/account.Types";
import { Suspense } from "react";
import SuggestionsSkeleton from "@/components/Skelton/SuggestionsSkeleton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Suggestions | Circle",
  description: "Your personalized Circle feed.",
  robots: {
    index: false,
    follow: false,
  },
};

const Page = ({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}) => {
  return (
    <Suspense fallback={<SuggestionsSkeleton />}>
      <Suggestions searchParams={searchParams} />
    </Suspense>
  );
};

const Suggestions = async ({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}) => {
  const params = await searchParams;

  const pageParam = params.page;

  const page = Number(Array.isArray(pageParam) ? pageParam[0] : pageParam) || 1;

  const accountId = await getAccountId();

  const {
    suggestions,
    currentPage,
    total,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  } = (await getSuggestions(accountId as string, page)) as PaginatedSuggestions;

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

  return (
    <SuggestionPagination
      suggestions={
        suggestionsWithStatus as (Account & {
          followStatus: boolean;
          requestStatus: FollowRequestEnum;
        })[]
      }
      currentPage={currentPage}
      total={total}
      totalPages={totalPages}
      hasNextPage={hasNextPage}
      hasPreviousPage={hasPreviousPage}
    />
  );
};

export default Page;
