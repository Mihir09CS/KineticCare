import asyncHandler from "../helpers/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import { getCurrentUser, updateProfile } from "../services/profile.service.js";

/* ==========================================================
   Get Current Logged In User
========================================================== */

export const getMe = asyncHandler(async (req, res) => {
  const user = await getCurrentUser(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, "User profile fetched successfully", user));
});

/* ==========================================================
   Update Profile
========================================================== */

export const updateMyProfile = asyncHandler(async (req, res) => {
  const user = await updateProfile(req.user._id, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, "Profile updated successfully", user));
});
