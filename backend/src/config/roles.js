// Updated roles to include Laboratory role
export const ROLES = [
  "Admin",
  "Doctor",
  "Nurse",
  "Receptionist",
  "Patient",
  "Pharmacist",
  "Accountant",
  "Lab Technician",
  "Laboratory"
];

export const ROLE_STATUS = {
  Admin: "Super User",
  Doctor: "Active",
  Nurse: "On Duty",
  Receptionist: "Available",
  Patient: "Registered",
  Pharmacist: "On Duty",
  Accountant: "Active",
  "Lab Technician": "On Duty",
  Laboratory: "On Duty"
};

export const ROLE_SEEDS = [
  // existing seeds ... (kept unchanged for brevity)
];
