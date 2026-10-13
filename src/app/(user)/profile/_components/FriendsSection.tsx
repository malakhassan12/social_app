import { FC } from "react";
import AccountCard from "./AccountCard";
import { Friend } from "@/types/friend.Types";
import FriendsContent from "./FriendsContent";
import getFriends from "@/helper/friend/getFriends";

const FriendsSection: FC<{
  profileId?: string | undefined;
  page: string | number;
}> = async ({ profileId, page }) => {
  const {
    friends,
    currentPage,
    limit,
    total,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  } = await getFriends(profileId, page);

  return (
    <>
      <FriendsContent
        currentPage={currentPage as string | number}
        limit={limit as number}
        total={total as number}
        totalPages={totalPages as number}
        hasNextPage={hasNextPage as boolean}
        hasPreviousPage={hasPreviousPage as boolean}
        profileId={profileId as string}
      >
        {friends.map((f) => {
          return (
            <AccountCard
              key={f.id}
              account={f as unknown as Friend}
              title="Friends"
            />
          );
        })}
      </FriendsContent>
    </>
  );
};

export default FriendsSection;
