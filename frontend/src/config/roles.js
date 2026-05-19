import {
  Activity,
  BarChart3,
  Calendar,
  Clock,
  CreditCard,
  DollarSign,
  FileText,
  HeartPulse,
  LayoutDashboard,
  Pill,
  Settings,
  ShieldCheck,
  Stethoscope,
  TrendingUp,
  UserRound,
  Users,
  ClipboardPlus,
  ClipboardList,
  DoorOpen,
} from "lucide-react";

export const APP_ROLES = [
  "Admin",
  "Doctor",
  "Nurse",
  "Receptionist",
  "Patient",
  "Pharmacist",
  "Accountant",
];

export const rolePath = (role) => `/${String(role || "admin").toLowerCase()}/dashboard`;

export const roleProfilePath = (role) => `/${String(role || "admin").toLowerCase()}/profile`;

export const sidebarNav = [
  { label: "Dashboard", to: "dashboard", icon: LayoutDashboard, roles: APP_ROLES },
  { label: "Patients", to: "patients", icon: UserRound, roles: ["Admin", "Doctor", "Nurse", "Receptionist"] },
  { label: "Doctors", to: "doctors", icon: Stethoscope, roles: ["Admin"] },
  { label: "Nurses", to: "nurses", icon: HeartPulse, roles: ["Admin"] },
  { label: "Appointments", to: "appointments", icon: Calendar, roles: ["Admin", "Doctor", "Nurse", "Receptionist", "Patient"] },
  { label: "Rooms", to: "rooms", icon: DoorOpen, roles: ["Admin", "Receptionist", "Doctor", "Nurse"] },
  { label: "Prescriptions", to: "prescriptions", icon: ClipboardPlus, roles: ["Admin", "Doctor", "Patient"] },
  { label: "Pharmacists", to: "pharmacy", icon: Pill, roles: ["Admin"] },
  { label: "Billing", to: "billing", icon: CreditCard, roles: ["Admin", "Receptionist"] },
  { label: "Reports", to: "reports", icon: BarChart3, roles: ["Admin", "Doctor", "Nurse", "Pharmacist", "Accountant"] },
  { label: "Analytics", to: "analytics", icon: TrendingUp, roles: ["Admin"] },
  { label: "Settings", to: "profile", icon: Settings, roles: APP_ROLES },
];

const sharedPanels = [
  {
    title: "Profile",
    icon: ShieldCheck,
    items: [
      { label: "Name", valueKey: "name" },
      { label: "Email", valueKey: "email" },
      { label: "Role", valueKey: "role" },
      { label: "Status", valueKey: "status" },
    ],
  },
];

