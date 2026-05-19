import { Router } from "express";
import { getTransactions, getTransactionStats } from "../controllers/transactionController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

// Protect all routes under transactions
router.use(protect);
router.use(authorize("Admin", "Accountant", "Receptionist"));

// GET listings
router.route("/").get(getTransactions);

// GET stats
router.route("/stats").get(getTransactionStats);

export default router;
