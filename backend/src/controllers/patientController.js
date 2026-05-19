import Patient from "../models/Patient.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export async function listPatients(req, res) {
  const filter = req.user.role === "Patient" ? { user: req.user.id || req.user._id } : {};
  const patients = await Patient.find(filter)
    .populate("user", "name email role profileImage")
    .populate("assignedDoctor", "name specialization");
  res.json(patients);
}

export async function createPatient(req, res) {
  try {
    const { name, email, password, age, gender, bloodGroup, phone, address, profileImage, condition, status, room, assignedDoctor, vitals } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (!user) {
      if (!password) return res.status(400).json({ message: "Password is required for new accounts" });
      const hashed = await bcrypt.hash(password, 10);
      user = await User.create({
        name,
        email,
        password: hashed,
        role: "Patient",
        profileImage: profileImage || "",
        status: "Registered"
      });
    }

    // Check if patient profile already exists for this user
    const existingPatient = await Patient.findOne({ user: user._id });
    if (existingPatient) {
      return res.status(400).json({ message: "Patient profile already exists for this email" });
    }

    const patient = await Patient.create({
      user: user._id,
      name: user.name,
      age,
      gender,
      bloodGroup,
      phone: phone || "",
      address: address || "",
      profileImage: user.profileImage,
      condition: condition || "Undiagnosed",
      status: status || "Stable",
      room: room || "Unassigned",
      assignedDoctor: assignedDoctor || null,
      vitals: vitals || { hr: 80, bp: "120/80", temp: "37.0°C", o2: "98%" }
    });

    const populatedPatient = await Patient.findById(patient._id)
      .populate("user", "name email role profileImage status")
      .populate("assignedDoctor", "name specialization");
    res.status(201).json(populatedPatient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updatePatient(req, res) {
  const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .populate("user", "name email role profileImage status")
    .populate("assignedDoctor", "name specialization");
  res.json(patient);
}

export async function deletePatient(req, res) {
  await Patient.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
}
