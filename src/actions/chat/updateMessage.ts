"use server";

import prisma from "@/lib/prisma";

import { getAccountId } from "@/helper/account/getAccountId";
import { revalidatePath } from "next/cache";
import {
  UpdateMessageActionState,
  updateMessageSchema,
} from "@/lib/schema/chat/Update-Message";

const updateMessage = async ({
  messageId,
  formData,
}: {
  messageId: string;
  formData: FormData;
}): Promise<UpdateMessageActionState> => {
  if (!messageId) {
    return {
      success: false,
      errors: {
        content: ["Message ID is required"],
      },
    };
  }

  const accountId = await getAccountId();

  if (!accountId) {
    return {
      success: false,
      errors: {
        content: ["Unauthorized"],
      },
    };
  }

  // ============================================================
  // 1. Get message + verify owner
  // ============================================================

  const message = await prisma.message.findUnique({
    where: {
      id: messageId,
    },
    select: {
      id: true,
      senderId: true,
    },
  });

  if (!message) {
    return {
      success: false,
      errors: {
        content: ["Message not found"],
      },
    };
  }

  if (message.senderId !== accountId) {
    return {
      success: false,
      errors: {
        content: ["You can only update your own message"],
      },
    };
  }

  // ============================================================
  // 2. Read content only
  // ============================================================

  const rawContent = formData.get("content");

  const form = {
    content: typeof rawContent === "string" ? rawContent : undefined,
  };

  // ============================================================
  // 3. Validate content
  // ============================================================

  const validationResult = updateMessageSchema.safeParse(form);

  if (!validationResult.success) {
    return {
      success: false,
      form: {
        content: typeof rawContent === "string" ? rawContent : undefined,
      },
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const { content } = validationResult.data;

  // ============================================================
  // 4. Update content ONLY
  // ============================================================

  const updatedMessage = await prisma.message.update({
    where: {
      id: messageId,
    },

    data: {
      content,
    },

    select: {
      id: true,
      content: true,
      conversationId: true,
    },
  });

  revalidatePath(`/messages/${updatedMessage.conversationId}`);

  // ============================================================
  // 5. Return
  // ============================================================

  return {
    success: true,
    form: {
      content: updatedMessage.content,
    },
  };
};

export default updateMessage;
