import mongoose from "mongoose";

/* ==========================================================
   Slot Schema
========================================================== */

const slotSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: [true, "Service reference is required"],
    },

    date: {
      type: Date,
      required: [true, "Slot date is required"],
    },

    startTime: {
      type: String,
      required: [true, "Start time is required"],
      match: [
        /^([01]\d|2[0-3]):([0-5]\d)$/,
        "Start time must be in HH:MM 24-hour format",
      ],
    },

    endTime: {
      type: String,
      required: [true, "End time is required"],
      match: [
        /^([01]\d|2[0-3]):([0-5]\d)$/,
        "End time must be in HH:MM 24-hour format",
      ],
    },

    maxBookings: {
      type: Number,
      required: [true, "Max bookings is required"],
      min: [1, "Max bookings must be at least 1"],
      max: [100, "Max bookings cannot exceed 100"],
    },

    availableBookings: {
      type: Number,
      min: [0, "Available bookings cannot be negative"],
    },

    status: {
      type: String,
      enum: {
        values: ["open", "full", "cancelled"],
        message: "Status must be open, full, or cancelled",
      },
      default: "open",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

/* ==========================================================
   Indexes
========================================================== */

// Prevents duplicate slots: same service on the same date at the same start time
slotSchema.index(
  { service: 1, date: 1, startTime: 1 },
  { unique: true, name: "unique_service_date_startTime" },
);

// Efficient lookup of a service's slots for a given date (public endpoint)
slotSchema.index({ service: 1, date: 1, isActive: 1 });

// Admin listing: filter by date range and status
slotSchema.index({ date: 1, status: 1 });

/* ==========================================================
   Hooks
========================================================== */

// On creation, seed availableBookings from maxBookings
slotSchema.pre("save", async function () {
  this.availableBookings = this.maxBookings;
});
/* ==========================================================
   Model
========================================================== */

const Slot = mongoose.model("Slot", slotSchema);

export default Slot;
