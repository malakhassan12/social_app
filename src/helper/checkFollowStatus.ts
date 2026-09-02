"use server"
import prisma from "@/lib/prisma";
import { getAccountId } from "./getAccountId";
import { FormState } from "@/types/form.Types";
interface SuccessResponse extends FormState {
  status?: boolean;
  success: boolean;
}

type StatusRequestProp = SuccessResponse;

const checkFollowStatus = async (
  followingId: string,
): Promise<StatusRequestProp> => {
  const accountId = await getAccountId();
  if (!accountId) {
    return {
      success: false,
      errors: {
        message: "Unauthorized",
      },
    };
  }

  const followingExist = await prisma.follower.findFirst({
    where: {
      followerId: accountId,
      followingId,
    },
  });

  return { status: Boolean(followingExist), success: true };
};

export default checkFollowStatus;
