"use server";

import { AccountType } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { uploadToCloudinary } from "@/lib/upload/uploadToCloudinary";
import { FormState } from "@/types/form.Types";
import { validateCreatePost } from "@/utils/postValidation";
import { revalidatePath } from "next/cache";
import { getAccountId } from "@/helper/getAccountId";
import publishToFollowers from "../socket/publish-to-followers";
import { TypePublishSocket } from "@/lib/socket/socket.types";
import { Post } from "@/types/post.Types";

export async function createPost(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const accountId = await getAccountId();

  if (!accountId) {
    return {
      success: false,
      errors: {
        message: "Unauthorized",
      },
    };
  }

  const account = await prisma.account.findFirst({
    where: {
      id: accountId,
    },
    select: {
      type: true,
    },
  });

  const desc = formData.get("desc") as string;

  const isPrivate = (formData.get("isPrivate") as string) === "true";

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

  const post = await prisma.post.create({
    data: {
      desc,

      image: imageUrls,

      video: videoUrls,

      accountId,

      isPrivate: account?.type === AccountType.PRIVATE ? true : isPrivate,
    },
  });

  revalidatePath(`/api/post`);
  
  await publishToFollowers(accountId, TypePublishSocket.POST, {
    post: post as unknown as Post,
  });

  return {
    success: true,
  };
}
