import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/hospital_management";
await mongoose.connect(MONGODB_URI);

console.log("\n=== PATIENTS ===");
const patients = await mongoose.connection.db.collection("patients").find().toArray();
for (const p of patients) {
  console.log(`ID: ${p._id} | Name: ${p.name}`);
}

console.log("\n=== PRESCRIPTIONS ===");
const prescriptions = await mongoose.connection.db.collection("prescriptions").find().toArray();
for (const p of prescriptions) {
  console.log(`ID: ${p._id} | PatientID: ${p.patient} | Status: ${p.status}`);
}

console.log("\n=== BILLS ===");
const bills = await mongoose.connection.db.collection("bills").find().toArray();
for (const b of bills) {
  console.log(`ID: ${b._id} | PatientID: ${b.patient} | Name: ${b.patientName} | Item: ${b.itemName} | Status: ${b.status}`);
}

await mongoose.disconnect();
