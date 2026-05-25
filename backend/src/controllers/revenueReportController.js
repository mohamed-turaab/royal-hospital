import RevenueReport from "../models/RevenueReport.js";
import User from "../models/User.js";
import { createNotification } from "./notificationController.js";

// @desc    Submit a new revenue report
// @route   POST /api/revenue-reports
// @access  Private (Accountant)
export const submitRevenueReport = async (req, res) => {
  try {
    const { title, totalRevenue, totalExpenses, pendingInvoices, notes, chartsData } = req.body;
    const userId = req.user.userId || req.user.id;

    // Get user's name
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const netProfit = Number(totalRevenue) - Number(totalExpenses);

    const newReport = new RevenueReport({
      reporter: userId,
      reporterName: user.name,
      title,
      totalRevenue: Number(totalRevenue),
      totalExpenses: Number(totalExpenses),
      netProfit,
      pendingInvoices: Number(pendingInvoices),
      notes,
      chartsData: chartsData || [],
      status: "Pending Approval"
    });

    const savedReport = await newReport.save();

    await createNotification({
      roles: ["Admin"],
      title: "Revenue Report Submitted",
      body: `${user.name} submitted "${savedReport.title}" with revenue $${savedReport.totalRevenue.toLocaleString()}, expenses $${savedReport.totalExpenses.toLocaleString()}, net profit $${savedReport.netProfit.toLocaleString()}.`,
      type: "info",
      link: `/admin/dashboard?report=${savedReport._id}`,
    });

    res.status(201).json(savedReport);
  } catch (error) {
    console.error("Error submitting revenue report:", error);
    res.status(500).json({ message: "Server error while submitting report" });
  }
};

// @desc    Get all revenue reports
// @route   GET /api/revenue-reports
// @access  Private (Admin, Accountant)
export const getRevenueReports = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const role = req.user.role;

    let reports;
    if (role === "Admin") {
      // Admin sees everything
      reports = await RevenueReport.find().sort({ createdAt: -1 });
    } else {
      // Accountant sees their own
      reports = await RevenueReport.find({ reporter: userId }).sort({ createdAt: -1 });
    }

    res.json(reports);
  } catch (error) {
    console.error("Error fetching revenue reports:", error);
    res.status(500).json({ message: "Server error while fetching reports" });
  }
};

// @desc    Update report approval status
// @route   PATCH /api/revenue-reports/:id/status
// @access  Private (Admin)
export const updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!["Pending Approval", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const report = await RevenueReport.findById(id);
    if (!report) {
      return res.status(404).json({ message: "Revenue report not found" });
    }

    report.status = status;
    const updatedReport = await report.save();

    res.json(updatedReport);
  } catch (error) {
    console.error("Error updating report status:", error);
    res.status(500).json({ message: "Server error while updating report status" });
  }
};
