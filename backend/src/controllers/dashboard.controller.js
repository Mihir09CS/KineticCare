import asyncHandler from "../helpers/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  getAdminDashboardStats,
  getUserDashboardStats,
} from "../services/dashboard.service.js";

/* ==========================================================
   Get Admin Dashboard Metrics
   GET /api/v1/dashboard/admin
   Access: Admin only
========================================================== */

export const getAdminDashboardHandler = asyncHandler(async (req, res) => {
  const data = await getAdminDashboardStats();

  return res
    .status(200)
    .json(new ApiResponse(200, "Admin dashboard metrics retrieved successfully", data));
});

/* ==========================================================
   Get User Dashboard Metrics
   GET /api/v1/dashboard/user
   Access: Authenticated User
========================================================== */

export const getUserDashboardHandler = asyncHandler(async (req, res) => {
  const data = await getUserDashboardStats(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, "User dashboard metrics retrieved successfully", data));
});
