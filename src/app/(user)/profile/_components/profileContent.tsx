import ShowFollow from "../_components/ShowFollow";
import { FC } from "react";
import isPrivateOtherProfile from "@/helper/isPrivateOtherProfile";
import PrivateAccount from "./PrivateAccount";
import ProfilePostsSection from "./ProfilePostsSection";
import BackBtn from "@/components/Buttons/BackBtn";
import { getAccountId } from "@/helper/getAccountId";

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

  return (
    <>
      <BackBtn />
      <ShowFollow
        profileId={profileId ?? undefined}
        searchParams={searchParams}
      />

      {privateProfile ? (
        <PrivateAccount />
      ) : (
        <ProfilePostsSection
          searchParams={searchParams}
          profileId={profileId ?? undefined}
        />
      )}
    </>
  );
};

export default ProfileContent;
