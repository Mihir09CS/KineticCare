import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token.utils.js";

/**
 * =========================================================
 * Register User
 * =========================================================
 */
export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    provider: user.provider,
    createdAt: user.createdAt,
  };
};

/**
 * =========================================================
 * Login User
 * =========================================================
 */
export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password +refreshToken");

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (user.provider === "google") {
    throw new ApiError(400, "This account uses Google Sign In");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password");
  }

  const accessToken = generateAccessToken(user);

  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;

  await user.save({
    validateBeforeSave: false,
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      provider: user.provider,
    },
  };
};

/**
 * =========================================================
 * Logout User
 * =========================================================
 */
export const logoutUser = async (userId) => {
  await User.findByIdAndUpdate(
    userId,
    {
      refreshToken: null,
    },
    {
      new: true,
    },
  );

  return true;
};
