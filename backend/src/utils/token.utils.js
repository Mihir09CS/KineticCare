import jwt from "jsonwebtoken";

/**
 * ---------------------------------------------------------
 * Generate Access Token
 * ---------------------------------------------------------
 */

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );
};

/**
 * ---------------------------------------------------------
 * Generate Refresh Token
 * ---------------------------------------------------------
 */

export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES,
    },
  );
};

/**
 * ---------------------------------------------------------
 * Verify Access Token
 * ---------------------------------------------------------
 */

export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * ---------------------------------------------------------
 * Verify Refresh Token
 * ---------------------------------------------------------
 */

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};
