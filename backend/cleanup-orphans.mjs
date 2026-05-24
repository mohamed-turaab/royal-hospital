import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/hospital_management";
await mongoose.connect(MONGODB_URI);

// Delete all orphaned prescriptions (where patient no longer exists)
const prescriptions = await mongoose.connection.db.collection("prescriptions").find().toArray();
let deleted = 0;

for (const p of prescriptions) {
  const patient = await mongoose.connection.db.collection("patients").findOne({ _id: p.patient });
  if (!patient) {
    await mongoose.connection.db.collection("prescriptions").deleteOne({ _id: p._id });
    deleted++;
    console.log(`Deleted orphaned prescription: ${p._id}`);
  }
}

// Also delete orphaned bills
const bills = await mongoose.connection.db.collection("bills").find().toArray();
let deletedBills = 0;
for (const b of bills) {
  const patient = await mongoose.connection.db.collection("patients").findOne({ _id: b.patient });
  if (!patient) {
    await mongoose.connection.db.collection("bills").deleteOne({ _id: b._id });
    deletedBills++;
    console.log(`Deleted orphaned bill: ${b._id}`);
  }
}

// Also delete orphaned appointments
const appointments = await mongoose.connection.db.collection("appointments").find().toArray();
let deletedAppts = 0;
for (const a of appointments) {
  const patient = await mongoose.connection.db.collection("patients").findOne({ _id: a.patient });
  if (!patient) {
    await mongoose.connection.db.collection("appointments").deleteOne({ _id: a._id });
    deletedAppts++;
    console.log(`Deleted orphaned appointment: ${a._id}`);
  }
}

console.log(`\n✅ Done! Deleted ${deleted} orphaned prescriptions, ${deletedBills} orphaned bills, ${deletedAppts} orphaned appointments.`);
console.log(`\nDatabase is now clean. Please create new prescriptions through the app.`);

await mongoose.disconnect();
