import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Patient from "./models/Patient.js";
import Doctor from "./models/Doctor.js";
import Appointment from "./models/Appointment.js";
import Prescription from "./models/Prescription.js";
import Room from "./models/Room.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/hospital_management";

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  // Clear existing data to avoid duplicates if preferred, or just add more.
  // For this request, we will clear and add 4 of each role.
  await User.deleteMany({});
  await Patient.deleteMany({});
  await Doctor.deleteMany({});
  await Appointment.deleteMany({});
  await Prescription.deleteMany({});
  await Room.deleteMany({});

  const hashedPassword = await bcrypt.hash("admin123", 10);

  // ─── ADMINS (1) ───
  const admins = await User.insertMany([
    { name: "Admin Mohamed", email: "admin@hospital.com", password: hashedPassword, role: "Admin", status: "Active", profileImage: "https://i.pravatar.cc/150?img=1" },
  ]);

  // ─── DOCTORS (4) ───
  const doctorUsers = await User.insertMany([
    { name: "Dr. Amina Warsame", email: "amina@hospital.com", password: hashedPassword, role: "Doctor", status: "On Duty", profileImage: "/images/doctors/doctor1.png" },
    { name: "Dr. Ibrahim Farah", email: "ibrahim@hospital.com", password: hashedPassword, role: "Doctor", status: "On Duty", profileImage: "/images/doctors/doctor2.png" },
    { name: "Dr. Halima Osman", email: "halima@hospital.com", password: hashedPassword, role: "Doctor", status: "On Duty", profileImage: "/images/doctors/doctor3.png" },
    { name: "Dr. Ahmed Nur", email: "ahmed@hospital.com", password: hashedPassword, role: "Doctor", status: "On Duty", profileImage: "/images/doctors/doctor4.png" },
  ]);
  const doctors = await Doctor.insertMany([
    { user: doctorUsers[0]._id, name: doctorUsers[0].name, specialization: "Cardiology", phone: "111", profileImage: doctorUsers[0].profileImage },
    { user: doctorUsers[1]._id, name: doctorUsers[1].name, specialization: "Neurology", phone: "222", profileImage: doctorUsers[1].profileImage },
    { user: doctorUsers[2]._id, name: doctorUsers[2].name, specialization: "Pediatrics", phone: "333", profileImage: doctorUsers[2].profileImage },
    { user: doctorUsers[3]._id, name: doctorUsers[3].name, specialization: "Orthopedics", phone: "444", profileImage: doctorUsers[3].profileImage },
  ]);

  // ─── NURSES (4) ───
  const nurses = await User.insertMany([
    { name: "Nurse Hodan", email: "hodan@hospital.com", password: hashedPassword, role: "Nurse", status: "On Shift", profileImage: "/images/nurses/nurse1.png" },
    { name: "Nurse Ali", email: "ali_n@hospital.com", password: hashedPassword, role: "Nurse", status: "On Shift", profileImage: "/images/nurses/nurse2.png" },
    { name: "Nurse Maryam", email: "maryam@hospital.com", password: hashedPassword, role: "Nurse", status: "On Shift", profileImage: "/images/nurses/nurse1.png" },
    { name: "Nurse Bashir", email: "bashir@hospital.com", password: hashedPassword, role: "Nurse", status: "On Shift", profileImage: "/images/nurses/nurse2.png" },
  ]);

  // ─── RECEPTIONISTS (1) ───
  const receptionists = await User.insertMany([
    { name: "Receptionist Leyla", email: "leyla@hospital.com", password: hashedPassword, role: "Receptionist", status: "Front Desk", profileImage: "https://i.pravatar.cc/150?img=13" },
  ]);

  // ─── PHARMACISTS (1) ───
  const pharmacists = await User.insertMany([
    { name: "Pharma Kadiro", email: "kadiro@hospital.com", password: hashedPassword, role: "Pharmacist", status: "Active", profileImage: "https://i.pravatar.cc/150?img=17" },
  ]);

  // ─── ACCOUNTANTS (1) ───
  const accountants = await User.insertMany([
    { name: "Accountant Nuur", email: "nuur@hospital.com", password: hashedPassword, role: "Accountant", status: "Active", profileImage: "https://i.pravatar.cc/150?img=21" },
  ]);

  // ─── LAB TECHNICIANS (1) ───
  const labTechs = await User.insertMany([
    { name: "Ali Lab Tech", email: "lab@hospital.com", password: hashedPassword, role: "Lab Technician", status: "Active", profileImage: "https://i.pravatar.cc/150?img=33" },
  ]);

  // ─── PATIENTS (4) ───
  const patientUsers = await User.insertMany([
    { name: "Patient Jama", email: "jama@hospital.com", password: hashedPassword, role: "Patient", status: "Active", profileImage: "https://i.pravatar.cc/150?img=25" },
    { name: "Patient Barni", email: "barni@hospital.com", password: hashedPassword, role: "Patient", status: "Active", profileImage: "https://i.pravatar.cc/150?img=26" },
    { name: "Patient Caydiid", email: "caydiid@hospital.com", password: hashedPassword, role: "Patient", status: "Active", profileImage: "https://i.pravatar.cc/150?img=27" },
    { name: "Patient Xaawo", email: "xaawo@hospital.com", password: hashedPassword, role: "Patient", status: "Active", profileImage: "https://i.pravatar.cc/150?img=28" },
  ]);
  const patients = await Patient.insertMany([
    { user: patientUsers[0]._id, name: patientUsers[0].name, age: 20, gender: "Male", phone: "123", address: "Mogadishu", profileImage: patientUsers[0].profileImage },
    { user: patientUsers[1]._id, name: patientUsers[1].name, age: 30, gender: "Female", phone: "456", address: "Hargeisa", profileImage: patientUsers[1].profileImage },
    { user: patientUsers[2]._id, name: patientUsers[2].name, age: 40, gender: "Male", phone: "789", address: "Kismayo", profileImage: patientUsers[2].profileImage },
    { user: patientUsers[3]._id, name: patientUsers[3].name, age: 50, gender: "Female", phone: "000", address: "Garowe", profileImage: patientUsers[3].profileImage },
  ]);

  // ─── APPOINTMENTS (4) ───
  const appointments = await Appointment.insertMany([
    { patient: patients[0]._id, doctor: doctors[0]._id, scheduledAt: new Date(), status: "Scheduled", notes: "First visit" },
    { patient: patients[1]._id, doctor: doctors[1]._id, scheduledAt: new Date(), status: "Scheduled", notes: "Regular check" },
    { patient: patients[2]._id, doctor: doctors[2]._id, scheduledAt: new Date(), status: "Completed", notes: "Follow up" },
    { patient: patients[3]._id, doctor: doctors[3]._id, scheduledAt: new Date(), status: "Scheduled", notes: "Consultation" },
  ]);

  // ─── PRESCRIPTIONS (4) ───
  await Prescription.insertMany([
    { appointment: appointments[0]._id, doctor: doctors[0]._id, patient: patients[0]._id, medicines: [{ name: "Medicine A", dosage: "1x1" }] },
    { appointment: appointments[1]._id, doctor: doctors[1]._id, patient: patients[1]._id, medicines: [{ name: "Medicine B", dosage: "2x1" }] },
    { appointment: appointments[2]._id, doctor: doctors[2]._id, patient: patients[2]._id, medicines: [{ name: "Medicine C", dosage: "3x1" }] },
    { appointment: appointments[3]._id, doctor: doctors[3]._id, patient: patients[3]._id, medicines: [{ name: "Medicine D", dosage: "1x2" }] },
  ]);
  
  // ─── ROOMS (4) ───
  await Room.insertMany([
    { roomNumber: "101", type: "General", status: "Available", pricePerDay: 50 },
    { roomNumber: "102", type: "Private", status: "Occupied", pricePerDay: 150, currentPatient: patients[0]._id },
    { roomNumber: "201", type: "ICU", status: "Available", pricePerDay: 500 },
    { roomNumber: "301", type: "VIP", status: "Available", pricePerDay: 1000 },
  ]);

  console.log("✅ Database seeded with 1 Admin, 4 users for other roles, and 4 rooms.");
  await mongoose.disconnect();
}

seed().catch(console.error);
