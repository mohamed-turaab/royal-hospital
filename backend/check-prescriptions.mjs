import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/hospital_management";
await mongoose.connect(MONGODB_URI);

const prescriptions = await mongoose.connection.db.collection("prescriptions").find().toArray();
console.log(`\n=== PRESCRIPTIONS (${prescriptions.length} total) ===`);
for (const p of prescriptions) {
  console.log(`- Status: ${p.status} | Patient: ${p.patientName} | Medicines: ${(p.medicines||[]).map(m=>m.name).join(", ") || "None"}`);
}

const bills = await mongoose.connection.db.collection("bills").find().toArray();
console.log(`\n=== BILLS (${bills.length} total) ===`);
for (const b of bills) {
  console.log(`- ${b.itemName} | Amount: $${b.amount} | Status: ${b.status} | Patient: ${b.patientName}`);
}

await mongoose.disconnect();
