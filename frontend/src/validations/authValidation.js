import { z } from "zod";

const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters")
    .max(50, "Full name cannot exceed 50 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      strongPasswordRegex,
      "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character"
    ),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters")
    .regex(
      strongPasswordRegex,
      "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character"
    ),
});

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Full name must be between 3 and 50 characters")
    .max(50, "Full name must be between 3 and 50 characters"),
});