export const dashboardConfig = {
  Admin: {
    eyebrow: "Royal Command Center",
    title: "Hospital Operations",
    subtitle: "Unified administrative oversight, active clinical flow, and real-time department monitoring.",
    status: "All Clinical & Administrative Departments Online",
    stats: [
      { label: "Active staff", value: "74", change: "+6 today", icon: Users },
      { label: "Open appointments", value: "156", change: "18 pending", icon: Calendar },
      { label: "Revenue today", value: "$42.8k", change: "+8.2%", icon: DollarSign },
      { label: "Critical alerts", value: "04", change: "Needs review", icon: Activity },
    ],
    highlights: [
      { title: "Staff Directory", description: "Manage doctor credentials, assign nurse shifts, and administer secure role-based tokens." },
      { title: "Clinical Oversight", description: "Track real-time ward admissions, patient room allocations, and resolve emergency bottlenecks." },
      { title: "Revenue & Finance", description: "Oversee daily medical billings, approve accountant audits, and monitor financial collections." },
    ],
    worklist: [
      { title: "Doctor Schedule Gaps", detail: "2 critical ward shifts require coverage today" },
      { title: "Reception Bottlenecks", detail: "4 patients delayed at front desk check-in" },
      { title: "Invoice Verifications", detail: "3 accountant reports awaiting executive approval" },
    ],
    users: [
      {
        name: "Admin User",
        email: "admin@hospital.com",
        role: "Admin",
        status: "System Owner",
        profileImage: "https://i.pravatar.cc/150?img=1",
      },
      {
        name: "Dr. Sarah",
        email: "doctor@hospital.com",
        role: "Doctor",
        status: "On Duty",
        profileImage: "https://i.pravatar.cc/150?img=5",
      },
      {
        name: "Nurse Joy",
        email: "nurse@hospital.com",
        role: "Nurse",
        status: "On Shift",
        profileImage: "https://i.pravatar.cc/150?img=47",
      },
      {
        name: "Front Desk Ava",
        email: "receptionist@hospital.com",
        role: "Receptionist",
        status: "Front Desk",
        profileImage: "https://i.pravatar.cc/150?img=32",
      },
      {
        name: "John Patient",
        email: "patient@hospital.com",
        role: "Patient",
        status: "Active",
        profileImage: "https://i.pravatar.cc/150?img=8",
      },
      {
        name: "Pharma Lee",
        email: "pharmacist@hospital.com",
        role: "Pharmacist",
        status: "Dispensing",
        profileImage: "https://i.pravatar.cc/150?img=12",
      },
      {
        name: "Accountant Noor",
        email: "accountant@hospital.com",
        role: "Accountant",
        status: "Reviewing",
        profileImage: "https://i.pravatar.cc/150?img=15",
      },
    ],
    panels: sharedPanels,
  },
  Doctor: {
    eyebrow: "Clinical Workspace",
    title: "Doctor dashboard",
    subtitle: "Patient flow, notes, and prescriptions at a glance.",
    status: "On duty",
    stats: [
      { label: "Patients today", value: "18", change: "+4 vs yesterday", icon: Users },
      { label: "Active visits", value: "06", change: "Next at 09:20", icon: Clock },
      { label: "Prescriptions", value: "12", change: "4 reviewed", icon: ClipboardList },
      { label: "Clinical success", value: "94%", change: "+6% this month", icon: TrendingUp },
    ],
    highlights: [
      { title: "Clinical queue", description: "Upcoming patients, triage notes, and room status in one view." },
      { title: "Prescription flow", description: "Create and review medication orders without leaving the dashboard." },
      { title: "Critical follow-ups", description: "Surface the patients who need attention first." },
    ],
    worklist: [
      { title: "09:20 AM", detail: "Sarah Johnson - Cardio follow-up" },
      { title: "10:05 AM", detail: "Mike Peters - Respiratory review" },
      { title: "11:15 AM", detail: "Emily Davis - Post-op check" },
    ],
    panels: sharedPanels,
  },
  Nurse: {
    eyebrow: "Ward Control",
    title: "Nurse dashboard",
    subtitle: "Vital checks, handoffs, and patient flow across units.",
    status: "On shift",
    stats: [
      { label: "Vital checks", value: "26", change: "8 due next", icon: HeartPulse },
      { label: "Handoffs", value: "11", change: "3 urgent", icon: ClipboardList },
      { label: "Ward rounds", value: "08", change: "Today completed", icon: Activity },
      { label: "Escalations", value: "02", change: "Review required", icon: ShieldCheck },
    ],
    highlights: [
      { title: "Bedside flow", description: "Keep rounds, admissions, and discharges organized." },
      { title: "Shift handoff", description: "See what needs attention before the next shift starts." },
      { title: "Patient monitoring", description: "Track vitals and alerts without switching views." },
    ],
    worklist: [
      { title: "Ward A", detail: "3 vitals pending" },
      { title: "Ward B", detail: "2 discharge notes pending" },
      { title: "Ward C", detail: "1 escalation flagged" },
    ],
    panels: sharedPanels,
  },
  Receptionist: {
    eyebrow: "Front Desk",
    title: "Reception dashboard",
    subtitle: "Check-ins, appointments, and queue management.",
    status: "Front desk active",
    stats: [
      { label: "Check-ins", value: "29", change: "+5 today", icon: UserRound },
      { label: "Appointments", value: "41", change: "12 confirmed", icon: Calendar },
      { label: "Calls waiting", value: "07", change: "3 urgent", icon: Activity },
      { label: "No-shows", value: "02", change: "Below target", icon: ShieldCheck },
    ],
    highlights: [
      { title: "Patient intake", description: "Register arrivals and route patients to the right department." },
      { title: "Queue control", description: "Keep appointments, walk-ins, and call-backs in sync." },
      { title: "Billing handoff", description: "Prepare account details before patients reach finance." },
    ],
    worklist: [
      { title: "New arrival", detail: "4 patients waiting for check-in" },
      { title: "Follow-up calls", detail: "7 confirmations due" },
      { title: "Insurance desk", detail: "2 verifications pending" },
    ],
    panels: sharedPanels,
  },
  Patient: {
    eyebrow: "Patient Portal",
    title: "My health dashboard",
    subtitle: "Appointments, prescriptions, and billing in one secure space.",
    status: "Active account",
    stats: [
      { label: "Upcoming visit", value: "Tue 10:30", change: "Cardiology", icon: Calendar },
      { label: "Prescriptions", value: "03", change: "1 refill due", icon: ClipboardList },
      { label: "Lab reports", value: "02", change: "Ready to view", icon: FileText },
      { label: "Balance", value: "$120", change: "1 invoice open", icon: CreditCard },
    ],
    highlights: [
      { title: "Upcoming care", description: "See what is next without calling the front desk." },
      { title: "Documents", description: "Review prescriptions, reports, and visit summaries." },
      { title: "Payments", description: "Track outstanding balance and completed payments." },
    ],
    worklist: [
      { title: "Next appointment", detail: "Cardiology review on Tuesday" },
      { title: "Medication", detail: "1 prescription ready for refill" },
      { title: "Billing", detail: "1 outstanding invoice" },
    ],
    panels: sharedPanels,
  },
  Pharmacist: {
    eyebrow: "Pharmacy Desk",
    title: "Pharmacist dashboard",
    subtitle: "Orders, stock levels, and dispensing workflow.",
    status: "Dispensing active",
    stats: [
      { label: "Pending orders", value: "14", change: "6 urgent", icon: ClipboardList },
      { label: "Stock alerts", value: "05", change: "Low inventory", icon: Pill },
      { label: "Dispensed today", value: "31", change: "+9 vs yesterday", icon: Activity },
      { label: "Pending reviews", value: "08", change: "Doctor sign-off", icon: ShieldCheck },
    ],
    highlights: [
      { title: "Medication queue", description: "Review prescriptions in the order they arrive." },
      { title: "Inventory watch", description: "Keep an eye on low stock before it becomes a gap." },
      { title: "Dispense log", description: "Track what left the pharmacy and when." },
    ],
    worklist: [
      { title: "Recent order", detail: "Amoxicillin - awaiting review" },
      { title: "Stock notice", detail: "Ibuprofen below threshold" },
      { title: "Dispense log", detail: "31 items completed today" },
    ],
    panels: sharedPanels,
  },
  Accountant: {
    eyebrow: "Finance Desk",
    title: "Accountant dashboard",
    subtitle: "Collections, claims, and financial tracking.",
    status: "Reconciliation running",
    stats: [
      { label: "Payments", value: "$18.4k", change: "+12% this week", icon: DollarSign },
      { label: "Claims pending", value: "09", change: "4 overdue", icon: CreditCard },
      { label: "Invoices open", value: "22", change: "7 due today", icon: FileText },
      { label: "Reports ready", value: "06", change: "Monthly close", icon: TrendingUp },
    ],
    highlights: [
      { title: "Collections", description: "Review payments and outstanding invoices quickly." },
      { title: "Claims", description: "See what is pending without digging through records." },
      { title: "Close-out", description: "Prepare end-of-day and monthly summaries with confidence." },
    ],
    worklist: [
      { title: "Today collected", detail: "$4.2k posted to accounts" },
      { title: "Pending claims", detail: "4 insurance items require review" },
      { title: "Month close", detail: "6 reports ready for export" },
    ],
    panels: sharedPanels,
  },
};

