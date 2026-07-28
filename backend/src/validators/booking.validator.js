import { body, param, query } from "express-validator";
import BOOKING_STATUS from "../constants/bookingStatus.js";

/* ==========================================================
   Create Booking Validator
========================================================== */

export const createBookingValidator = [
  body("service")
    .notEmpty()
    .withMessage("Service ID is required")
    .isMongoId()
    .withMessage("Service ID must be a valid Mongo ID"),

  body("slot")
    .notEmpty()
    .withMessage("Slot ID is required")
    .isMongoId()
    .withMessage("Slot ID must be a valid Mongo ID"),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes cannot exceed 500 characters"),
];

/* ==========================================================
   Booking ID Param Validator
========================================================== */

export const bookingIdParamValidator = [
  param("id")
    .notEmpty()
    .withMessage("Booking ID is required")
    .isMongoId()
    .withMessage("Booking ID must be a valid Mongo ID"),
];

/* ==========================================================
   Booking Query Validator (for pagination & status filtering)
========================================================== */

export const bookingQueryValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("status")
    .optional()
    .isIn(Object.values(BOOKING_STATUS))
    .withMessage(`Status must be one of: ${Object.values(BOOKING_STATUS).join(", ")}`),
];
