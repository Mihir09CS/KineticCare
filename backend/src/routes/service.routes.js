import express from "express";

import {
  createServiceHandler,
  getAllServicesHandler,
  getServiceByIdHandler,
  updateServiceHandler,
  deleteServiceHandler,
} from "../controllers/service.controller.js";

import {
  createServiceValidator,
  updateServiceValidator,
  serviceIdParamValidator,
  serviceQueryValidator,
} from "../validators/service.validator.js";

import validate from "../middleware/validate.middleware.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

/* ==========================================================
   Public Routes
========================================================== */

/**
 * GET /api/v1/services
 * List all active services with pagination, search, and filtering.
 */
router.get("/", serviceQueryValidator, validate, getAllServicesHandler);

/**
 * GET /api/v1/services/:id
 * Get a single service by ID.
 */
router.get(
  "/:id",
  serviceIdParamValidator,
  validate,
  getServiceByIdHandler,
);

/* ==========================================================
   Admin-only Routes
========================================================== */

/**
 * POST /api/v1/services
 * Create a new service.
 */
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  createServiceValidator,
  validate,
  createServiceHandler,
);

/**
 * PUT /api/v1/services/:id
 * Update an existing service.
 */
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  serviceIdParamValidator,
  updateServiceValidator,
  validate,
  updateServiceHandler,
);

/**
 * DELETE /api/v1/services/:id
 * Soft-delete (deactivate) a service.
 */
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  serviceIdParamValidator,
  validate,
  deleteServiceHandler,
);

export default router;
