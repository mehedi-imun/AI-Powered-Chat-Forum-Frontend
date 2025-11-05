import { z } from "zod";

export const createThreadSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must not exceed 200 characters"),
  content: z
    .string()
    .min(20, "Content must be at least 20 characters")
    .max(10000, "Content must not exceed 10,000 characters"),
  tags: z.string().optional(),
  category: z.string().min(1, "Please select a category"),
});

export const updateThreadSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must not exceed 200 characters"),
  content: z
    .string()
    .min(20, "Content must be at least 20 characters")
    .max(10000, "Content must not exceed 10,000 characters"),
});

export const replySchema = z.object({
  content: z
    .string()
    .min(1, "Reply cannot be empty")
    .max(5000, "Reply must not exceed 5,000 characters"),
});

export type CreateThreadFormData = z.infer<typeof createThreadSchema>;
export type UpdateThreadFormData = z.infer<typeof updateThreadSchema>;
export type ReplyFormData = z.infer<typeof replySchema>;
