"use server";

import { getUserId } from "@/helper/getUserId";
import prisma from "@/lib/prisma";
import { uploadToCloudinary } from "@/lib/upload/uploadToCloudinary";
import { FormState } from "@/types/form.Types";
import { validateCreatePost } from "@/utils/postValidation";
import { revalidatePath } from "next/cache";

export async function createPost(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const userId = await getUserId();

  if (!userId) {
    return {
      success: false,
      errors: {
        message: "Unauthorized",
      },
    };
  }

  const desc = formData.get("desc") as string;

  const images = formData
    .getAll("images")
    .filter((file) => file instanceof File) as File[];

  const videos = formData
    .getAll("videos")
    .filter((file) => file instanceof File) as File[];

  console.log(images, videos);
  const errors: FormState["errors"] = {};

  validateCreatePost(desc, images, videos, errors);

  if (Object.keys(errors).length) {
    return {
      success: false,
      errors,
    };
  }

  // upload هنا
  const imageUrls = await Promise.all(
    images.map((file) => uploadToCloudinary(file)),
  );

  const videoUrls = await Promise.all(
    videos.map((file) => uploadToCloudinary(file)),
  );

  await prisma.post.create({
    data: {
      desc,

      image: imageUrls,

      video: videoUrls,

      authorId: userId,
    },
  });

  revalidatePath(`/api/post`);

  return {
    success: true,
  };
}