export const sectionConfig = {
  patients: {
    title: "Patients",
    subtitle: "Live intake, care flow, and patient-level activity.",
    stats: [
      { label: "In care", value: "128", change: "+9 today", icon: Users },
      { label: "Waiting", value: "24", change: "8 urgent", icon: Activity },
      { label: "Appointments", value: "41", change: "Today", icon: Calendar },
      { label: "Follow-ups", value: "18", change: "Needs review", icon: ShieldCheck },
    ],
    cards: [
      { title: "Admissions", detail: "New registrations and ward intake." },
      { title: "Discharges", detail: "Patients cleared for exit and follow-up." },
      { title: "Care plans", detail: "Track active treatment plans." },
    ],
  },
  doctors: {
    title: "Doctors",
    subtitle: "Clinical coverage, specialist load, and consultation flow.",
    stats: [
      { label: "On duty", value: "32", change: "6 specialists", icon: Stethoscope },
      { label: "Consults", value: "74", change: "This week", icon: Users },
      { label: "Rounds", value: "18", change: "Today", icon: Calendar },
      { label: "Escalations", value: "05", change: "Review", icon: ShieldCheck },
    ],
    cards: [
      { title: "Coverage", detail: "Availability across departments and shifts." },
      { title: "Specialists", detail: "Active consultants and care areas." },
      { title: "Notes", detail: "Clinical updates and follow-up tasks." },
    ],
  },
  nurses: {
    title: "Nurses",
    subtitle: "Ward activity, handoff visibility, and bedside support.",
    stats: [
      { label: "On shift", value: "26", change: "2 handoffs", icon: HeartPulse },
      { label: "Vitals", value: "48", change: "Recorded today", icon: Activity },
      { label: "Rounds", value: "14", change: "Completed", icon: Calendar },
      { label: "Alerts", value: "03", change: "Escalations", icon: ShieldCheck },
    ],
    cards: [
      { title: "Ward flow", detail: "Admissions, bedside checks, discharge prep." },
      { title: "Shift handoff", detail: "What the next team needs to know." },
      { title: "Monitoring", detail: "Vitals and alerts in one view." },
    ],
  },
  appointments: {
    title: "Appointments",
    subtitle: "Bookings, confirmations, and queue management.",
    stats: [
      { label: "Today", value: "41", change: "+5 from yesterday", icon: Calendar },
      { label: "Pending", value: "12", change: "Needs confirm", icon: Activity },
      { label: "Checked in", value: "29", change: "Arrived", icon: Users },
      { label: "No-shows", value: "02", change: "Below target", icon: ShieldCheck },
    ],
    cards: [
      { title: "Queue", detail: "Incoming visits and room assignment." },
      { title: "Confirmations", detail: "Calls and SMS reminders." },
      { title: "Reschedules", detail: "Pending date changes." },
    ],
  },
  prescriptions: {
    title: "Prescriptions",
    subtitle: "Medication review, approvals, and follow-up orders.",
    stats: [
      { label: "Pending", value: "14", change: "6 urgent", icon: ClipboardPlus },
      { label: "Approved", value: "31", change: "This week", icon: ClipboardList },
      { label: "Refills", value: "08", change: "Due soon", icon: Pill },
      { label: "Reviewed", value: "22", change: "Today", icon: ShieldCheck },
    ],
    cards: [
      { title: "Queue", detail: "Orders awaiting clinical review." },
      { title: "Refills", detail: "Repeat medication requests." },
      { title: "Dispense", detail: "Completed medication handoff." },
    ],
  },
  pharmacy: {
    title: "Pharmacists",
    subtitle: "Medication experts, prescription verification, and dispensary management.",
    stats: [
      { label: "Active", value: "4", change: "On Duty", icon: Pill },
      { label: "Dispensed", value: "31", change: "Today", icon: Activity },
      { label: "Pending", value: "14", change: "In Queue", icon: ClipboardList },
      { label: "Verified", value: "18", change: "Completed", icon: ShieldCheck },
    ],
    cards: [
      { title: "Verification", detail: "Inspect doctor prescriptions before dispensing." },
      { title: "Distribution", detail: "Dispense verified medicines to patients safely." },
      { title: "Logistics", detail: "Manage medication catalog and inventory status." },
    ],
  },
  billing: {
    title: "Billing",
    subtitle: "Invoices, payments, and account reconciliation.",
    stats: [
      { label: "Collected", value: "$18.4k", change: "+12% this week", icon: DollarSign },
      { label: "Open invoices", value: "22", change: "Due today", icon: CreditCard },
      { label: "Claims", value: "09", change: "Pending", icon: FileText },
      { label: "Receipts", value: "38", change: "Posted", icon: ShieldCheck },
    ],
    cards: [
      { title: "Invoices", detail: "Outstanding and closed patient bills." },
      { title: "Claims", detail: "Insurance items needing review." },
      { title: "Collections", detail: "Payments and reconciliations." },
    ],
  },
  reports: {
    title: "Reports",
    subtitle: "Operational summaries and performance insights.",
    stats: [
      { label: "Generated", value: "06", change: "This month", icon: FileText },
      { label: "Growth", value: "94%", change: "Positive trend", icon: TrendingUp },
      { label: "Revenue", value: "$42.8k", change: "Today", icon: DollarSign },
      { label: "Signals", value: "04", change: "Review", icon: Activity },
    ],
    cards: [
      { title: "Clinical", detail: "Service trends and patient activity." },
      { title: "Finance", detail: "Collections and cash flow reports." },
      { title: "Operations", detail: "Capacity and workflow summaries." },
    ],
  },
  settings: {
    title: "Settings",
    subtitle: "Session, access, and profile controls.",
    stats: [
      { label: "Profile", value: "Ready", change: "Up to date", icon: ShieldCheck },
      { label: "Access", value: "Secure", change: "Role-based", icon: Users },
      { label: "Theme", value: "Dark", change: "Active", icon: Activity },
      { label: "Session", value: "Live", change: "Connected", icon: Calendar },
    ],
    cards: [
      { title: "Profile", detail: "Your account identity and status." },
      { title: "Security", detail: "Password and session controls." },
      { title: "Preferences", detail: "Theme and app settings." },
    ],
  },
  rooms: {
    title: "Hospital Rooms",
    subtitle: "Manage ward occupancy and room allocations.",
    stats: [
      { label: "Total Rooms", value: "48", change: "Capacity", icon: DoorOpen },
      { label: "Available", value: "32", change: "Ready", icon: Activity },
      { label: "Occupied", value: "14", change: "Current", icon: Users },
      { label: "VIP Suites", value: "02", change: "Premium", icon: CreditCard },
    ],
    cards: [
      { title: "Allocations", detail: "Assigning patients to available beds." },
      { title: "Maintenance", detail: "Rooms currently under service." },
      { title: "Pricing", detail: "Manage room rates and types." },
    ],
  },
};
