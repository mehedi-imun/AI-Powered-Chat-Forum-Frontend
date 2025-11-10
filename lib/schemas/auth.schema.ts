import { z } from "zod";

// Custom email validation with stricter rules
const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email address")
  .refine(
    (email) => {
      // Check for valid email format
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
    },
    { message: "Please enter a valid email address" }
  )
  .refine(
    (email) => {
      // Check for common typos in popular domains
      const domain = email.split("@")[1]?.toLowerCase();
      const typos = [
        "gmial.com",
        "gmai.com",
        "yahooo.com",
        "yaho.com",
        "hotmial.com",
        "outlok.com",
      ];
      return !typos.includes(domain);
    },
    {
      message:
        "Did you mean a different email provider? Please check your email",
    }
  )
  .refine(
    (email) => {
      // Check for double dots or invalid characters
      return (
        !email.includes("..") && !email.startsWith(".") && !email.endsWith(".")
      );
    },
    { message: "Email contains invalid characters or formatting" }
  )
  .transform((email) => email.toLowerCase().trim());

// Strong password validation
const passwordSchema = z
  .string()
  .min(1, "Password is required")
  .min(6, "Password must be at least 6 characters")
  .max(100, "Password is too long");

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

// Register schema
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be at most 50 characters")
      .refine(
        (name) => {
          // Check for valid name (letters, spaces, hyphens, apostrophes)
          const nameRegex = /^[a-zA-Z\s'-]+$/;
          return nameRegex.test(name);
        },
        {
          message:
            "Name can only contain letters, spaces, hyphens, and apostrophes",
        }
      )
      .refine((name) => name.trim().split(/\s+/).length >= 1, {
        message: "Please enter your name",
      })
      .transform((name) => name.trim()),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// Reset password schema
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Change password schema (for authenticated users)
export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required")
      .min(6, "Password must be at least 6 characters"),
    newPassword: passwordSchema,
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
