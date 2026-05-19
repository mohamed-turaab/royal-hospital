import { Router } from "express";
import { listPrescriptions, createPrescription, updatePrescriptionStatus } from "../controllers/prescriptionController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();
router.use(protect);
router.get("/", authorize("Admin", "Doctor", "Nurse", "Pharmacist", "Patient"), listPrescriptions);
router.post("/", authorize("Doctor"), createPrescription);
router.patch("/:id/status", authorize("Admin", "Pharmacist"), updatePrescriptionStatus);
export default router;
