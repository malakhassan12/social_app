import { AccountType } from "@/generated/prisma/enums";
import getAccount from "../account/getAccount";

const isPrivateOtherProfile = async (
  profileId: string | undefined,
): Promise<boolean> => {
  if (!profileId) return false;
  const account = await getAccount();

  const profile = await getAccount(profileId);

  return account?.id !== profileId && profile?.type === AccountType.PRIVATE;
};

export default isPrivateOtherProfile;
