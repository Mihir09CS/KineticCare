/**
 * ---------------------------------------------------------
 * Cookie Configuration
 * ---------------------------------------------------------
 * Used for storing Access Token & Refresh Token
 * in secure HttpOnly cookies.
 * ---------------------------------------------------------
 */

const isProduction = process.env.NODE_ENV === "production";

export const accessTokenCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 15 * 60 * 1000, // 15 Minutes
};

export const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
};
