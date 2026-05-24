import LabTest from '../models/LabTest.js';
import Prescription from '../models/Prescription.js';
import User from '../models/User.js';
import { createNotification } from './notificationController.js';

/**
 * Create a lab test order (called by Doctor).
 * Expects body: { patientId, testName, notes, prescriptionId (optional) }
 */
export const createLabTest = async (req, res) => {
  try {
    const { patientId, testName, notes, prescriptionId } = req.body;
    if (!patientId || !testName) return res.status(400).json({ message: 'Patient and Test Name are required' });

    const labTest = await LabTest.create({
      patient: patientId,
      doctor: req.user._id,
      testName,
      notes,
      status: 'Pending Payment',
      prescription: prescriptionId || null,
    });

    // Notify Receptionists that a new lab test needs payment
    await createNotification({
      roles: ['Receptionist', 'Admin'],
      title: 'New Lab Test Order',
      body: `Dr. ${req.user.name} ordered a "${testName}". Awaiting patient payment.`,
      type: 'info',
      link: '/receptionist/lab-tests',
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
    const labTest = await LabTest.findById(id);
    if (!labTest) return res.status(404).json({ message: 'Lab test not found' });

    labTest.status = 'Pending Lab';
    labTest.nurse = req.user._id;
    await labTest.save();

    // Notify Lab Technicians
    await createNotification({
      roles: ['Lab Technician'],
      title: 'Sample Ready for Analysis',
      body: `Nurse ${req.user.name} collected the sample for "${labTest.testName}". Ready to analyze.`,
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
    const labTest = await LabTest.findById(id);
    if (!labTest) return res.status(404).json({ message: 'Lab test not found' });

    const { resultText } = req.body;
    if (resultText) labTest.resultText = resultText;
    if (req.file) labTest.resultFileUrl = `/uploads/lab-results/${req.file.filename}`;
    labTest.status = 'Completed';
    labTest.labTechnician = req.user._id;
    await labTest.save();

    // Notify the Doctor who requested this test
    await createNotification({
      recipientIds: [labTest.doctor],
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
      .populate('patient doctor nurse labTechnician');
    if (!labTest) return res.status(404).json({ message: 'Lab test not found' });
    const userId = req.user._id.toString();
    const allowed =
      labTest.doctor?._id?.toString() === userId ||
      labTest.nurse?._id?.toString() === userId ||
      labTest.labTechnician?._id?.toString() === userId ||
      labTest.patient?._id?.toString() === userId ||
      req.user.role === 'Admin';
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
      filter = { patient: req.user._id };
    } else if (role === 'Doctor') {
      filter = { doctor: req.user._id };
    } else if (role === 'Lab Technician') {
      filter = { status: { $in: ['Pending Lab', 'Completed'] } };
    }
    // Admin, Nurse, Receptionist, Accountant see all

    const labTests = await LabTest.find(filter)
      .populate('patient doctor nurse labTechnician')
      .sort({ createdAt: -1 });

    res.json(labTests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

