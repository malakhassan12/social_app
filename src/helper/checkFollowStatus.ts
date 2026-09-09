"use server";
import prisma from "@/lib/prisma";
import { FormState } from "@/types/form.Types";
import { getAccountId } from "./getAccountId";
interface SuccessResponse extends FormState {
  status?: boolean;
  success: boolean;
}

type StatusRequestProp = SuccessResponse;

const checkFollowStatus = async (
  followingId: string,
  accountId?: string,
): Promise<StatusRequestProp> => {
  const finalAccountId = accountId ?? (await getAccountId());
  if (!finalAccountId) {
    return {
      success: false,
      errors: {
        message: "Unauthorized",
      },
    };
  }

  const followingExist = await prisma.follower.findFirst({
    where: {
      followerId: finalAccountId,
      followingId,
    },
  });

  return { status: Boolean(followingExist), success: true };
};

export default checkFollowStatus;
