import mongoose from "mongoose";
import User from "./models/User.js";
import Bill from "./models/Bill.js";
import Prescription from "./models/Prescription.js";

const MONGODB_URI = "mongodb://127.0.0.1:27017/hospital_management";

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB successfully!");

  const usersCount = await User.countDocuments();
  const billsCount = await Bill.countDocuments();
  const rxCount = await Prescription.countDocuments();

  console.log(`DATABASE SUMMARY:`);
  console.log(`- Users: ${usersCount}`);
  console.log(`- Bills (Outstanding Invoices): ${billsCount}`);
  console.log(`- Prescriptions: ${rxCount}`);

  if (billsCount > 0) {
    const bills = await Bill.find().limit(3);
    console.log("SAMPLE BILLS:", bills.map(b => ({
      patient: b.patientName,
      type: b.itemType,
      item: b.itemName,
      amount: `$${b.amount}`,
      status: b.status
    })));
  }

  await mongoose.disconnect();
}

run().catch(console.error);
