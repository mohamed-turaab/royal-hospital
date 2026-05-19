import { Router } from "express";
import authRoutes from "./authRoutes.js";
import patientRoutes from "./patientRoutes.js";
import doctorRoutes from "./doctorRoutes.js";
import appointmentRoutes from "./appointmentRoutes.js";
import prescriptionRoutes from "./prescriptionRoutes.js";
import roomRoutes from "./roomRoutes.js";
import analyticsRoutes from "./analyticsRoutes.js";
import reportRoutes from "./reportRoutes.js";
import revenueReportRoutes from "./revenueReportRoutes.js";
import transactionRoutes from "./transactionRoutes.js";
import billRoutes from "./billRoutes.js";

const router = Router();
router.use("/auth", authRoutes);
router.use("/patients", patientRoutes);
router.use("/doctors", doctorRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/prescriptions", prescriptionRoutes);
router.use("/rooms", roomRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/reports", reportRoutes);
router.use("/revenue-reports", revenueReportRoutes);
router.use("/transactions", transactionRoutes);
router.use("/bills", billRoutes);
export default router;

