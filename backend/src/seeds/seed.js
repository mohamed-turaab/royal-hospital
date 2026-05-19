import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import { ROLE_SEEDS, ROLE_STATUS } from "../config/roles.js";

await connectDB(process.env.MONGODB_URI);
await Promise.all([User.deleteMany({}), Doctor.deleteMany({}), Patient.deleteMany({})]);

const password = await bcrypt.hash("Password123!", 10);
const seededUsers = await Promise.all(
  ROLE_SEEDS.map((item) =>
    User.create({
      name: item.name,
      email: item.email,
      password,
      role: item.role,
      profileImage: item.profileImage,
      status: ROLE_STATUS[item.role] || "Active",
    }),
  ),
);

const admin = seededUsers.find((item) => item.role === "Admin");
const doctorUser = seededUsers.find((item) => item.role === "Doctor");
const patientUser = seededUsers.find((item) => item.role === "Patient");

await Doctor.create({ user: doctorUser._id, name: "Dr. Sarah", specialization: "Cardiology", profileImage: doctorUser.profileImage });
await Patient.create({ user: patientUser._id, name: "John Patient", age: 34, gender: "Male", profileImage: patientUser.profileImage });
console.log("Seeded", seededUsers.map((item) => item.email).join(", "));
