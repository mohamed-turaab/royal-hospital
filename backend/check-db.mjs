import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
console.log("Connecting to:", MONGODB_URI ? "Atlas (MONGODB_URI found)" : "LOCAL (no env var!)");

await mongoose.connect(MONGODB_URI || "mongodb://127.0.0.1:27017/hospital_management");
const cols = await mongoose.connection.db.listCollections().toArray();
for (const c of cols) {
  const count = await mongoose.connection.db.collection(c.name).countDocuments();
  console.log(`  ${c.name}: ${count} records`);
}
await mongoose.disconnect();
console.log("Done.");
