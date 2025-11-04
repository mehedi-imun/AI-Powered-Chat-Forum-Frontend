import { z } from "zod";

export const updateProfileSchema = z.object({
  displayName: z
    .string()
    .min(2, "Display name must be at least 2 characters")
    .max(50, "Display name must not exceed 50 characters"),
  bio: z
    .string()
    .max(500, "Bio must not exceed 500 characters")
    .optional(),
  avatar: z.string().url("Invalid URL").optional().or(z.literal("")),
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(false),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
