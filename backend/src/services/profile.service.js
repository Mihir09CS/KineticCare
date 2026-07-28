import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

/* ==========================================================
   Get Current User
========================================================== */

export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId).select(
    "-password -refreshToken -passwordResetToken -passwordResetExpires",
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

/* ==========================================================
   Update Profile
========================================================== */

export const updateProfile = async (userId, { fullName, avatar }) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (fullName !== undefined) {
    user.fullName = fullName;
  }

  if (avatar !== undefined) {
    user.avatar = avatar;
  }

  await user.save();

  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    provider: user.provider,
    updatedAt: user.updatedAt,
  };
};
