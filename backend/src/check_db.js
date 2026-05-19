import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/hospital_management";

async function check() {
  await mongoose.connect(MONGODB_URI);
  const count = await User.countDocuments();
  const users = await User.find({}, 'name email role').limit(20);
  console.log(`Total Users: ${count}`);
  console.log(JSON.stringify(users, null, 2));
  await mongoose.disconnect();
}

check().catch(console.error);
