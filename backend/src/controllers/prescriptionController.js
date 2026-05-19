import Prescription from "../models/Prescription.js";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import Bill from "../models/Bill.js";

export async function listPrescriptions(req, res) {
  try {
    let query = {};

    if (req.user.role === "Doctor") {
      // Find doctor profile for the logged-in user
      const doctorProfile = await Doctor.findOne({ user: req.user.id || req.user._id });
      if (doctorProfile) {
        query.doctor = doctorProfile._id;
      }
    } else if (req.user.role === "Patient") {
      const patientProfile = await Patient.findOne({ user: req.user.id || req.user._id });
      if (patientProfile) {
        query.patient = patientProfile._id;
      }
    } else if (req.query.doctorId) {
      query.doctor = req.query.doctorId;
    }

    const prescriptions = await Prescription.find(query)
      .populate("patient", "name age gender")
      .populate("doctor", "name specialization")
      .sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function createPrescription(req, res) {
  try {
    // Find doctor profile for the logged-in user
    const doctorProfile = await Doctor.findOne({ user: req.user.id || req.user._id });
    if (!doctorProfile) {
      return res.status(400).json({ message: "Doctor profile not found for this user." });
    }

    const { patientId, medicines, notes } = req.body;

    if (!patientId) {
      return res.status(400).json({ message: "patientId is required." });
    }

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    const prescription = await Prescription.create({
      doctor: doctorProfile._id,
      patient: patientId,
      patientName: patient.name,
      medicines: medicines || [],
      notes: notes || "",
    });

    // Create an unpaid Bill for the prescription!
    const medicineNames = (medicines || []).map(m => m.name).join(", ");
    const drugCount = (medicines || []).length;
    const medicineCost = drugCount > 0 ? drugCount * 15 : 20;

    await Bill.create({
      patient: patientId,
      patientName: patient.name,
      itemType: "Medicine",
      itemName: medicineNames || "Prescribed Medicine Package",
      amount: medicineCost,
      status: "Unpaid",
      referenceId: prescription._id,
      orderedBy: req.user.name || "Doctor"
    });

    const populated = await prescription.populate([
      { path: "patient", select: "name age gender" },
      { path: "doctor", select: "name specialization" }
    ]);

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function updatePrescriptionStatus(req, res) {
  try {
    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!prescription) return res.status(404).json({ message: "Not found" });
    res.json(prescription);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
