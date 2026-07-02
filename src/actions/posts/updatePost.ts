"use server";
import { getUserId } from "@/helper/getUserId";
import prisma from "@/lib/prisma";
import { uploadToCloudinary } from "@/lib/upload/uploadToCloudinary";
import { FormState } from "@/types/form.Types";
import { validateCreatePost } from "@/utils/postValidation";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function updatePost(
  postId: string,
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
  const isPrivate = formData.get("isPrivate") === "true";

  console.log("isPrivate",isPrivate)

  const images = formData
    .getAll("images")
    .filter((file) => file instanceof File && file.size > 0) as File[];
  const videos = formData
    .getAll("videos")
    .filter((file) => file instanceof File && file.size > 0) as File[];

  const oldImages = formData.getAll("oldImages") as string[];
  const oldVideos = formData.getAll("oldVideos") as string[];

  const errors: FormState["errors"] = {};
  validateCreatePost(desc, images, videos, errors);

  if (Object.keys(errors).length) {
    return { success: false, errors };
  }

  const newImageUrls = await Promise.all(
    images.map((file) => uploadToCloudinary(file)),
  );
  const newVideoUrls = await Promise.all(
    videos.map((file) => uploadToCloudinary(file)),
  );

  try {
    await prisma.post.update({
      where: { id: postId },
      data: {
        desc,
        image: [...oldImages, ...newImageUrls],
        video: [...oldVideos, ...newVideoUrls],
        isPrivate,
      },
    });

    revalidatePath(`/api/post`);
    return {
      success: true,
    };

  } catch {
    return {
      success: false,
    };
  }
}
export { updatePost };
