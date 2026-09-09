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

const getStatusOfRequest = async (
  receiverId: string,
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

  console.log("receiverId", receiverId, "accountId", finalAccountId);

  // Check existing request
  const existingRequest = await prisma.followRequest.findFirst({
    where: {
      OR: [
        {
          requesterId: finalAccountId,
          receiverId,
        },
        {
          requesterId: receiverId,
          receiverId: finalAccountId,
        },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  
  if (
    !existingRequest ||
    existingRequest.status === FollowRequestStatus.REJECTED
  ) {
    console.log(existingRequest);
    return { status: FollowRequestEnum.NOT_EXIST, success: true };
  } else if (existingRequest.status == FollowRequestStatus.PENDING) {
    return { status: FollowRequestEnum.PENDING, success: true };
  } else {
    return { status: FollowRequestEnum.ACCEPTED, success: true };
  }
};

export default getStatusOfRequest;
