import mongoose from "mongoose";

const billSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    patientName: {
      type: String,
      required: true,
    },
    itemType: {
      type: String,
      enum: ["Medicine", "Lab Test", "Surgery", "Consultation", "Other"],
      required: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Unpaid", "Paid"],
      default: "Unpaid",
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    orderedBy: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Bill = mongoose.model("Bill", billSchema);

export default Bill;
