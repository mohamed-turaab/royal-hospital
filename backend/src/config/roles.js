export const ROLES = [
  "Admin",
  "Doctor",
  "Nurse",
  "Receptionist",
  "Patient",
  "Pharmacist",
  "Accountant",
];

export const ROLE_STATUS = {
  Admin: "Super User",
  Doctor: "Active",
  Nurse: "On Duty",
  Receptionist: "Available",
  Patient: "Registered",
  Pharmacist: "On Duty",
  Accountant: "Active",
};

export const ROLE_SEEDS = [
  {
    name: "Royal Admin",
    email: "admin@hospital.com",
    role: "Admin",
    profileImage: "https://i.pravatar.cc/150?img=1",
  },
  {
    name: "Dr. Ahmed Yusuf",
    email: "doctor@hospital.com",
    role: "Doctor",
    profileImage: "https://i.pravatar.cc/150?img=5",
  },
  {
    name: "Nurse Halimo",
    email: "nurse@hospital.com",
    role: "Nurse",
    profileImage: "https://i.pravatar.cc/150?img=47",
  },
  {
    name: "Liban Reception",
    email: "reception@hospital.com",
    role: "Receptionist",
    profileImage: "https://i.pravatar.cc/150?img=32",
  },
  {
    name: "Hassan Patient",
    email: "patient@hospital.com",
    role: "Patient",
    profileImage: "https://i.pravatar.cc/150?img=8",
  },
  {
    name: "Muna Pharma",
    email: "pharma@hospital.com",
    role: "Pharmacist",
    profileImage: "https://i.pravatar.cc/150?img=12",
  },
  {
    name: "Abdi Accountant",
    email: "accountant@hospital.com",
    role: "Accountant",
    profileImage: "https://i.pravatar.cc/150?img=15",
  },
];
