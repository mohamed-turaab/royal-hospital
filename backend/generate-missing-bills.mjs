import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/hospital_management";
await mongoose.connect(MONGODB_URI);

const prescriptions = await mongoose.connection.db.collection("prescriptions").find().toArray();
let created = 0;

for (const p of prescriptions) {
  const patient = await mongoose.connection.db.collection("patients").findOne({ _id: p.patient });
  
  if (patient) {
    const bill = await mongoose.connection.db.collection("bills").findOne({ referenceId: p._id });
    if (!bill) {
      const drugCount = (p.medicines || []).length;
      const medicineCost = drugCount > 0 ? drugCount * 15 : 20;
      const medicineNames = (p.medicines || []).map(m => m.name).join(", ");
      
      await mongoose.connection.db.collection("bills").insertOne({
        patient: p.patient,
        patientName: patient.name,
        itemType: "Medicine",
        itemName: medicineNames || "Prescribed Medicine",
        amount: medicineCost,
        status: "Unpaid",
        referenceId: p._id,
        orderedBy: "System Seed",
        createdAt: new Date(),
        updatedAt: new Date()
      });
      created++;
    }
  }
}

console.log(`✅ Created ${created} missing bills for existing prescriptions.`);
await mongoose.disconnect();
