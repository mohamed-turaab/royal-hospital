import Appointment from "../models/Appointment.js";
import Transaction from "../models/Transaction.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import User from "../models/User.js";

export async function listAppointments(req, res) {
  const query = {};
  
  if (req.user.role === "Doctor") {
    const doctorRecord = await Doctor.findOne({ user: req.user.id });
    if (doctorRecord) {
      query.doctor = doctorRecord._id;
    } else {
      return res.json([]);
    }
  }
  
  if (req.user.role === "Patient") {
    const patientRecord = await Patient.findOne({ user: req.user.id });
    if (patientRecord) {
      query.patient = patientRecord._id;
    } else {
      return res.json([]);
    }
  }

  const appointments = await Appointment.find(query)
    .populate("patient")
    .populate("doctor")
    .populate("createdBy", "name email role profileImage");
  res.json(appointments);
}

export async function createAppointment(req, res) {
  try {
    const userId = req.user.userId || req.user.id || req.user._id;
    
    let patientId = req.body.patient;

    // If the logged-in user is a Patient, auto-resolve their patient record
    if (req.user.role === "Patient") {
      const patientRecord = await Patient.findOne({ user: userId });
      if (!patientRecord) {
        return res.status(400).json({ message: "Patient record not found for this user. Please contact the receptionist to register your patient profile." });
      }
      patientId = patientRecord._id;
    }

    if (!patientId) {
      return res.status(400).json({ message: "Patient is required." });
    }

    // Create the appointment
    const appointment = await Appointment.create({
      patient: patientId,
      doctor: req.body.doctor,
      scheduledAt: req.body.scheduledAt,
      status: req.body.status || "Scheduled",
      notes: req.body.notes,
      createdBy: userId
    });

    // Create a transaction if amountCollected > 0
    if (req.body.amountCollected && Number(req.body.amountCollected) > 0) {
      const patientDoc = await Patient.findById(patientId);
      const receptionistRecord = await User.findById(userId);

      if (patientDoc && receptionistRecord) {
        await Transaction.create({
          patient: patientDoc._id,
          patientName: patientDoc.name,
          receptionist: receptionistRecord._id,
          receptionistName: receptionistRecord.name,
          amount: Number(req.body.amountCollected),
          paymentMethod: req.body.paymentMethod || "Cash",
          type: "Appointment Fee",
          notes: req.body.notes || `Collected by ${receptionistRecord.name} for appointment booking`
        });
      }
    }

    res.status(201).json(appointment);
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ message: error.message || "Server error while creating appointment" });
  }
}

export async function updateAppointment(req, res) {
  const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(appointment);
}

export async function deleteAppointment(req, res) {
  await Appointment.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
}
