import { z } from "zod";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

export const createGroupSchema = z.object({
  name: z
    .string()
    .trim()

    .max(280, {
      message: "Group must be less than 280 characters",
    }),

  image: z
    .instanceof(File)
    .refine((file) => file.type.startsWith("image/"), {
      message: "Invalid image file",
    })
    .refine((file) => file.size <= MAX_IMAGE_SIZE, {
      message: "Image size must be less than 5MB",
    })
    .optional(),
});

export type CreateGroupInput = z.infer<typeof createGroupSchema>;

export type CreateGroupActionState = {
  form?: {
    content?: string;
    image?: string;
  };

  success: boolean;

  errors?: {
    content?: string[];
    image?: string[];
  };

  message?: string;
};
