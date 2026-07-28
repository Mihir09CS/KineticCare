import  asyncHandler  from "../helpers/asyncHandler.js";
import ApiResponse  from "../utils/ApiResponse.js";
import {
  changePassword,
  forgotPasswordService,
  resetPasswordService,
} from "../services/password.service.js";

// forgot password

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const result = await forgotPasswordService(email);

  return res.status(200).json(new ApiResponse(200, result, result.message));
});

// reset password

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const result = await resetPasswordService(token, password);

  return res.status(200).json(new ApiResponse(200, result, result.message));
});
/* ==========================================================
   Change Password
========================================================== */

export const changeMyPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  await changePassword(req.user._id, currentPassword, newPassword);

  return res
    .status(200)
    .json(new ApiResponse(200, "Password changed successfully"));
});
