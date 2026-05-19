import { Router } from "express";
import { listDoctors, createDoctor, updateDoctor, deleteDoctor } from "../controllers/doctorController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();
router.use(protect);
router.get("/", authorize("Admin", "Doctor", "Nurse", "Receptionist", "Patient", "Pharmacist"), listDoctors);
router.post("/", authorize("Admin"), createDoctor);
router.put("/:id", authorize("Admin"), updateDoctor);
router.delete("/:id", authorize("Admin"), deleteDoctor);
export default router;
