import mongoose from "mongoose";
import { ROLES } from "../config/roles.js";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, required: true, enum: ROLES },
    profileImage: { type: String, default: "" },
    status: { type: String, default: "Active" },
    gender: { type: String, enum: ["Male", "Female", ""], default: "" },
    phone: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
