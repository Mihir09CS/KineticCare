import mongoose from "mongoose";

/* ==========================================================
   Service Categories
========================================================== */

export const SERVICE_CATEGORIES = [
  "Physiotherapy",
  "Yoga",
  "Meditation",
  "Nutrition",
  "Massage Therapy",
  "Mental Wellness",
  "Fitness",
  "Occupational Therapy",
  "Hydrotherapy",
  "Balance & Mobility",
];

/* ==========================================================
   Service Schema
========================================================== */

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
      minlength: [3, "Service name must be at least 3 characters"],
      maxlength: [100, "Service name cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Service description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: SERVICE_CATEGORIES,
        message: "Invalid service category",
      },
    },

    duration: {
      type: Number,
      required: [true, "Duration is required"],
      min: [15, "Duration must be at least 15 minutes"],
      max: [480, "Duration cannot exceed 480 minutes"],
      comment: "Duration in minutes",
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },

    imageUrl: {
      type: String,
      default: "",
      trim: true,
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

// Compound index for category + isActive filtering
serviceSchema.index({ category: 1, isActive: 1 });

// Index for listing active services efficiently
serviceSchema.index({ isActive: 1, createdAt: -1 });

/* ==========================================================
   Model
========================================================== */

const Service = mongoose.model("Service", serviceSchema);

export default Service;
