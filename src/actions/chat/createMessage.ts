"use server";

import prisma from "@/lib/prisma";
import { ConversationParticipantType } from "@/generated/prisma/enums";

import {
  CreateMessageActionState,
  createMessageSchema,
} from "@/lib/schema/chat/Create-Message.schema";

import { uploadToCloudinary } from "@/lib/upload/uploadToCloudinary";
import { revalidatePath } from "next/cache";

const createMessage = async ({
  conversationId,
  accountId,
  formData,
  replyToMessageId,
}: {
  conversationId: string;
  accountId: string;
  formData: FormData;
  replyToMessageId?: string | null;
}): Promise<CreateMessageActionState> => {
  // ============================================================
  // 1. Validate IDs
  // ============================================================

  if (!conversationId) {
    return {
      success: false,
      message: "Conversation ID is required",
    };
  }

  if (!accountId) {
    return {
      success: false,
      message: "Account ID is required",
    };
  }

  // ============================================================
  // 2. Read FormData
  // ============================================================

  const rawContent = formData.get("content");
  const rawImage = formData.get("image");

  const form = {
    content: typeof rawContent === "string" ? rawContent : undefined,

    image: rawImage instanceof File ? rawImage : undefined,
  };

  // ============================================================
  // 3. Validate FormData
  // ============================================================

  const validationResult = createMessageSchema.safeParse(form);

  if (!validationResult.success) {
    return {
      success: false,

      form: {
        content: typeof rawContent === "string" ? rawContent : undefined,

        image: rawImage instanceof File ? rawImage.name : undefined,
      },

      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const { content, image } = validationResult.data;

  // ============================================================
  // 4. Check participant
  // ============================================================

  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      conversationId_accountId: {
        conversationId,
        accountId,
      },
    },

    select: {
      accountId: true,
      type: true,
    },
  });

  if (!participant || participant.type !== ConversationParticipantType.EXIST) {
    return {
      success: false,
      message: "You are not a participant",
    };
  }

  // ============================================================
  // 5. Check conversation
  // ============================================================

  const conversation = await prisma.conversation.findUnique({
    where: {
      id: conversationId,
    },

    select: {
      id: true,
      isOpen: true,
    },
  });

  if (!conversation) {
    return {
      success: false,
      message: "Conversation not found",
    };
  }

  // ============================================================
  // 6. Validate reply
  // ============================================================

  if (replyToMessageId) {
    const replyMessage = await prisma.message.findFirst({
      where: {
        id: replyToMessageId,
        conversationId,
      },

      select: {
        id: true,
      },
    });

    if (!replyMessage) {
      return {
        success: false,

        message:
          "The message you are replying to does not belong to this conversation",
      };
    }
  }

  // ============================================================
  // 7. Upload image only when provided
  // ============================================================

  const imageUrl = image ? await uploadToCloudinary(image) : null;

  // ============================================================
  // 8. Create message
  // ============================================================

  const message = await prisma.message.create({
    data: {
      content: typeof content === "string" ? content.trim() : "",

      image: imageUrl,

      senderId: accountId,

      conversationId,

      replyToMessageId: replyToMessageId ?? null,
    },

    include: {
      sender: {
        select: {
          username: true,
          image: true,
        },
      },

      replyToMessage: {
        select: {
          content: true,
          image: true,
          sender: true,
        },
      },

      messageReads: {
        select: {
          accountId: true,
          readAt: true,
          account: {
            select: {
              username: true,
              id: true,
              image: true,
            },
          },
        },
      },

      messageReactions: {
        select: {
          accountId: true,
          type: true,
        },
      },
    },
  });

  console.log("Malak finish");

  revalidatePath(`/messages/${conversationId}`);

  return {
    success: true,
    data: {
      message,
    },
  };
};

export default createMessage;
