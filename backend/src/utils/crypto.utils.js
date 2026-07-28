import crypto from "crypto";

/**
 * Generate a secure random reset token
 * @returns {string}
 */
export const generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

/**
 * Hash a token using SHA-256 before storing it
 * @param {string} token
 * @returns {string}
 */
export const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
