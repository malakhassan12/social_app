"use server";

import prisma from "@/lib/prisma";
import { ConversationParticipantType } from "@/generated/prisma/enums";

import { revalidatePath } from "next/cache";

import createConversation from "./createConversation";

import createMessage from "./createMessage";

import { CreateMessageActionState } from "@/lib/schema/chat/Create-Message.schema";

import publishMessages from "../socket/publish-messages";

const sendMessage = async ({
  accountId,
  conversationId,
  formData,
  selectedAccountId,
  replyToMessageId,
}: {
  selectedAccountId?: string;

  accountId: string;

  conversationId: string | null | undefined;

  formData: FormData;

  replyToMessageId?: string;
}): Promise<CreateMessageActionState> => {
  try {
    console.log(
      "accountId",
      accountId,
      "conversationId",
      conversationId,
      "selectedAccountId",
      selectedAccountId,
    );

    // =====================================
    // 1. Validate account
    // =====================================

    if (!accountId) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    // =====================================
    // 2. Convert "null" / "undefined"
    //    strings to real null
    // =====================================

    let actualConversationId: string | null = null;

    if (
      conversationId &&
      conversationId !== "null" &&
      conversationId !== "undefined"
    ) {
      actualConversationId = conversationId;
    }

    console.log("actualConversationId", actualConversationId);

    // =====================================
    // 3. Create conversation if needed
    // =====================================

    if (!actualConversationId) {
      if (!selectedAccountId) {
        return {
          success: false,
          message: "Recipient is required",
        };
      }

      console.log("🟢 createConversation START");

      actualConversationId = await createConversation({
        selectedAccountId,
        accountId,
      });

      console.log("🟢 createConversation RESULT", actualConversationId);
    }

    // =====================================
    // 4. Verify sender is participant
    // =====================================

    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_accountId: {
          conversationId: actualConversationId,
          accountId,
        },
      },
    });

    if (
      !participant ||
      participant.type !== ConversationParticipantType.EXIST
    ) {
      return {
        success: false,
        message: "Not a participant",
      };
    }

    // =====================================
    // 5. Get conversation
    // =====================================

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: actualConversationId,
      },
    });

    if (!conversation?.isOpen && !participant.isAdmin) {
      return {
        success: false,
        message: "Can't send message since the chat is closed",
      };
    }

    // =====================================
    // 6. Create message
    // =====================================

    const res = await createMessage({
      conversationId: actualConversationId,
      accountId,
      formData,
      replyToMessageId,
    });

    if (!res.success) {
      return {
        success: false,
        errors: res.errors,
        message: res.message,
      };
    }

    const message = res.data?.message;

   

    if (!message) {
      return {
        success: false,
        message: "Failed to send message",
      };
    }

    // =====================================
    // 7. Touch conversation
    // =====================================

    await prisma.conversation.update({
      where: {
        id: actualConversationId,
      },

      data: {
        updatedAt: new Date(),
      },
    });

    // =====================================
    // 8. Realtime
    // =====================================

    await publishMessages(actualConversationId, message);

    // =====================================
    // 9. Revalidate
    // =====================================

    revalidatePath(`/messages/${actualConversationId}`);

    revalidatePath(
      `profile/send-message/${conversationId}?accountId=${selectedAccountId}`,
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error("[sendMessage]", error);

    return {
      success: false,
      message: "Failed to send message",
    };
  }
};

export default sendMessage;
