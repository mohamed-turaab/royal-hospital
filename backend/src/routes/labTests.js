import { Router } from "express";
import { protect, authorize } from "../middleware/auth.js";
import { roleGuard } from "../middleware/roleGuard.js";
import {
  createLabTest,
  markPaid,
  markSampleCollected,
  uploadResult,
  getLabTest,
  getAllLabTests,
} from "../controllers/labTestController.js";
import { upload } from "../config/upload.js";

const router = Router();

// All routes require authentication
router.use(protect);

// GET all lab tests (role-filtered)
router.get(
  "/",
  roleGuard("Admin", "Doctor", "Nurse", "Receptionist", "Accountant", "Lab Technician", "Patient"),
  getAllLabTests
);

// Doctor creates a lab test order
router.post(
  "/",
  authorize("Doctor"),
  createLabTest
);

// Receptionist marks as Paid
router.patch(
  "/:id/pay",
  authorize("Receptionist", "Admin", "Accountant"),
  markPaid
);

// Nurse marks sample collected
router.patch(
  "/:id/collect",
  authorize("Nurse"),
  markSampleCollected
);

// Lab Technician uploads result
router.patch(
  "/:id/result",
  authorize("Lab Technician"),
  upload.single("resultFile"),
  uploadResult
);

// Get single lab test details
router.get(
  "/:id",
  roleGuard("Doctor", "Nurse", "Lab Technician", "Patient", "Admin"),
  getLabTest
);

export default router;
