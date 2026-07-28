import express from "express";

import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js"


const router = express.Router();



router.use("/auth", authRoutes);
router.use("/health", healthRoutes);



// | router.use("/services", serviceRoutes);
// | router.use("/slots", slotRoutes);
// | router.use("/bookings", bookingRoutes);
// |

export default router;
