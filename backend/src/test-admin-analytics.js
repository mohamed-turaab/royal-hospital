import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Appointment from "./models/Appointment.js";
import RevenueReport from "./models/RevenueReport.js";
import Bill from "./models/Bill.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/hospital_management";

async function test() {
  await mongoose.connect(MONGODB_URI);
  try {
    const totalUsers = await User.countDocuments();
    const activeStaff = await User.countDocuments({ role: { $ne: "Patient" }, status: { $regex: /Active|On Duty|On Shift/i } });
    const pendingAppointments = await Appointment.countDocuments({ status: { $regex: /Scheduled|Pending/i } });
    const pendingReportsCount = await RevenueReport.countDocuments({ status: "Pending Approval" });
    const criticalAlerts = pendingReportsCount;

    const paidBills = await Bill.find({ status: "Paid" });
    const actualTotalRevenue = paidBills.reduce((sum, b) => sum + (b.amount || 0), 0);

    const latestReport = await RevenueReport.findOne({ status: "Approved" }).sort({ createdAt: -1 });

    console.log("SUCCESS!");
    console.log({
      totalUsers,
      activeStaff,
      pendingAppointments,
      criticalAlerts,
      actualTotalRevenue,
      latestReport
    });
  } catch (err) {
    console.error("ERROR RUNNING QUERY:", err);
  } finally {
    await mongoose.disconnect();
  }
}

test();
