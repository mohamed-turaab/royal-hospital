import mongoose from "mongoose";

const labTestSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    testName: { type: String, required: true },
    notes: { type: String, default: "" }, // Instructions from doctor
    
    // Status flow: Pending Payment -> Pending Sample -> Pending Lab -> Completed
    status: {
      type: String,
      enum: ["Pending Payment", "Pending Sample", "Pending Lab", "Completed"],
      default: "Pending Payment",
    },
    
    // Results
    resultText: { type: String, default: "" },
    resultFileUrl: { type: String, default: "" },
    specimenType: { type: String, default: "" },
    specimenTypes: [{ type: String }],
    sampleNotes: { type: String, default: "" },
    
    labTechnician: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    nurse: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // The nurse who collected the sample
    paymentConfirmedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    paymentConfirmedAt: Date,
    sampleCollectedAt: Date,
    resultUploadedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("LabTest", labTestSchema);
