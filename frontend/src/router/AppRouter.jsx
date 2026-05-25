import React from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Profile from "../pages/Profile";
import SectionPage from "../pages/SectionPage";
import Home from "../pages/Home";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { rolePath } from "../config/roles";

import AdminDashboard from "../pages/dashboards/AdminDashboard";
import DoctorDashboard from "../pages/dashboards/DoctorDashboard";
import NurseDashboard from "../pages/dashboards/NurseDashboard";
import ReceptionistDashboard from "../pages/dashboards/ReceptionistDashboard";
import PatientDashboard from "../pages/dashboards/PatientDashboard";
import PharmacistDashboard from "../pages/dashboards/PharmacistDashboard";
import AccountantDashboard from "../pages/dashboards/AccountantDashboard";
import LabTechnicianDashboard from "../pages/dashboards/LabTechnicianDashboard";
import PharmacistPrescriptions from "../pages/pharmacist/PharmacistPrescriptions";

import Patients from "../pages/Patients";
import Doctors from "../pages/Doctors";
import Appointments from "../pages/Appointments";
import DoctorAppointments from "../pages/doctor/DoctorAppointments";
import DoctorPrescriptions from "../pages/doctor/DoctorPrescriptions";
import DoctorReports from "../pages/doctor/DoctorReports";
import Rooms from "../pages/Rooms";
import BillingCheckout from "../pages/BillingCheckout";
import AdminAnalytics from "../pages/AdminAnalytics";
import LabTests from "../pages/LabTests";

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function RoleGate({ children }) {
  const { user } = useAuth();
  const { role } = useParams();
  const expected = user?.role?.toLowerCase();
  if (user && role !== expected) {
    return <Navigate to={rolePath(user.role)} replace />;
  }
  return children;
}

function DashboardSwitcher() {
  const { user } = useAuth();
  switch (user?.role) {
    case "Admin": return <AdminDashboard />;
    case "Doctor": return <DoctorDashboard />;
    case "Nurse": return <NurseDashboard />;
    case "Receptionist": return <ReceptionistDashboard />;
    case "Patient": return <PatientDashboard />;
    case "Pharmacist": return <PharmacistDashboard />;
    case "Accountant": return <AccountantDashboard />;
    case "Lab Technician": return <LabTechnicianDashboard />;
    default: return <Navigate to="/login" replace />;
  }
}

function SectionRouteWrapper() {
  const { role, section } = useParams();
  
  if (section === "patients") {
    return <Patients />;
  }

  if (section === "analytics" && role === "admin") {
    return <AdminAnalytics />;
  }
  
  if (section === "doctors") {
    return <Doctors />;
  }
  
  if (section === "appointments" && role !== "doctor") {
    return <Appointments />;
  }
  
  if (section === "reports") {
    return <DoctorReports />;
  }
  
  if (role === "doctor" || role === "admin") {
    switch (section) {
      case "appointments": 
        if (role === "doctor") return <DoctorAppointments />;
        break; // Admins use general appointments above
      case "prescriptions": return <DoctorPrescriptions />;
      case "reports": return <DoctorReports />;
      default: break;
    }
  }

  if (section === "billing") {
    return <BillingCheckout />;
  }

  if (section === "rooms" && role === "admin") {
    return <Rooms />;
  }

  if (section === "rooms") {
    return <Navigate to={rolePath(role)} replace />;
  }

  if (role === "pharmacist") {
    switch (section) {
      case "prescriptions":
      case "pharmacy":
        return <PharmacistPrescriptions />;
      default: return <SectionPage />;
    }
  }

  if (section === "lab-tests") {
    return <LabTests />;
  }

  return <SectionPage />;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/:role/dashboard"
        element={
          <Protected>
            <RoleGate>
              <Layout />
            </RoleGate>
          </Protected>
        }
      >
        <Route index element={<DashboardSwitcher />} />
      </Route>
      <Route
        path="/:role/profile"
        element={
          <Protected>
            <RoleGate>
              <Layout />
            </RoleGate>
          </Protected>
        }
      >
        <Route index element={<Profile />} />
      </Route>
      <Route
        path="/:role/:section"
        element={
          <Protected>
            <RoleGate>
              <Layout />
            </RoleGate>
          </Protected>
        }
      >
        <Route index element={<SectionRouteWrapper />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
