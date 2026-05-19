import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Patient from "../models/Patient.js";
import { ROLES, ROLE_STATUS } from "../config/roles.js";

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

export async function login(req, res) {
  const { email, password, role } = req.body;
  const normalizedRole = role && ROLES.includes(role) ? role : null;
  const user = normalizedRole
    ? await User.findOne({ email, role: normalizedRole }).select("+password")
    : await User.findOne({ email }).select("+password");
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });
  const token = signToken(user);
  const safeUser = (await User.findById(user._id).select("-password")).toObject();
  safeUser.status = safeUser.status || ROLE_STATUS[safeUser.role] || "Active";
  res.json({ token, user: safeUser });
}

export async function me(req, res) {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user });
}

export async function createUser(req, res) {
  const { name, email, password, role, profileImage, gender, phone } = req.body;
  if (!ROLES.includes(role)) return res.status(400).json({ message: "Invalid role" });
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already exists" });
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashed,
    role,
    profileImage,
    gender: gender || "",
    phone: phone || "",
    status: ROLE_STATUS[role] || "Active",
  });
  const safeUser = (await User.findById(user._id).select("-password")).toObject();
  res.status(201).json(safeUser);
}

export async function register(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already exists" });

  const hashed = await bcrypt.hash(password, 10);
  
  // Force role to 'Patient' for public registration
  const user = await User.create({
    name,
    email,
    password: hashed,
    role: "Patient",
    status: ROLE_STATUS["Patient"] || "Active",
  });

  // Automatically create Patient profile document for patient directory & records
  await Patient.create({
    user: user._id,
    name: user.name,
    age: 35,
    gender: "Male",
    bloodGroup: "O+",
    phone: "",
    address: "",
    condition: "Undiagnosed",
    status: "Stable",
    room: "Unassigned",
    vitals: { hr: 80, bp: "120/80", temp: "37.0°C", o2: "98%" }
  });
  
  const token = signToken(user);
  const safeUser = (await User.findById(user._id).select("-password")).toObject();
  res.status(201).json({ token, user: safeUser });
}

export async function updateUser(req, res) {
  const { id } = req.params;
  const { name, email, role, status, password, profileImage, gender, phone } = req.body;
  
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (email && email !== user.email) {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });
    user.email = email;
  }

  if (name) user.name = name;
  if (role && ROLES.includes(role)) user.role = role;
  if (status) user.status = status;
  if (profileImage !== undefined) user.profileImage = profileImage;
  if (gender !== undefined) user.gender = gender;
  if (phone !== undefined) user.phone = phone;
  
  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  await user.save();
  const safeUser = (await User.findById(user._id).select("-password")).toObject();
  res.json(safeUser);
}

export async function deleteUser(req, res) {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User deleted successfully" });
}
