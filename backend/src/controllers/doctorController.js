import Doctor from "../models/Doctor.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createNotification } from "../controllers/notificationController.js";

export async function listDoctors(req, res) {
  const doctors = await Doctor.find().populate("user", "name email role profileImage");
  res.json(doctors);
}

export async function createDoctor(req, res) {
  try {
    const { name, email, password, specialization, phone, profileImage } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (!user) {
      if (!password) return res.status(400).json({ message: "Password is required for new accounts" });
      const hashed = await bcrypt.hash(password, 10);
      user = await User.create({
        name,
        email,
        password: hashed,
        role: "Doctor",
        profileImage: profileImage || "",
        status: "Active"
      });
    }

    // Check if doctor profile already exists for this user
    const existingDoctor = await Doctor.findOne({ user: user._id });
    if (existingDoctor) {
      return res.status(400).json({ message: "Doctor profile already exists for this email" });
    }

    const doctor = await Doctor.create({
      user: user._id,
      name: user.name,
      specialization,
      phone: phone || "",
      profileImage: user.profileImage
    });

    const populatedDoctor = await Doctor.findById(doctor._id).populate("user", "name email role profileImage status");
    await createNotification({
  roles: ["Receptionist"],
  title: "New Doctor Registered",
  body: `Doctor ${doctor.name} (${doctor.specialization}) has been added. Prepare billing.`,
  type: "info",
  link: "/reception/billing"
});
res.status(201).json(populatedDoctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateDoctor(req, res) {
  const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(doctor);
}

export async function deleteDoctor(req, res) {
  await Doctor.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
}
