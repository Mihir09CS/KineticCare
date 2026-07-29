import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { OAuth2Client } from "google-auth-library";
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

/**
 * =========================================================
 * Google Authentication User
 * =========================================================
 */
export const googleLoginUser = async ({ idToken }) => {
  if (!idToken) {
    throw new ApiError(400, "Google ID token is required");
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const client = new OAuth2Client(clientId);

  let payload;
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: clientId,
    });
    payload = ticket.getPayload();
  } catch (error) {
    throw new ApiError(
      401,
      "Google token verification failed: " + (error.message || "Invalid or expired token")
    );
  }

  if (!payload || !payload.email) {
    throw new ApiError(400, "Invalid Google token payload");
  }

  const { sub: googleId, email, name, picture } = payload;
  const normalizedEmail = email.toLowerCase();

  let user = await User.findOne({ email: normalizedEmail }).select("+refreshToken");

  if (user) {
    // Account Linking: Link googleId and set avatar if missing
    let modified = false;
    if (!user.googleId) {
      user.googleId = googleId;
      modified = true;
    }
    if (!user.avatar && picture) {
      user.avatar = picture;
      modified = true;
    }
    if (modified) {
      await user.save({ validateBeforeSave: false });
    }
  } else {
    // Automatically create account for new Google user
    user = await User.create({
      name: name || normalizedEmail.split("@")[0],
      email: normalizedEmail,
      googleId,
      avatar: picture || "",
      provider: "google",
      isVerified: true,
    });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

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

