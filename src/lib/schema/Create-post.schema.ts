import { z } from "zod";

const MAX_IMAGES = 10;
const MAX_VIDEOS = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

export const createPostSchema = z.object({
  desc: z
    .string()
    .trim()
    .min(5, {
      message: "Post description must be larger than 5 characters",
    })
    .max(280, {
      message: "Description must be less than 280 characters",
    }),

  images: z
    .array(
      z
        .instanceof(File)
        .refine((file) => file.type.startsWith("image/"), "Invalid image file")
        .refine(
          (file) => file.size <= MAX_IMAGE_SIZE,
          "Image size must be less than 5MB",
        ),
    )
    .max(MAX_IMAGES, {
      message: `You can upload maximum ${MAX_IMAGES} images`,
    }),

  videos: z
    .array(
      z
        .instanceof(File)
        .refine((file) => file.type.startsWith("video/"), "Invalid video file")
        .refine(
          (file) => file.size <= MAX_VIDEO_SIZE,
          "Video size must be less than 50MB",
        ),
    )
    .max(MAX_VIDEOS, {
      message: `You can upload maximum ${MAX_VIDEOS} videos`,
    }),
});

export type CreatePostActionState = {
  form?: {
    desc?: string;
    images?: File[];
    videos?: File[];
  };
  success: boolean;

  errors?: {
    desc?: string[];
    images?: string[];
    videos?: string[];
    message?: string;
  };
};

export type CreatePostInput = z.infer<typeof createPostSchema>;
