import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/hospital_management";

async function clean() {
  await mongoose.connect(MONGODB_URI);
  try {
    // Delete all accountants EXCEPT nuur@hospital.com
    const deletedAccountants = await User.deleteMany({
      role: "Accountant",
      email: { $ne: "nuur@hospital.com" }
    });
    console.log(`Deleted ${deletedAccountants.deletedCount} extra Accountants.`);

    // Delete all receptionists EXCEPT leyla@hospital.com
    const deletedReceptionists = await User.deleteMany({
      role: "Receptionist",
      email: { $ne: "leyla@hospital.com" }
    });
    console.log(`Deleted ${deletedReceptionists.deletedCount} extra Receptionists.`);

    // Verify remaining users
    const remainingUsers = await User.find({}, 'name email role');
    console.log("Remaining users in database:", remainingUsers);

  } catch (error) {
    console.error("Clean-up failed:", error);
  } finally {
    await mongoose.disconnect();
  }
}

clean();
