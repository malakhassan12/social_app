import { FC } from "react";
import AccountCard from "./AccountCard";
import { Friend } from "@/types/friend.Types";
import getFollowings from "@/helper/follow/getFollowings";
import FollowingsContent from "./FollowingsContent";

const FollowingsSection: FC<{
  profileId?: string | undefined;
  page: string | number;
}> = async ({ profileId, page }) => {
  const {
    followings,
    currentPage,
    limit,
    total,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  } = await getFollowings(profileId, page);

  return (
    <>
      <FollowingsContent
        currentPage={currentPage as string | number}
        limit={limit as number}
        total={total as number}
        totalPages={totalPages as number}
        hasNextPage={hasNextPage as boolean}
        hasPreviousPage={hasPreviousPage as boolean}
        profileId={profileId as string}
      >
        {followings.map((f) => {
          return (
            <AccountCard
              key={f.id}
              account={f as unknown as Friend}
              title="Followings"
            />
          );
        })}
      </FollowingsContent>
    </>
  );
};

export default FollowingsSection;
