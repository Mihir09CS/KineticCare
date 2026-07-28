import User from "../models/user.model.js";
import Service from "../models/service.model.js";
import Slot from "../models/slot.model.js";
import Booking from "../models/booking.model.js";
import BOOKING_STATUS from "../constants/bookingStatus.js";

/* ==========================================================
   Admin Dashboard Metrics
========================================================== */

/**
 * Aggregates overall system statistics for the Admin Dashboard:
 *  - Total Users, Services, Slots, and Bookings
 *  - Today's Appointments
 *  - Upcoming Appointments
 *
 * @returns {Object} Admin dashboard metrics object
 */
export const getAdminDashboardStats = async () => {
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  const todayEnd = new Date(todayStart);
  todayEnd.setUTCHours(23, 59, 59, 999);

  // Aggregate counts in parallel
  const [
    totalUsers,
    totalServices,
    totalSlots,
    totalBookings,
    todaysBookings,
    upcomingBookings,
  ] = await Promise.all([
    User.countDocuments({ role: "USER" }),
    Service.countDocuments({ isActive: true }),
    Slot.countDocuments({ isActive: true }),
    Booking.countDocuments(),

    // Today's appointments
    Booking.find({
      bookingStatus: BOOKING_STATUS.CONFIRMED,
    })
      .populate("user", "name email avatar")
      .populate("service", "name category duration price")
      .populate({
        path: "slot",
        match: { date: { $gte: todayStart, $lte: todayEnd } },
        select: "date startTime endTime status",
      })
      .sort({ createdAt: -1 })
      .lean(),

    // Upcoming appointments (today or future dates)
    Booking.find({
      bookingStatus: BOOKING_STATUS.CONFIRMED,
    })
      .populate("user", "name email avatar")
      .populate("service", "name category duration price")
      .populate({
        path: "slot",
        match: { date: { $gte: todayStart } },
        select: "date startTime endTime status",
      })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
  ]);

  // Filter out records where slot didn't match the date criteria
  const filteredTodaysAppointments = todaysBookings.filter(
    (b) => b.slot !== null,
  );
  const filteredUpcomingAppointments = upcomingBookings.filter(
    (b) => b.slot !== null,
  );

  return {
    stats: {
      totalUsers,
      totalServices,
      totalSlots,
      totalBookings,
    },
    todaysAppointments: filteredTodaysAppointments,
    upcomingAppointments: filteredUpcomingAppointments,
  };
};

/* ==========================================================
   User Dashboard Metrics
========================================================== */

/**
 * Aggregates personalized metrics for the logged-in User:
 *  - Total, Confirmed, Cancelled, and Completed counts
 *  - User's Upcoming Bookings
 *  - User's Recent Booking History
 *
 * @param {string} userId
 * @returns {Object} User dashboard metrics object
 */
export const getUserDashboardStats = async (userId) => {
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  const [
    totalBookings,
    confirmedBookings,
    cancelledBookings,
    completedBookings,
    allUserBookings,
  ] = await Promise.all([
    Booking.countDocuments({ user: userId }),
    Booking.countDocuments({ user: userId, bookingStatus: BOOKING_STATUS.CONFIRMED }),
    Booking.countDocuments({ user: userId, bookingStatus: BOOKING_STATUS.CANCELLED }),
    Booking.countDocuments({ user: userId, bookingStatus: BOOKING_STATUS.COMPLETED }),

    // Fetch user bookings with populated slot to filter upcoming & recent
    Booking.find({ user: userId })
      .populate("service", "name category duration price imageUrl")
      .populate("slot", "date startTime endTime status")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
  ]);

  // Separate upcoming confirmed bookings from recent history
  const upcomingBookings = allUserBookings.filter(
    (b) =>
      b.bookingStatus === BOOKING_STATUS.CONFIRMED &&
      b.slot &&
      new Date(b.slot.date) >= todayStart,
  );

  return {
    stats: {
      totalBookings,
      confirmedBookings,
      cancelledBookings,
      completedBookings,
    },
    upcomingBookings,
    recentHistory: allUserBookings.slice(0, 5),
  };
};
