import { Router } from "express";
import { listAppointments, createAppointment, updateAppointment, deleteAppointment } from "../controllers/appointmentController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();
router.use(protect);
router.get("/", authorize("Admin", "Doctor", "Receptionist", "Patient"), listAppointments);
router.post("/", authorize("Admin", "Doctor", "Receptionist", "Patient"), createAppointment);
router.put("/:id", authorize("Admin", "Doctor", "Receptionist"), updateAppointment);
router.delete("/:id", authorize("Admin", "Doctor", "Receptionist"), deleteAppointment);
export default router;
