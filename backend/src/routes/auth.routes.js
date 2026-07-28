import express from "express";

import { register, login, logout  } from "../controllers/auth.controller.js";

import { getMe, updateMyProfile } from "../controllers/profile.controller.js";
import { forgotPassword, resetPassword, changeMyPassword } from "../controllers/password.controller.js";

import {
  registerValidator,
  loginValidator,
  updateProfileValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  changePasswordValidator
} from "../validators/auth.validator.js";

import  validate  from "../middleware/validate.middleware.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

/* ==========================
   Public Routes
========================== */

router.post("/register", registerValidator, validate, register);

router.post("/login", loginValidator, validate, login);
router.post(
  "/forgot-password",
  forgotPasswordValidator,
  validate,
  forgotPassword,
);

router.post(
  "/reset-password/:token",
  resetPasswordValidator,
  validate,
  resetPassword,
);


/* ==========================
   Protected Routes
========================== */


router.get("/me", authenticate, getMe);

router.patch(
  "/profile",
  authenticate,
  updateProfileValidator,
  validate,
  updateMyProfile,
);


router.patch(
  "/change-password",
  authenticate,
  changePasswordValidator,
  validate,
  changeMyPassword,
);

router.post("/logout", authenticate, logout);

export default router;
