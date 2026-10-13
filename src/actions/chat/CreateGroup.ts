"use server";

import { ConversationType } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import addParticipants from "../socket/add-participants";
import { createGroupSchema } from "@/lib/schema/chat/Create-Group.schema";
import { uploadToCloudinary } from "@/lib/upload/uploadToCloudinary";

const CreateGroup = async (
  accountIds: string[],
  accountId: string,
  formData: FormData,
) => {
  if (!accountId) {
    return {
      success: false,
      errors: {
        message: "Unauthorized",
      },
    };
  }

  const uniqueAccountIds = [...new Set([accountId, ...accountIds])];

  const accounts = await prisma.account.findMany({
    where: {
      id: {
        in: uniqueAccountIds,
      },
    },
    select: {
      id: true,
    },
  });

  const existingAccountIds = new Set(accounts.map((account) => account.id));

  const notExistAccountIds = uniqueAccountIds.filter(
    (id) => !existingAccountIds.has(id),
  );

  if (notExistAccountIds.length > 0) {
    return {
      success: false,
      errors: {
        message: "Some accounts do not exist",
        accountIds: notExistAccountIds,
      },
    };
  }

  const rawName = formData.get("name");
  const rawImage = formData.get("image");

  const rawRemoveImage = formData.get("removeImage");

  const removeImage = rawRemoveImage === "true";

  const form = {
    name: typeof rawName === "string" ? rawName : undefined,

    image: rawImage instanceof File ? rawImage : undefined,
  };

  // ============================================================
  // 3. Validate FormData
  // ============================================================

  const validationResult = createGroupSchema.safeParse(form);

  if (!validationResult.success) {
    return {
      success: false,

      form: {
        content: typeof rawName === "string" ? rawName : undefined,

        image: rawImage instanceof File ? rawImage.name : undefined,
      },

      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const { name, image } = validationResult.data;

  const imageUrl = image ? await uploadToCloudinary(image) : null;

  const converstion = await prisma.conversation.create({
    data: {
      ownerId: accountId,
      type: ConversationType.GROUP,
      name,
      ...(removeImage
        ? {
            image: null,
          }
        : imageUrl !== undefined
          ? {
              image: imageUrl,
            }
          : {}),
      participants: {
        create: uniqueAccountIds.map((id) => ({
          accountId: id,
          isAdmin: id === accountId,
        })),
      },
    },
  });

  addParticipants(uniqueAccountIds, {
    id: converstion.id,
    name: converstion.name,
    image: converstion.image,
  });
  revalidatePath(`/messages/${converstion.id}`);

  return {
    success: true,
  };
};

export default CreateGroup;
