import mongoose from "mongoose";

const chartDataPointSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. "Mon"
  revenue: { type: Number, required: true },
  expenses: { type: Number, required: true },
}, { _id: false });

const revenueReportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reporterName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    totalRevenue: {
      type: Number,
      required: true,
    },
    totalExpenses: {
      type: Number,
      required: true,
    },
    netProfit: {
      type: Number,
      required: true,
    },
    pendingInvoices: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending Approval", "Approved", "Rejected"],
      default: "Pending Approval",
    },
    notes: {
      type: String,
      required: false,
    },
    chartsData: [chartDataPointSchema],
  },
  { timestamps: true }
);

const RevenueReport = mongoose.model("RevenueReport", revenueReportSchema);

export default RevenueReport;
