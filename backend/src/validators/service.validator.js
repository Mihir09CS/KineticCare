import { body, param, query } from "express-validator";
import { SERVICE_CATEGORIES } from "../models/service.model.js";

/* ==========================================================
   Create Service Validator
========================================================== */

export const createServiceValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Service name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Service name must be between 3 and 100 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters"),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isIn(SERVICE_CATEGORIES)
    .withMessage(`Category must be one of: ${SERVICE_CATEGORIES.join(", ")}`),

  body("duration")
    .notEmpty()
    .withMessage("Duration is required")
    .isInt({ min: 15, max: 480 })
    .withMessage("Duration must be between 15 and 480 minutes"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number"),

  body("imageUrl")
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage("Image URL must be a valid URL"),
];

/* ==========================================================
   Update Service Validator
========================================================== */

export const updateServiceValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Service name must be between 3 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters"),

  body("category")
    .optional()
    .trim()
    .isIn(SERVICE_CATEGORIES)
    .withMessage(`Category must be one of: ${SERVICE_CATEGORIES.join(", ")}`),

  body("duration")
    .optional()
    .isInt({ min: 15, max: 480 })
    .withMessage("Duration must be between 15 and 480 minutes"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number"),

  body("imageUrl")
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage("Image URL must be a valid URL"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

/* ==========================================================
   Service ID Param Validator
========================================================== */

export const serviceIdParamValidator = [
  param("id")
    .notEmpty()
    .withMessage("Service ID is required")
    .isMongoId()
    .withMessage("Service ID must be a valid Mongo ID"),
];

/* ==========================================================
   Service Query Validator
   (pagination, search, category filter, isActive filter)
========================================================== */

export const serviceQueryValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("search")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Search term cannot exceed 100 characters"),

  query("category")
    .optional()
    .trim()
    .isIn(SERVICE_CATEGORIES)
    .withMessage(`Category must be one of: ${SERVICE_CATEGORIES.join(", ")}`),

  query("isActive")
    .optional()
    .isIn(["true", "false"])
    .withMessage("isActive must be 'true' or 'false'"),
];
