import ShowFollow from "../_components/ShowFollow";
import { FC } from "react";
import isPrivateOtherProfile from "@/helper/profile/isPrivateOtherProfile";
import PrivateAccount from "./PrivateAccount";
import ProfilePostsSection from "./ProfilePostsSection";
import BackBtn from "@/components/Buttons/BackBtn";
import { getAccountId } from "@/helper/account/getAccountId";
import isAFriend from "@/helper/friend/isAFriend";
import getAccount from "@/helper/account/getAccount";
import { Account } from "@/types/account.Types";

type ProfileContentProps = {
  params: Promise<{
    accountId: string;
  }>;
  searchParams: Promise<{
    pageFollowers?: string | number;
    pageFollowings?: string | number;
    pageFriends?: string | number;
    pagePosts?: string | number;
  }>;
};
const ProfileContent: FC<ProfileContentProps> = async ({
  params,
  searchParams,
}) => {
  const routeParams = await params;
  const profileId = routeParams.accountId
    ? routeParams.accountId[0]
    : await getAccountId();

  const privateProfile = await isPrivateOtherProfile(profileId as string);

  const isFriend = await isAFriend(profileId as string);

  const account = await getAccount();

  return (
    <>
      <BackBtn />
      <ShowFollow
        profileId={profileId ?? undefined}
        searchParams={searchParams}
      />

      {privateProfile && !isFriend ? (
        <PrivateAccount />
      ) : (
        <ProfilePostsSection
          searchParams={searchParams}
          profileId={profileId ?? undefined}
          account={account as unknown as Account}
        />
      )}
    </>
  );
};

export default ProfileContent;
