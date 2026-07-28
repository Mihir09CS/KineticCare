import { body, param, query } from "express-validator";

/* ==========================================================
   Time format regex — HH:MM (24-hour)
========================================================== */

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

/* ==========================================================
   Create Slot Validator
========================================================== */

export const createSlotValidator = [
  body("service")
    .notEmpty()
    .withMessage("Service ID is required")
    .isMongoId()
    .withMessage("Service ID must be a valid Mongo ID"),

  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date (e.g. 2025-08-15)")
    .custom((value) => {
      const inputDate = new Date(value);
      inputDate.setUTCHours(0, 0, 0, 0);
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      if (inputDate < today) {
        throw new Error("Slot date cannot be in the past");
      }

      return true;
    }),

  body("startTime")
    .notEmpty()
    .withMessage("Start time is required")
    .matches(TIME_REGEX)
    .withMessage("Start time must be in HH:MM 24-hour format (e.g. 09:00)"),

  body("endTime")
    .notEmpty()
    .withMessage("End time is required")
    .matches(TIME_REGEX)
    .withMessage("End time must be in HH:MM 24-hour format (e.g. 10:00)")
    .custom((endTime, { req }) => {
      if (req.body.startTime && endTime <= req.body.startTime) {
        throw new Error("End time must be after start time");
      }
      return true;
    }),

  body("maxBookings")
    .notEmpty()
    .withMessage("Max bookings is required")
    .isInt({ min: 1, max: 100 })
    .withMessage("Max bookings must be between 1 and 100"),
];

/* ==========================================================
   Update Slot Validator
========================================================== */

export const updateSlotValidator = [
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date (e.g. 2025-08-15)")
    .custom((value) => {
      const inputDate = new Date(value);
      inputDate.setUTCHours(0, 0, 0, 0);
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      if (inputDate < today) {
        throw new Error("Slot date cannot be in the past");
      }

      return true;
    }),

  body("startTime")
    .optional()
    .matches(TIME_REGEX)
    .withMessage("Start time must be in HH:MM 24-hour format (e.g. 09:00)"),

  body("endTime")
    .optional()
    .matches(TIME_REGEX)
    .withMessage("End time must be in HH:MM 24-hour format (e.g. 10:00)")
    .custom((endTime, { req }) => {
      const compareTime = req.body.startTime;
      if (compareTime && endTime <= compareTime) {
        throw new Error("End time must be after start time");
      }
      return true;
    }),

  body("maxBookings")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Max bookings must be between 1 and 100"),

  body("status")
    .optional()
    .isIn(["open", "full", "cancelled"])
    .withMessage("Status must be open, full, or cancelled"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

/* ==========================================================
   Slot ID Param Validator
========================================================== */

export const slotIdParamValidator = [
  param("id")
    .notEmpty()
    .withMessage("Slot ID is required")
    .isMongoId()
    .withMessage("Slot ID must be a valid Mongo ID"),
];

/* ==========================================================
   Service ID Param Validator (used in /slots/service/:serviceId)
========================================================== */

export const serviceIdInParamValidator = [
  param("serviceId")
    .notEmpty()
    .withMessage("Service ID is required")
    .isMongoId()
    .withMessage("Service ID must be a valid Mongo ID"),
];

/* ==========================================================
   Slot Query Validator
   (pagination, date filter, status filter, serviceId filter)
========================================================== */

export const slotQueryValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("serviceId")
    .optional()
    .isMongoId()
    .withMessage("serviceId must be a valid Mongo ID"),

  query("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date (e.g. 2025-08-15)"),

  query("status")
    .optional()
    .isIn(["open", "full", "cancelled"])
    .withMessage("Status must be open, full, or cancelled"),

  query("isActive")
    .optional()
    .isIn(["true", "false"])
    .withMessage("isActive must be 'true' or 'false'"),
];

/* ==========================================================
   Public Slot Query Validator
   (date filter for GET /slots/service/:serviceId)
========================================================== */

export const publicSlotQueryValidator = [
  query("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date (e.g. 2025-08-15)"),
];
