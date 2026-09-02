"use server";

import { FollowRequestStatus } from "@/generated/prisma/enums";
import { getAccountId } from "@/helper/getAccountId";
import prisma from "@/lib/prisma";
import { FollowRequestEnum } from "@/types/enum/follow-req.enum";
import { FormState } from "@/types/form.Types";

interface SuccessResponse extends FormState {
  status?: FollowRequestEnum;
  success: boolean;
}

type StatusRequestProp = SuccessResponse;

const getStatusFriendship = async (
  receiverId: string,
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

  // Check existing request
  const existingRequest = await prisma.followRequest.findFirst({
    where: {
      OR: [
        {
          requesterId: accountId,
          receiverId,
        },
        {
          requesterId: receiverId,
          receiverId: accountId,
        },
      ],
    },
  });
  if (
    !existingRequest ||
    existingRequest.status === FollowRequestStatus.REJECTED
  ) {
    return { status: FollowRequestEnum.NOT_EXIST, success: true };
  } else if (existingRequest.status == FollowRequestStatus.PENDING) {
    return { status: FollowRequestEnum.PENDING, success: true };
  } else {
    return { status: FollowRequestEnum.ACCEPTED, success: true };
  }
};

export default getStatusFriendship;
