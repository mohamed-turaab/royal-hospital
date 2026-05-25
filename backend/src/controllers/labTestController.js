import LabTest from '../models/LabTest.js';
import Patient from '../models/Patient.js';
import Bill from '../models/Bill.js';
import { createNotification } from './notificationController.js';

const idString = (value) => {
  if (!value) return '';
  return String(value._id || value);
};

/**
 * Create a lab test order (called by Doctor).
 * Expects body: { patientId, testName, notes, prescriptionId (optional) }
 */
export const createLabTest = async (req, res) => {
  try {
    const { patientId, testName, notes, prescriptionId, amount } = req.body;
    if (!patientId || !testName) return res.status(400).json({ message: 'Patient and Test Name are required' });

    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const labTest = await LabTest.create({
      patient: patientId,
      doctor: req.user._id,
      testName,
      notes,
      status: 'Pending Payment',
      prescription: prescriptionId || null,
    });

    await Bill.create({
      patient: patientId,
      patientName: patient.name,
      itemType: 'Lab Test',
      itemName: testName,
      amount: Number(amount) > 0 ? Number(amount) : 25,
      status: 'Unpaid',
      referenceId: labTest._id,
      orderedBy: req.user.name || 'Doctor',
    });

    // Notify Receptionists that a new lab test needs payment
    await createNotification({
      roles: ['Receptionist', 'Admin'],
      title: 'New Lab Test Order',
      body: `Dr. ${req.user.name} ordered a "${testName}". Awaiting patient payment at Billing & Checkout.`,
      type: 'info',
      link: '/receptionist/billing',
    });

    res.status(201).json(labTest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Receptionist marks the lab test as Paid → Notify Nurses.
 * PATCH /:id/pay
 */
export const markPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const labTest = await LabTest.findById(id).populate('doctor');
    if (!labTest) return res.status(404).json({ message: 'Lab test not found' });
    if (labTest.status !== 'Pending Payment') return res.status(400).json({ message: 'Test is not pending payment' });

    labTest.status = 'Pending Sample';
    labTest.paymentConfirmedBy = req.user._id;
    labTest.paymentConfirmedAt = new Date();
    await labTest.save();

    // Notify Nurses to collect sample
    await createNotification({
      roles: ['Nurse'],
      title: 'Sample Collection Required',
      body: `Payment confirmed for "${labTest.testName}". Please collect the patient sample.`,
      type: 'warning',
      link: '/nurse/lab-tests',
    });

    res.json(labTest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Nurse marks sample collected → Notify Lab Technicians.
 * PATCH /:id/collect
 */
export const markSampleCollected = async (req, res) => {
  try {
    const { id } = req.params;
    const { specimenType, specimenTypes, sampleNotes } = req.body;
    const labTest = await LabTest.findById(id);
    if (!labTest) return res.status(404).json({ message: 'Lab test not found' });
    if (labTest.status !== 'Pending Sample') return res.status(400).json({ message: 'Test is not ready for sample collection' });

    labTest.status = 'Pending Lab';
    labTest.nurse = req.user._id;
    const selectedSpecimens = Array.isArray(specimenTypes)
      ? specimenTypes.filter(Boolean)
      : specimenType
        ? [specimenType]
        : [labTest.testName];

    labTest.specimenTypes = selectedSpecimens;
    labTest.specimenType = selectedSpecimens.join(', ');
    labTest.sampleNotes = sampleNotes || '';
    labTest.sampleCollectedAt = new Date();
    await labTest.save();

    // Notify Lab Technicians
    await createNotification({
      roles: ['Lab Technician'],
      title: 'Sample Ready for Analysis',
      body: `Nurse ${req.user.name} forwarded ${labTest.specimenType} for "${labTest.testName}". Ready to analyze.`,
      type: 'info',
      link: '/lab technician/lab-tests',
    });

    res.json(labTest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Lab Technician uploads result → Notify Doctor.
 * PATCH /:id/result
 */
export const uploadResult = async (req, res) => {
  try {
    const { id } = req.params;
    const labTest = await LabTest.findById(id).populate('patient doctor');
    if (!labTest) return res.status(404).json({ message: 'Lab test not found' });
    if (labTest.status !== 'Pending Lab') return res.status(400).json({ message: 'Test is not ready for lab results' });

    const { resultText } = req.body;
    if (!resultText && !req.file) return res.status(400).json({ message: 'Result notes or file is required' });

    if (resultText) labTest.resultText = resultText;
    if (req.file) labTest.resultFileUrl = `/uploads/lab-results/${req.file.filename}`;
    labTest.status = 'Completed';
    labTest.labTechnician = req.user._id;
    labTest.resultUploadedAt = new Date();
    await labTest.save();

    // Notify the Doctor who requested this test
    await createNotification({
      recipientIds: [idString(labTest.doctor)],
      title: 'Lab Result Ready',
      body: `Results for "${labTest.testName}" have been uploaded by the lab. Please review.`,
      type: 'success',
      link: '/doctor/lab-tests',
    });

    // Also notify Admin
    await createNotification({
      roles: ['Admin'],
      title: 'Lab Test Completed',
      body: `"${labTest.testName}" analysis is complete and result has been uploaded.`,
      type: 'success',
    });

    res.json(labTest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get a single lab test (accessible to related parties).
 */
export const getLabTest = async (req, res) => {
  try {
    const { id } = req.params;
    const labTest = await LabTest.findById(id)
      .populate({ path: 'patient', populate: { path: 'user', select: 'name email role' } })
      .populate('doctor nurse labTechnician paymentConfirmedBy');
    if (!labTest) return res.status(404).json({ message: 'Lab test not found' });
    const userId = req.user._id.toString();
    const allowed =
      labTest.doctor?._id?.toString() === userId ||
      labTest.nurse?._id?.toString() === userId ||
      labTest.labTechnician?._id?.toString() === userId ||
      idString(labTest.patient?.user) === userId ||
      ['Admin', 'Receptionist', 'Accountant'].includes(req.user.role);
    if (!allowed) return res.status(403).json({ message: 'Forbidden' });
    res.json(labTest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get all lab tests, filtered by the role of the user requesting them.
 */
export const getAllLabTests = async (req, res) => {
  try {
    const role = req.user.role;
    let filter = {};

    if (role === 'Patient') {
      const patient = await Patient.findOne({ user: req.user._id }).select('_id');
      if (!patient) return res.json([]);
      filter = { patient: patient._id };
    } else if (role === 'Doctor') {
      filter = { doctor: req.user._id };
    } else if (role === 'Receptionist' || role === 'Accountant') {
      filter = { status: 'Pending Payment' };
    } else if (role === 'Nurse') {
      filter = { status: 'Pending Sample' };
    } else if (role === 'Lab Technician') {
      filter = { status: { $in: ['Pending Lab', 'Completed'] } };
    }
    // Admin sees all

    const labTests = await LabTest.find(filter)
      .populate({ path: 'patient', populate: { path: 'user', select: 'name email role' } })
      .populate('doctor nurse labTechnician paymentConfirmedBy')
      .sort({ createdAt: -1 });

    res.json(labTests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
