"use server";

import prisma from "@/lib/prisma";
import { uploadToCloudinary } from "@/lib/upload/uploadToCloudinary";
import { createGroupSchema } from "@/lib/schema/chat/Create-Group.schema";

const EditConversationData = async (
  conversationId: string,
  formData: FormData,
  currentAccountId: string,
) => {
  try {
    // =====================================================
    // Validation
    // =====================================================

    if (!conversationId) {
      return {
        success: false,
        message: "Conversation ID is required",
      };
    }

    // =====================================================
    // Current authenticated account
    // =====================================================

    if (!currentAccountId) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    // =====================================================
    // Get conversation + current participant
    // =====================================================

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },

      select: {
        id: true,
        type: true,

        participants: {
          where: {
            accountId: currentAccountId,
          },

          select: {
            accountId: true,
            isAdmin: true,
          },
        },
      },
    });

    if (!conversation) {
      return {
        success: false,
        message: "Conversation not found",
      };
    }

    // =====================================================
    // Group only
    // =====================================================

    if (conversation.type !== "GROUP") {
      return {
        success: false,
        message: "Only group conversations can be edited",
      };
    }

    // =====================================================
    // Current participant
    // =====================================================

    const currentParticipant = conversation.participants[0];

    if (!currentParticipant) {
      return {
        success: false,
        message: "You are not a participant in this conversation",
      };
    }

    // =====================================================
    // Admin only
    // =====================================================

    if (!currentParticipant.isAdmin) {
      return {
        success: false,
        message: "Only an admin can edit the group",
      };
    }

    const rawImage = formData.get("image");
    const rawName = formData.get("name");
    const rawRemoveImage = formData.get("removeImage");

    const removeImage = rawRemoveImage === "true";

    const form = {
      name: typeof rawName === "string" ? rawName : undefined,

      image:
        rawImage instanceof File && rawImage.size > 0 ? rawImage : undefined,
    };
    // ============================================================
    // 3. Validate FormData
    // ============================================================

    const validationResult = createGroupSchema.safeParse(form);

    if (!validationResult.success) {
      return {
        success: false,

        errors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { name, image } = validationResult.data;

    const data: {
      name: string;
      image?: string | null;
    } = {
      name,
    };

    let imageUrl;
    if (image) {
      imageUrl = await uploadToCloudinary(image);

    }

    await prisma.conversation.update({
      where: {
        id: conversationId,
        ...(removeImage
          ? {
              image: null,
            }
          : imageUrl !== undefined
            ? {
                image: imageUrl,
              }
            : {}),
      },
      data,
    });

    // =====================================================
    // Result
    // =====================================================

    return {
      success: true,
      message: "Conversation updated successfully",
    };
  } catch (error) {
    console.error("EditConversationData error:", error);

    return {
      success: false,
      message: "Failed to update conversation",
    };
  }
};

export default EditConversationData;
