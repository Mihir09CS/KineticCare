import asyncHandler from "../helpers/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from "../utils/cookieOptions.js";

import {
  registerUser,
  loginUser,
  logoutUser,
} from "../services/auth.service.js";

/* ==========================================================
   Register User
========================================================== */

export const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, "Registration successful", user));
});

/* ==========================================================
   Login User
========================================================== */

export const login = asyncHandler(async (req, res) => {
  const { accessToken, refreshToken, user } = await loginUser(req.body);

  return res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenCookieOptions)
    .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
    .json(new ApiResponse(200, "Login successful", user));
});

/* ==========================================================
   Logout User
========================================================== */

export const logout = asyncHandler(async (req, res) => {
  await logoutUser(req.user.id);

  return res
    .status(200)
    .clearCookie("accessToken", accessTokenCookieOptions)
    .clearCookie("refreshToken", refreshTokenCookieOptions)
    .json(new ApiResponse(200, "Logout successful"));
});
