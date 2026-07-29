import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { generateResetToken, hashToken } from "../utils/crypto.utils.js";
import { resetPasswordTemplate } from "../templates/resetPassword.template.js";
import { sendEmail } from "./email.service.js";

// Forgot Password


export const forgotPasswordService = async (email) => {
  // Find user
  const user = await User.findOne({ email });

  // Always return success to prevent email enumeration
  if (!user) {
    return {
      success: true,
      message:
        "If an account exists with this email, a password reset link has been sent.",
    };
  }

  // Generate reset token
  const resetToken = generateResetToken();

  // Hash token before storing
  const hashedToken = hashToken(resetToken);

  // Save token & expiry
  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

  // Skip password validation while saving
  await user.save({ validateBeforeSave: false });

  // Create reset URL
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  // Generate HTML email
  const html = resetPasswordTemplate({
    name: user.name,
    resetUrl,
  });

  // Send email
  await sendEmail({
    to: user.email,
    subject: "Reset Your KineticCare Password",
    htmlContent: html,
    textContent: `Reset your password using this link: ${resetUrl}`,
  });

  return {
    success: true,
    message:
      "If an account exists with this email, a password reset link has been sent.",
  };
};

export const resetPasswordService = async (token, newPassword) => {
  // Hash the incoming token
  const hashedToken = hashToken(token);

  // Find matching user
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Password reset token is invalid or has expired.");
  }

  // Update password
  user.password = newPassword;

  // Clear reset fields
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  // Save user (password will be hashed by pre-save hook)
  await user.save();

  return {
    success: true,
    message: "Password has been reset successfully.",
  };
};

/* ==========================================================
   Change Password
========================================================== */

export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.provider === "google") {
    throw new ApiError(
      400,
      "Google accounts cannot change password. Please use Google Sign In.",
    );
  }

  const isPasswordCorrect = await user.comparePassword(currentPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Current password is incorrect");
  }

  user.password = newPassword;

  // Password hashing will happen automatically
  // because of the pre("save") hook in user.model.js

  await user.save();

  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
  };
};
