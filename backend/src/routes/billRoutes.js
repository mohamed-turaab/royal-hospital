import { Router } from "express";
import { createBill, getBills, checkoutBills } from "../controllers/billController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

// Protect all routes under bills
router.use(protect);

// GET bills, POST manual bill
router.route("/")
  .get(authorize("Admin", "Accountant", "Receptionist"), getBills)
  .post(authorize("Admin", "Doctor"), createBill);

// POST checkout
router.route("/checkout")
  .post(authorize("Admin", "Receptionist"), checkoutBills);

export default router;
