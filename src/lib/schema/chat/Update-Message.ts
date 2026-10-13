import { z } from "zod";

export const updateMessageSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, {
      message: "Message cannot be empty",
    })
    .max(280, {
      message: "Message must be less than 280 characters",
    }),
});

export type UpdateMessageActionState = {
  form?: {
    content?: string;
  };

  success: boolean;

  errors?: {
    content?: string[];
  };
};
