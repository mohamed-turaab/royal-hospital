import Bill from "../models/Bill.js";
import Patient from "../models/Patient.js";
import User from "../models/User.js";
import Prescription from "../models/Prescription.js";
import Transaction from "../models/Transaction.js";

// @desc    Create a new manual bill (Lab Test, Surgery, Consultation, etc.)
// @route   POST /api/bills
// @access  Private (Doctor, Admin)
export const createBill = async (req, res) => {
  try {
    const { patientId, itemType, itemName, amount, referenceId, orderedBy } = req.body;

    if (!patientId || !itemType || !itemName || !amount) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const bill = await Bill.create({
      patient: patientId,
      patientName: patient.name,
      itemType,
      itemName,
      amount: Number(amount),
      referenceId,
      orderedBy: orderedBy || req.user.name || "Doctor"
    });

    res.status(201).json(bill);
  } catch (error) {
    console.error("Error creating bill:", error);
    res.status(500).json({ message: "Server error while creating bill" });
  }
};

// @desc    List bills (Filter by patient or status)
// @route   GET /api/bills
// @access  Private (Admin, Accountant, Receptionist)
export const getBills = async (req, res) => {
  try {
    const { patientId, status } = req.query;

    let query = {};
    if (patientId) query.patient = patientId;
    if (status) query.status = status;

    const bills = await Bill.find(query)
      .populate("patient", "name age gender")
      .sort({ createdAt: -1 });

    res.json(bills);
  } catch (error) {
    console.error("Error fetching bills:", error);
    res.status(500).json({ message: "Server error while fetching bills" });
  }
};

// @desc    Checkout and pay multiple bills
// @route   POST /api/bills/checkout
// @access  Private (Receptionist, Admin)
export const checkoutBills = async (req, res) => {
  try {
    const { billIds, paymentMethod } = req.body;

    if (!billIds || !Array.isArray(billIds) || billIds.length === 0) {
      return res.status(400).json({ message: "Invalid or empty billIds array" });
    }

    const receptionistId = req.user.userId || req.user.id || req.user._id;
    const receptionist = await User.findById(receptionistId);

    if (!receptionist) {
      return res.status(404).json({ message: "Receptionist profile not found" });
    }

    const bills = await Bill.find({ _id: { $in: billIds } });
    if (bills.length === 0) {
      return res.status(404).json({ message: "No matching bills found" });
    }

    let totalAmount = 0;
    const itemNames = [];
    let firstPatientId = bills[0].patient;
    let firstPatientName = bills[0].patientName;

    // Process each bill
    for (const bill of bills) {
      if (bill.status === "Paid") continue; // Skip already paid

      bill.status = "Paid";
      await bill.save();

      totalAmount += bill.amount;
      itemNames.push(`${bill.itemName} (${bill.itemType})`);

      // If this is a medicine bill, automatically update the prescription status to Pending Pharmacy!
      if (bill.itemType === "Medicine" && bill.referenceId) {
        const prescription = await Prescription.findById(bill.referenceId);
        if (prescription) {
          prescription.status = "Pending Pharmacy";
          await prescription.save();
        }
      }
    }

    if (totalAmount > 0) {
      // Create a unified Transaction log for this receptionist collection
      await Transaction.create({
        patient: firstPatientId,
        patientName: firstPatientName,
        receptionist: receptionist._id,
        receptionistName: receptionist.name,
        amount: totalAmount,
        paymentMethod: paymentMethod || "Cash",
        type: bills.length === 1 ? bills[0].itemType : "Other",
        notes: `Unified Checkout processed by ${receptionist.name}. Paid: ${itemNames.join(", ")}`
      });
    }

    res.json({
      message: "Checkout successful",
      totalPaid: totalAmount,
      updatedCount: bills.length
    });
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).json({ message: "Server error during billing checkout" });
  }
};
