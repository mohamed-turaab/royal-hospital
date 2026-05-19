import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    age: Number,
    gender: String,
    bloodGroup: String,
    phone: String,
    address: String,
    profileImage: { type: String, default: "" },
    condition: { type: String, default: "Undiagnosed" },
    status: { type: String, enum: ["Stable", "Critical", "Recovering"], default: "Stable" },
    room: { type: String, default: "Unassigned" },
    assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    vitals: {
      hr: { type: Number, default: 80 },
      bp: { type: String, default: "120/80" },
      temp: { type: String, default: "37.0°C" },
      o2: { type: String, default: "98%" }
    }
  },
  { timestamps: true }
);

export default mongoose.model("Patient", patientSchema);
