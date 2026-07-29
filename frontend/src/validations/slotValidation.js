import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const createSlotSchema = z
  .object({
    service: z.string().min(1, "Please select a service"),
    date: z.string().min(1, "Date is required"),
    startTime: z
      .string()
      .regex(timeRegex, "Start time must be in HH:MM format (e.g. 09:00)"),
    endTime: z
      .string()
      .regex(timeRegex, "End time must be in HH:MM format (e.g. 10:00)"),
    maxBookings: z.coerce
      .number()
      .min(1, "Max bookings must be at least 1")
      .max(100, "Max bookings cannot exceed 100"),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });
