import mongoose from "mongoose";
import Prescription from "./models/Prescription.js";
import Bill from "./models/Bill.js";
import Patient from "./models/Patient.js";
import Doctor from "./models/Doctor.js";

const MONGODB_URI = "mongodb://127.0.0.1:27017/hospital_management";

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB for migration!");

  const prescriptions = await Prescription.find();
  console.log(`Found ${prescriptions.length} existing prescriptions.`);

  let createdCount = 0;

  for (const rx of prescriptions) {
    // Check if bill already exists
    const existingBill = await Bill.findOne({ referenceId: rx._id });
    if (existingBill) {
      console.log(`Bill already exists for prescription ${rx._id}, skipping.`);
      continue;
    }

    // Get patient
    const patient = await Patient.findById(rx.patient);
    const pName = rx.patientName || (patient ? patient.name : "Unknown Patient");

    // Get doctor name
    const doctor = await Doctor.findById(rx.doctor);
    const docName = doctor ? doctor.name : "Doctor";

    // Set cost
    const drugCount = (rx.medicines || []).length;
    const cost = drugCount > 0 ? drugCount * 15 : 20;
    const medicineNames = (rx.medicines || []).map(m => m.name).join(", ");

    await Bill.create({
      patient: rx.patient,
      patientName: pName,
      itemType: "Medicine",
      itemName: medicineNames || "Prescribed Medicine Package",
      amount: cost,
      status: "Unpaid",
      referenceId: rx._id,
      orderedBy: docName
    });

    // Make sure status is 'Pending Payment' so it can be paid
    rx.status = "Pending Payment";
    await rx.save();

    createdCount++;
    console.log(`Created unpaid Bill ($${cost}) for patient: ${pName}`);
  }

  console.log(`MIGRATION COMPLETE! Created ${createdCount} new outstanding bills.`);
  await mongoose.disconnect();
}

run().catch(console.error);
