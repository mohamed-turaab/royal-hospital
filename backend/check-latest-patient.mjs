import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/hospital_management";

async function checkLatestPatient() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    // Patient schema has 'user' which references User, or 'name' directly.
    const Patient = mongoose.connection.collection('patients');
    const User = mongoose.connection.collection('users');

    const latestPatient = await Patient.find({}).sort({ _id: -1 }).limit(1).toArray();
    
    if (latestPatient.length > 0) {
      const p = latestPatient[0];
      let name = p.name;
      if (p.user) {
        const user = await User.findOne({ _id: p.user });
        if (user) name = user.name;
      }
      console.log(`Latest Patient: Name = ${name}, Age = ${p.age}, Gender = ${p.gender}, BloodGroup = ${p.bloodGroup}, Room = ${p.room}`);
    } else {
      console.log("No patients found in DB.");
    }

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
  }
}

checkLatestPatient();
