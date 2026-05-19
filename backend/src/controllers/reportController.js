import Report from "../models/Report.js";
import fs from "node:fs";
import path from "node:path";

export const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("uploadedBy", "name role")
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: "Server error while fetching reports" });
  }
};

export const createReport = async (req, res) => {
  try {
    const { title, patientName, type, content } = req.body;
    
    let fileUrl = null;
    let fileName = null;
    let size = null;

    if (req.file) {
      // Create file URL accessible from frontend
      fileUrl = `/uploads/reports/${req.file.filename}`;
      fileName = req.file.originalname;
      
      // Calculate file size in human readable format
      const bytes = req.file.size;
      const mb = bytes / (1024 * 1024);
      if (mb >= 1) {
        size = `${mb.toFixed(1)} MB`;
      } else {
        const kb = bytes / 1024;
        size = `${kb.toFixed(1)} KB`;
      }
    }

    const newReport = new Report({
      title,
      patientName,
      type: type || (req.file ? "Document" : "Clinical Note"),
      content,
      fileUrl,
      fileName,
      size,
      uploadedBy: req.user.userId,
    });

    const savedReport = await newReport.save();
    
    // Populate the user info before sending back
    await savedReport.populate("uploadedBy", "name role");
    
    res.status(201).json(savedReport);
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(500).json({ message: "Server error while creating report" });
  }
};

export const updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!["Pending Review", "Reviewed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedReport = await Report.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("uploadedBy", "name role");

    if (!updatedReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.json(updatedReport);
  } catch (error) {
    console.error("Error updating report status:", error);
    res.status(500).json({ message: "Server error while updating report" });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Delete the file if it exists
    if (report.fileUrl) {
      // fileUrl is something like "/uploads/reports/filename.pdf"
      // We need to resolve it to the actual file path
      const filePath = path.join(process.cwd(), "public", report.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Report.findByIdAndDelete(req.params.id);
    res.json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({ message: "Server error while deleting report" });
  }
};
