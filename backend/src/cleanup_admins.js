import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/hospital_management";

async function cleanup() {
  await mongoose.connect(MONGODB_URI);
  
  // Delete all Admins except one
  const admins = await User.find({ role: "Admin" });
  if (admins.length > 1) {
    const toDelete = admins.slice(1).map(a => a._id);
    await User.deleteMany({ _id: { $in: toDelete } });
    console.log(`Deleted ${toDelete.length} extra admins.`);
  } else {
    console.log("Only one admin or no admins found.");
  }

  const finalAdmins = await User.find({ role: "Admin" });
  console.log("Remaining Admin:", finalAdmins[0]?.email);

  await mongoose.disconnect();
}

cleanup().catch(console.error);
