import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../helpers/asyncHandler.js";

/* ==========================================================
   Authenticate User
========================================================== */

export const authenticate = asyncHandler(async (req, res, next) => {
  let token = null;

  // 1. Check Authorization Header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2. Check HttpOnly Cookie
  if (!token && req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw new ApiError(401, "Authentication required");
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired access token");
  }

  const user = await User.findById(decoded.id).select("-refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  req.user = user;

  next();
});

/* ==========================================================
   Authorize Roles
========================================================== */

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, "You are not authorized to access this resource");
    }

    next();
  };
};
