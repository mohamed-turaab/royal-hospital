import { Router } from "express";
import { login, me, createUser, register, updateUser, deleteUser } from "../controllers/authController.js";
import { protect, authorize } from "../middleware/auth.js";
import { ROLES } from "../config/roles.js";
import User from "../models/User.js";

const router = Router();
router.post("/login", login);
router.post("/register", register);
router.get("/me", protect, me);
router.get("/roles", (_req, res) => res.json({ roles: ROLES }));
router.post("/users", protect, authorize("Admin"), createUser);
router.put("/users/:id", protect, authorize("Admin"), updateUser);
router.delete("/users/:id", protect, authorize("Admin"), deleteUser);
router.get("/users", protect, authorize("Admin"), async (req, res) => {
  const filter = req.query.role ? { role: req.query.role } : {};
  const users = await User.find(filter).select("-password");
  res.json(users);
});
export default router;
