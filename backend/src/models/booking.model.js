import mongoose from "mongoose";
import BOOKING_STATUS from "../constants/bookingStatus.js";
import PAYMENT_STATUS from "../constants/paymentStatus.js";

/* ==========================================================
   Booking Schema
========================================================== */

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: [true, "Service reference is required"],
    },

    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slot",
      required: [true, "Slot reference is required"],
    },

    bookingStatus: {
      type: String,
      enum: {
        values: Object.values(BOOKING_STATUS),
        message: "Invalid booking status",
      },
      default: BOOKING_STATUS.CONFIRMED,
    },

    paymentStatus: {
      type: String,
      enum: {
        values: Object.values(PAYMENT_STATUS),
        message: "Invalid payment status",
      },
      default: PAYMENT_STATUS.PENDING,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
      default: "",
    },

    bookedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

/* ==========================================================
   Indexes
========================================================== */

// Prevent duplicate active bookings for the same user on the same slot
bookingSchema.index({ user: 1, slot: 1, bookingStatus: 1 });

// Query user bookings efficiently by status and date
bookingSchema.index({ user: 1, bookingStatus: 1, bookedAt: -1 });

// Admin query index for slot & status lookup
bookingSchema.index({ slot: 1, bookingStatus: 1 });
bookingSchema.index({ bookingStatus: 1, createdAt: -1 });

/* ==========================================================
   Model
========================================================== */

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
