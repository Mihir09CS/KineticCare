import express from "express";
import {
  getAdminDashboardHandler,
  getUserDashboardHandler,
} from "../controllers/dashboard.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// Authenticated routes
router.use(authenticate);

/**
 * GET /api/v1/dashboard/user
 * Retrieve metrics and upcoming appointments for the logged-in user.
 */
router.get("/user", getUserDashboardHandler);

/**
 * GET /api/v1/dashboard/admin
 * Retrieve system-wide statistics and appointments for Admin.
 */
router.get("/admin", authorize("ADMIN"), getAdminDashboardHandler);

export default router;
