import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    patientName: { type: String },
    medicines: [{ 
      name: String, 
      dosage: String, 
      frequency: String,
      duration: String,
      instructions: String 
    }],
    notes: String,
    status: { type: String, default: "Pending Payment", enum: ["Pending Payment", "Pending Pharmacy", "Dispensed", "Cancelled"] },
  },
  { timestamps: true }
);

export default mongoose.model("Prescription", prescriptionSchema);
