import Booking from "../models/booking.model.js";
import Slot from "../models/slot.model.js";
import Service from "../models/service.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import BOOKING_STATUS from "../constants/bookingStatus.js";
import { sendEmail } from "./email.service.js";
import { bookingConfirmationTemplate } from "../templates/bookingConfirmation.template.js";
import { bookingCancellationTemplate } from "../templates/bookingCancellation.template.js";

/* ==========================================================
   Create Booking
========================================================== */

/**
 * Creates a new booking with race-condition protection.
 * Atomically decrements slot capacity and sends email confirmation.
 *
 * @param {string} userId
 * @param {Object} data { service: serviceId, slot: slotId, notes }
 * @returns {Object} Booking document
 */
export const createBooking = async (userId, { service: serviceId, slot: slotId, notes }) => {
  // 1. Verify service exists and is active
  const service = await Service.findById(serviceId);
  if (!service || !service.isActive) {
    throw new ApiError(404, "Service not found or is currently inactive");
  }

  // 2. Prevent double booking by the same user for the same slot
  const existingBooking = await Booking.findOne({
    user: userId,
    slot: slotId,
    bookingStatus: { $ne: BOOKING_STATUS.CANCELLED },
  });

  if (existingBooking) {
    throw new ApiError(409, "You have already booked this appointment slot");
  }

  // 3. Atomic reservation: Find slot and decrement availableBookings if > 0
  const updatedSlot = await Slot.findOneAndUpdate(
    {
      _id: slotId,
      service: serviceId,
      isActive: true,
      status: "open",
      availableBookings: { $gt: 0 },
    },
    {
      $inc: { availableBookings: -1 },
    },
    { new: true },
  );

  if (!updatedSlot) {
    throw new ApiError(
      409,
      "The selected slot is no longer available or is fully booked",
    );
  }

  // 4. Update slot status to "full" if capacity reaches zero
  if (updatedSlot.availableBookings === 0) {
    updatedSlot.status = "full";
    await updatedSlot.save();
  }

  // 5. Create Booking Document
  const booking = await Booking.create({
    user: userId,
    service: serviceId,
    slot: slotId,
    bookingStatus: BOOKING_STATUS.CONFIRMED,
    notes: notes || "",
  });

  // Populate references for email & response
  await booking.populate([
    { path: "user", select: "name email" },
    { path: "service", select: "name category duration price" },
    { path: "slot", select: "date startTime endTime" },
  ]);

  // 6. Send Confirmation Email (Async - Non-blocking for response)
  if (booking.user?.email) {
    const formattedDate = new Date(booking.slot.date).toISOString().split("T")[0];
    const htmlContent = bookingConfirmationTemplate({
      name: booking.user.name,
      serviceName: booking.service.name,
      date: formattedDate,
      startTime: booking.slot.startTime,
      endTime: booking.slot.endTime,
      bookingId: booking._id.toString(),
    });

    sendEmail({
      to: booking.user.email,
      subject: `Booking Confirmed: ${booking.service.name} - KineticCare`,
      htmlContent,
      textContent: `Your booking for ${booking.service.name} on ${formattedDate} at ${booking.slot.startTime} has been confirmed.`,
    }).catch((err) => {
      console.error("⚠️ Failed to send booking confirmation email:", err.message);
    });
  }

  return booking;
};

/* ==========================================================
   Cancel Booking
========================================================== */

/**
 * Cancels a booking and atomically restores slot capacity.
 *
 * @param {string} bookingId
 * @param {string} userId
 * @param {string} userRole
 * @returns {Object} Cancelled booking document
 */
export const cancelBooking = async (bookingId, userId, userRole) => {
  const booking = await Booking.findById(bookingId).populate([
    { path: "user", select: "name email" },
    { path: "service", select: "name" },
    { path: "slot", select: "_id date startTime" },
  ]);

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  // Ownership verification: user can only cancel their own booking (Admins can cancel any)
  if (userRole !== "ADMIN" && booking.user._id.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to cancel this booking");
  }

  if (booking.bookingStatus === BOOKING_STATUS.CANCELLED) {
    throw new ApiError(400, "This booking is already cancelled");
  }

  // Update booking status
  booking.bookingStatus = BOOKING_STATUS.CANCELLED;
  await booking.save();

  // Atomically increment slot availability back and reopen slot if it was full
  await Slot.findByIdAndUpdate(booking.slot._id, {
    $inc: { availableBookings: 1 },
    $set: { status: "open" },
  });

  // Send Cancellation Email (Async)
  if (booking.user?.email) {
    const formattedDate = new Date(booking.slot.date).toISOString().split("T")[0];
    const htmlContent = bookingCancellationTemplate({
      name: booking.user.name,
      serviceName: booking.service.name,
      date: formattedDate,
      startTime: booking.slot.startTime,
    });

    sendEmail({
      to: booking.user.email,
      subject: `Booking Cancelled: ${booking.service.name} - KineticCare`,
      htmlContent,
      textContent: `Your booking for ${booking.service.name} on ${formattedDate} has been cancelled.`,
    }).catch((err) => {
      console.error("⚠️ Failed to send cancellation email:", err.message);
    });
  }

  return booking;
};

/* ==========================================================
   Get User Bookings (History & Filter)
========================================================== */

export const getUserBookings = async (userId, { page = 1, limit = 10, status } = {}) => {
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const filter = { user: userId };
  if (status) {
    filter.bookingStatus = status;
  }

  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .populate("service", "name category duration price imageUrl")
      .populate("slot", "date startTime endTime status")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Booking.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limitNum);

  return {
    bookings,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
    },
  };
};

/* ==========================================================
   Get Upcoming User Bookings
========================================================== */

export const getUpcomingBookings = async (userId) => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const bookings = await Booking.find({
    user: userId,
    bookingStatus: BOOKING_STATUS.CONFIRMED,
  })
    .populate("service", "name category duration price imageUrl")
    .populate({
      path: "slot",
      match: { date: { $gte: today } },
      select: "date startTime endTime status",
    })
    .sort({ createdAt: -1 })
    .lean();

  // Filter out any bookings where slot didn't match (past slots)
  const upcoming = bookings.filter((b) => b.slot !== null);

  return upcoming;
};

/* ==========================================================
   Get Booking By ID
========================================================== */

export const getBookingById = async (bookingId, userId, userRole) => {
  const booking = await Booking.findById(bookingId)
    .populate("user", "name email")
    .populate("service", "name category duration price imageUrl")
    .populate("slot", "date startTime endTime status")
    .lean();

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  if (userRole !== "ADMIN" && booking.user._id.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to view this booking");
  }

  return booking;
};

/* ==========================================================
   Get All Bookings (Admin)
========================================================== */

export const getAllBookings = async ({ page = 1, limit = 10, status, serviceId } = {}) => {
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const filter = {};
  if (status) filter.bookingStatus = status;
  if (serviceId) filter.service = serviceId;

  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .populate("user", "name email")
      .populate("service", "name category duration price")
      .populate("slot", "date startTime endTime status")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Booking.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limitNum);

  return {
    bookings,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
    },
  };
};
