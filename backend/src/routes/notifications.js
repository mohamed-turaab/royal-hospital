import { Router } from "express";
import { protect } from "../middleware/auth.js";
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  clearAllNotifications,
} from "../controllers/notificationController.js";

const router = Router();

router.use(protect);

router.get("/", getMyNotifications);
router.patch("/read-all", markAllAsRead);
router.patch("/:id/read", markAsRead);
router.delete("/clear", clearAllNotifications);

export default router;
