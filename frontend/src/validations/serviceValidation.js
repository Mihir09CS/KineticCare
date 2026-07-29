import { z } from "zod";

export const SERVICE_CATEGORIES = [
  "Physiotherapy",
  "Yoga",
  "Meditation",
  "Nutrition",
  "Massage Therapy",
  "Mental Wellness",
  "Fitness",
  "Occupational Therapy",
  "Hydrotherapy",
  "Balance & Mobility",
];

export const createServiceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Service name must be at least 3 characters")
    .max(100, "Service name cannot exceed 100 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description cannot exceed 1000 characters"),
  category: z.enum(SERVICE_CATEGORIES, {
    errorMap: () => ({ message: "Please select a valid category" }),
  }),
  duration: z.coerce
    .number()
    .min(15, "Duration must be at least 15 minutes")
    .max(480, "Duration cannot exceed 480 minutes"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  imageUrl: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || z.string().url().safeParse(val).success, {
      message: "Please enter a valid Image URL",
    }),
});
