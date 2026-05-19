import { Router } from "express";
import { 
  getReports, 
  createReport, 
  updateReportStatus, 
  deleteReport 
} from "../controllers/reportController.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = Router();

// Apply auth middleware to all report routes
router.use(protect);

router.get("/", getReports);
router.post("/", upload.single("file"), createReport);
router.patch("/:id/status", updateReportStatus);
router.delete("/:id", deleteReport);

export default router;
