import asyncHandler from "../helpers/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  createBooking,
  cancelBooking,
  getUserBookings,
  getUpcomingBookings,
  getBookingById,
  getAllBookings,
} from "../services/booking.service.js";

/* ==========================================================
   Create Booking
   POST /api/v1/bookings
========================================================== */

export const createBookingHandler = asyncHandler(async (req, res) => {
  const booking = await createBooking(req.user._id, req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, "Booking created successfully", booking));
});

/* ==========================================================
   Cancel Booking
   PATCH /api/v1/bookings/:id/cancel
========================================================== */

export const cancelBookingHandler = asyncHandler(async (req, res) => {
  const booking = await cancelBooking(
    req.params.id,
    req.user._id,
    req.user.role,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Booking cancelled successfully", booking));
});

/* ==========================================================
   Get My Bookings (History)
   GET /api/v1/bookings/my
========================================================== */

export const getMyBookingsHandler = asyncHandler(async (req, res) => {
  const { page, limit, status } = req.query;

  const result = await getUserBookings(req.user._id, { page, limit, status });

  return res
    .status(200)
    .json(new ApiResponse(200, "Bookings retrieved successfully", result));
});

/* ==========================================================
   Get My Upcoming Bookings
   GET /api/v1/bookings/my/upcoming
========================================================== */

export const getMyUpcomingBookingsHandler = asyncHandler(async (req, res) => {
  const bookings = await getUpcomingBookings(req.user._id);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Upcoming bookings retrieved successfully",
        bookings,
      ),
    );
});

/* ==========================================================
   Get Booking By ID
   GET /api/v1/bookings/:id
========================================================== */

export const getBookingByIdHandler = asyncHandler(async (req, res) => {
  const booking = await getBookingById(
    req.params.id,
    req.user._id,
    req.user.role,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Booking details retrieved successfully", booking));
});

/* ==========================================================
   Get All Bookings (Admin)
   GET /api/v1/bookings
========================================================== */

export const getAllBookingsHandler = asyncHandler(async (req, res) => {
  const { page, limit, status, serviceId } = req.query;

  const result = await getAllBookings({ page, limit, status, serviceId });

  return res
    .status(200)
    .json(new ApiResponse(200, "All bookings retrieved successfully", result));
});
