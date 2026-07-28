import express from "express";

import {
  createSlotHandler,
  getAllSlotsHandler,
  getSlotsByServiceHandler,
  getSlotByIdHandler,
  updateSlotHandler,
  deleteSlotHandler,
} from "../controllers/slot.controller.js";

import {
  createSlotValidator,
  updateSlotValidator,
  slotIdParamValidator,
  serviceIdInParamValidator,
  slotQueryValidator,
  publicSlotQueryValidator,
} from "../validators/slot.validator.js";

import validate from "../middleware/validate.middleware.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

/* ==========================================================
   Public Routes

   IMPORTANT: /service/:serviceId MUST be registered before /:id
   to prevent Express from matching the literal string "service"
   as a slot ObjectId.
========================================================== */

/**
 * GET /api/v1/slots/service/:serviceId
 * Returns active, upcoming slots for a given service.
 * Optional query: ?date=YYYY-MM-DD
 */
router.get(
  "/service/:serviceId",
  serviceIdInParamValidator,
  publicSlotQueryValidator,
  validate,
  getSlotsByServiceHandler,
);

/**
 * GET /api/v1/slots/:id
 * Returns a single slot by its ID.
 */
router.get("/:id", slotIdParamValidator, validate, getSlotByIdHandler);

/* ==========================================================
   Admin-only Routes
========================================================== */

/**
 * GET /api/v1/slots
 * Returns all slots with full pagination and filtering.
 * Supports: ?serviceId, ?date, ?status, ?isActive, ?page, ?limit
 */
router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  slotQueryValidator,
  validate,
  getAllSlotsHandler,
);

/**
 * POST /api/v1/slots
 * Creates a new slot for a given service.
 */
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  createSlotValidator,
  validate,
  createSlotHandler,
);

/**
 * PUT /api/v1/slots/:id
 * Updates an existing slot. Recalculates availableBookings and
 * status when maxBookings is changed.
 */
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  slotIdParamValidator,
  updateSlotValidator,
  validate,
  updateSlotHandler,
);

/**
 * DELETE /api/v1/slots/:id
 * Soft-deletes a slot (sets isActive=false, status="cancelled").
 */
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  slotIdParamValidator,
  validate,
  deleteSlotHandler,
);

export default router;
