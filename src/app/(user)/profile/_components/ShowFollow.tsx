import { Card } from "@/components/ui/card";
import { Friend } from "@/types/friend.Types";
import ProfileCard from "./ProfileCard";
import FollowersSection from "./FollowersSection";
import FollowingsSection from "./FollowingsSection";
import FriendsSection from "./FriendsSection";
import getAccount from "@/helper/getAccount";

const ShowFollow = async ({
  profileId,
  searchParams,
}: {
  profileId: string | undefined;
  searchParams: Promise<{
    pageFollowers?: string | number;
    pageFollowings?: string | number;
    pageFriends?: string | number;
    pagePosts?: string | number;
  }>;
}) => {
  const { pageFollowers, pageFollowings, pageFriends } = await searchParams;

  const user = await getAccount(profileId);
  return (
    <Card className="w-full shadow-md border border-gray-200 dark:border-gray-800 p-4">
      <ProfileCard user={user as Friend} profileId={profileId} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <FollowersSection
          page={pageFollowers as string | number}
          profileId={profileId}
        />
        <FollowingsSection
          page={pageFollowings as string | number}
          profileId={profileId}
        />
        <FriendsSection
          page={pageFriends as string | number}
          profileId={profileId}
        />
      </div>
    </Card>
  );
};

export default ShowFollow;
