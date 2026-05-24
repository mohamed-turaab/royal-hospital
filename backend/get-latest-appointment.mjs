import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/hospital_management";

async function getLastAppointment() {
  await mongoose.connect(MONGODB_URI);
  
  // Use raw MongoDB driver to avoid needing schema models for a quick lookup
  const appointments = await mongoose.connection.db.collection("appointments")
    .find()
    .sort({ createdAt: -1 })
    .limit(1)
    .toArray();
    
  if (appointments.length > 0) {
    const appt = appointments[0];
    const patient = await mongoose.connection.db.collection("patients").findOne({ _id: appt.patient });
    const doctor = await mongoose.connection.db.collection("doctors").findOne({ _id: appt.doctor });
    
    // We might need to fetch the User for the patient if the name is in the User model
    let patientName = patient?.name;
    if (!patientName && patient?.user) {
      const user = await mongoose.connection.db.collection("users").findOne({ _id: patient.user });
      patientName = user?.name;
    }
    
    let doctorName = doctor?.name;
    if (!doctorName && doctor?.user) {
      const user = await mongoose.connection.db.collection("users").findOne({ _id: doctor.user });
      doctorName = user?.name;
    }

    console.log("=== LATEST APPOINTMENT ===");
    console.log(`Patient: ${patientName || "Unknown"}`);
    console.log(`Doctor: ${doctorName || "Unknown"}`);
    console.log(`Date: ${new Date(appt.scheduledAt).toLocaleString()}`);
    console.log(`Status: ${appt.status}`);
  } else {
    console.log("No appointments found.");
  }
  
  await mongoose.disconnect();
}

getLastAppointment().catch(console.error);
