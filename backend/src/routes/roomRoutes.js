import { Router } from "express";
import {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  assignPatient,
} from "../controllers/roomController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.get("/", protect, getRooms);
router.post("/", protect, authorize("Admin"), createRoom);
router.put("/:id", protect, authorize("Admin"), updateRoom);
router.delete("/:id", protect, authorize("Admin"), deleteRoom);
router.post("/assign", protect, authorize("Admin", "Receptionist"), assignPatient);

export default router;
