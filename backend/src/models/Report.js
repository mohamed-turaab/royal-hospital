import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: false,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Clinical Note", "Lab Result", "Imaging", "Document", "Other"],
      default: "Other",
    },
    fileUrl: {
      type: String,
      required: false, // Optional because Quick Notes might not have a file
    },
    fileName: {
      type: String,
      required: false,
    },
    size: {
      type: String,
      required: false,
    },
    content: {
      type: String,
      required: false, // For Quick Notes
    },
    status: {
      type: String,
      enum: ["Pending Review", "Reviewed"],
      default: "Pending Review",
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);

export default Report;
