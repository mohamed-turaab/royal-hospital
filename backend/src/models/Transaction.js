import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
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
    receptionist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receptionistName: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "Mobile Money", "Other"],
      default: "Cash",
    },
    type: {
      type: String,
      enum: ["Appointment Fee", "Consultation", "Lab Test", "Medicine", "Other"],
      default: "Appointment Fee",
    },
    status: {
      type: String,
      enum: ["Paid", "Refunded"],
      default: "Paid",
    },
    notes: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
