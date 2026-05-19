import { Router } from "express";
import { listPatients, createPatient, updatePatient, deletePatient } from "../controllers/patientController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();
router.use(protect);
router.get("/", authorize("Admin", "Doctor", "Nurse", "Receptionist", "Patient"), listPatients);
router.post("/", authorize("Admin", "Nurse", "Receptionist", "Doctor"), createPatient);
router.put("/:id", authorize("Admin", "Nurse", "Receptionist", "Doctor"), updatePatient);
router.delete("/:id", authorize("Admin", "Doctor"), deletePatient);
export default router;
