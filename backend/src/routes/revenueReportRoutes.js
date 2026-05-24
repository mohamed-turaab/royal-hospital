import { Router } from "express";
import {
  submitRevenueReport,
  getRevenueReports,
  updateReportStatus,
} from "../controllers/revenueReportController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

// Get reports (Admin and Accountant)
// Submit report (Accountant only)
router.route("/")
  .get(protect, authorize("Admin", "Accountant"), getRevenueReports)
  .post(protect, authorize("Admin", "Accountant"), submitRevenueReport);

// Update status (Admin only)
router.route("/:id/status")
  .patch(protect, authorize("Admin"), updateReportStatus);

export default router;
