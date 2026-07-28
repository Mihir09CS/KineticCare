import mongoose from "mongoose";
import Slot from "../models/slot.model.js";
import Service from "../models/service.model.js";
import ApiError from "../utils/ApiError.js";

/* ==========================================================
   Internal Helpers
========================================================== */

/**
 * Normalise an incoming date string to midnight UTC.
 * Ensures consistent date-only storage regardless of client timezone.
 *
 * @param {string|Date} value
 * @returns {Date}
 */
const toMidnightUTC = (value) => {
  const d = new Date(value);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

/**
 * Builds a [startOfDay, endOfDay] range for a given date,
 * used to safely query all slots belonging to one calendar day.
 *
 * @param {string|Date} value
 * @returns {{ $gte: Date, $lte: Date }}
 */
const buildDayRange = (value) => {
  const start = toMidnightUTC(value);
  const end = new Date(start);
  end.setUTCHours(23, 59, 59, 999);
  return { $gte: start, $lte: end };
};

/**
 * Derives slot status from availableBookings.
 * Does NOT override a manually-set "cancelled" status.
 *
 * @param {number} availableBookings
 * @param {string} currentStatus
 * @returns {"open"|"full"|"cancelled"}
 */
const deriveStatus = (availableBookings, currentStatus) => {
  if (currentStatus === "cancelled") return "cancelled";
  return availableBookings > 0 ? "open" : "full";
};

/* ==========================================================
   Create Slot
========================================================== */

/**
 * Creates a new slot for a given service.
 *
 * Guards:
 *  - Service must exist and be active
 *  - No duplicate slot (service + date + startTime) — enforced by
 *    the unique index; we also do a pre-check for a clean error message.
 *
 * @param {Object} data  { service, date, startTime, endTime, maxBookings }
 * @returns {Object}     Populated slot document
 */
export const createSlot = async (data) => {
  const { service: serviceId, date, startTime, endTime, maxBookings } = data;

  // 1. Verify the referenced service exists and is active
  const service = await Service.findById(serviceId);

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  if (!service.isActive) {
    throw new ApiError(400, "Cannot create slots for an inactive service");
  }

  // 2. Normalise date to midnight UTC for consistent storage
  const slotDate = toMidnightUTC(date);

  // 3. Duplicate check — gives a clean message before the unique index fires
  const duplicate = await Slot.findOne({
    service: serviceId,
    date: slotDate,
    startTime,
  });

  if (duplicate) {
    throw new ApiError(
      409,
      "A slot already exists for this service at the given date and start time",
    );
  }

  // 4. Create — pre-save hook seeds availableBookings = maxBookings
  const slot = await Slot.create({
    service: serviceId,
    date: slotDate,
    startTime,
    endTime,
    maxBookings,
  });

  await slot.populate("service", "name category duration price");

  return slot;
};

/* ==========================================================
   Get Slots By Service  (Public)
========================================================== */

/**
 * Returns all active, non-cancelled slots for a service.
 * Optionally filtered to a specific calendar date.
 * Only upcoming slots (today or later) are returned.
 *
 * @param {string} serviceId   Service ObjectId
 * @param {Object} options     { date }
 * @returns {Array}            Array of slot documents
 */
export const getSlotsByService = async (serviceId, { date } = {}) => {
  // Verify service exists
  const service = await Service.findById(serviceId);

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  // Base filter: active slots for this service from today onwards
  const todayMidnight = toMidnightUTC(new Date());

  const filter = {
    service: serviceId,
    isActive: true,
    status: { $ne: "cancelled" },
    date: { $gte: todayMidnight },
  };

  // Narrow to a single date if provided
  if (date) {
    filter.date = buildDayRange(date);
  }

  const slots = await Slot.find(filter)
    .populate("service", "name category duration price")
    .sort({ date: 1, startTime: 1 })
    .lean();

  return slots;
};

/* ==========================================================
   Get All Slots  (Admin)
========================================================== */

/**
 * Returns a paginated list of slots with optional filters.
 * Intended for admin use — includes inactive and cancelled slots.
 *
 * @param {Object} options  { page, limit, serviceId, date, status, isActive }
 * @returns {{ slots: Array, pagination: Object }}
 */
export const getAllSlots = async ({
  page = 1,
  limit = 10,
  serviceId,
  date,
  status,
  isActive,
} = {}) => {
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const filter = {};

  if (serviceId) {
    filter.service = new mongoose.Types.ObjectId(serviceId);
  }

  if (date) {
    filter.date = buildDayRange(date);
  }

  if (status) {
    filter.status = status;
  }

  if (isActive !== undefined) {
    filter.isActive = isActive === "true" || isActive === true;
  }

  const [slots, total] = await Promise.all([
    Slot.find(filter)
      .populate("service", "name category")
      .sort({ date: 1, startTime: 1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Slot.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limitNum);

  return {
    slots,
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
   Get Slot By ID
========================================================== */

/**
 * Retrieves a single slot by its ID.
 *
 * @param {string} id  Slot ObjectId
 * @returns {Object}   Slot document
 */
export const getSlotById = async (id) => {
  const slot = await Slot.findById(id)
    .populate("service", "name category duration price")
    .lean();

  if (!slot) {
    throw new ApiError(404, "Slot not found");
  }

  return slot;
};

/* ==========================================================
   Update Slot
========================================================== */

/**
 * Updates a slot by ID.
 *
 * Special handling for maxBookings changes:
 *  - Calculates the number of confirmed bookings already made
 *    (maxBookings - availableBookings)
 *  - Rejects the update if new maxBookings would be less than
 *    the number of existing bookings to prevent overbooking
 *  - Adjusts availableBookings proportionally
 *  - Re-derives status from new availableBookings (unless already cancelled)
 *
 * @param {string} id       Slot ObjectId
 * @param {Object} updates  Partial slot fields
 * @returns {Object}        Updated slot document
 */
export const updateSlot = async (id, updates) => {
  const slot = await Slot.findById(id);

  if (!slot) {
    throw new ApiError(404, "Slot not found");
  }

  // Handle maxBookings adjustment
  if (
    updates.maxBookings !== undefined &&
    updates.maxBookings !== slot.maxBookings
  ) {
    const confirmedBookings = slot.maxBookings - slot.availableBookings;
    const newMax = parseInt(updates.maxBookings, 10);

    if (newMax < confirmedBookings) {
      throw new ApiError(
        409,
        `Cannot reduce max bookings below the number of existing bookings (${confirmedBookings})`,
      );
    }

    // Adjust available slots proportionally
    slot.availableBookings = newMax - confirmedBookings;
    slot.maxBookings = newMax;

    // Remove maxBookings from updates — already applied above
    delete updates.maxBookings;
  }

  // Normalise date if being updated
  if (updates.date) {
    updates.date = toMidnightUTC(updates.date);
  }

  // Apply remaining updates
  Object.assign(slot, updates);

  // Re-derive status unless admin explicitly set it or it's cancelled
  if (updates.status === undefined) {
    slot.status = deriveStatus(slot.availableBookings, slot.status);
  }

  await slot.save();

  await slot.populate("service", "name category duration price");

  return slot;
};

/* ==========================================================
   Delete Slot  (Soft Delete)
========================================================== */

/**
 * Soft-deletes a slot: sets isActive = false and status = "cancelled".
 * Preserves the record for existing booking history.
 *
 * @param {string} id  Slot ObjectId
 * @returns {{ success: boolean }}
 */
export const deleteSlot = async (id) => {
  const slot = await Slot.findById(id);

  if (!slot) {
    throw new ApiError(404, "Slot not found");
  }

  if (!slot.isActive) {
    throw new ApiError(409, "Slot is already deactivated");
  }

  slot.isActive = false;
  slot.status = "cancelled";

  await slot.save();

  return { success: true };
};
