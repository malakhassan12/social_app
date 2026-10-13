"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { uploadToCloudinary } from "@/lib/upload/uploadToCloudinary";
import { getAccountId } from "@/helper/account/getAccountId";

export async function uploadAvatar(formData: FormData) {
  const accountId = await getAccountId();

  if (!accountId) {
    return {
      success: false,
      errors: {
        message: "Unauthorized",
      },
    };
  }

  const image = formData.get("image") as File | null;

  if (!image) {
    return {
      success: false,
      error: "Please select an image",
    };
  }

  if (!image.type.startsWith("image/")) {
    return {
      success: false,
      error: "Invalid image",
    };
  }

  if (image.size > 5 * 1024 * 1024) {
    return {
      success: false,
      error: "Image must be less than 5MB",
    };
  }

  const imageUrl = await uploadToCloudinary(image);

  await prisma.account.update({
    where: {
      id: accountId,
    },
    data: {
      image: imageUrl,
    },
  });

  revalidatePath("/");

  return {
    success: true,
  };
}
