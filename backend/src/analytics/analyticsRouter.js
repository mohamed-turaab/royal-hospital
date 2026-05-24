import { Router } from "express";
import { getAdminAnalytics } from "../controllers/analyticsController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.get("/admin", protect, authorize("Admin"), getAdminAnalytics);

export default router;
