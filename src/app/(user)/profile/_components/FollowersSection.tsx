import getFollowers from "@/helper/follow/getFollowers";
import { FC } from "react";
import AccountCard from "./AccountCard";
import { Friend } from "@/types/friend.Types";
import FollowersContent from "./FollowersContent";

const FollowersSection: FC<{
  profileId?: string | undefined;
  page: string | number;
}> = async ({ profileId, page }) => {
  const {
    followers,
    currentPage,
    limit,
    total,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  } = await getFollowers(profileId, page);

  return (
    <>
      <FollowersContent
        currentPage={currentPage as string | number}
        limit={limit as number}
        total={total as number}
        totalPages={totalPages as number}
        hasNextPage={hasNextPage as boolean}
        hasPreviousPage={hasPreviousPage as boolean}
        profileId={profileId as string}
      >
        {followers.map((f) => {
          return (
            <AccountCard
              key={f.id}
              account={f as unknown as Friend}
              title="Followers"
            />
          );
        })}
      </FollowersContent>
    </>
  );
};

export default FollowersSection;
