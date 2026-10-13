import { Message } from "@/generated/prisma/client";
import { z } from "zod";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

export const createMessageSchema = z.object({
  content: z
    .string()
    .trim()

    .max(280, {
      message: "Message must be less than 280 characters",
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

export type CreateMessageInput = z.infer<typeof createMessageSchema>;

export type CreateMessageActionState = {
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

  data? :{
    message : Message
  }

  
};
