import express from "express";

import {
  createBookingHandler,
  cancelBookingHandler,
  getMyBookingsHandler,
  getMyUpcomingBookingsHandler,
  getBookingByIdHandler,
  getAllBookingsHandler,
} from "../controllers/booking.controller.js";

import {
  createBookingValidator,
  bookingIdParamValidator,
  bookingQueryValidator,
} from "../validators/booking.validator.js";

import validate from "../middleware/validate.middleware.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// All booking routes require authentication
router.use(authenticate);

/* ==========================================================
   User Routes (with precedence over /:id)
========================================================== */

/**
 * GET /api/v1/bookings/my/upcoming
 * Get current user's upcoming confirmed appointments.
 */
router.get("/my/upcoming", getMyUpcomingBookingsHandler);

/**
 * GET /api/v1/bookings/my
 * Get current user's booking history (paginated & filterable).
 */
router.get("/my", bookingQueryValidator, validate, getMyBookingsHandler);

/**
 * POST /api/v1/bookings
 * Create a new appointment booking.
 */
router.post("/", createBookingValidator, validate, createBookingHandler);

/**
 * PATCH /api/v1/bookings/:id/cancel
 * Cancel an appointment booking.
 */
router.patch(
  "/:id/cancel",
  bookingIdParamValidator,
  validate,
  cancelBookingHandler,
);

/**
 * GET /api/v1/bookings/:id
 * Get details of a single booking by ID.
 */
router.get("/:id", bookingIdParamValidator, validate, getBookingByIdHandler);

/* ==========================================================
   Admin Routes
========================================================== */

/**
 * GET /api/v1/bookings
 * Get all system bookings (Admin only).
 */
router.get(
  "/",
  authorize("ADMIN"),
  bookingQueryValidator,
  validate,
  getAllBookingsHandler,
);

export default router;
