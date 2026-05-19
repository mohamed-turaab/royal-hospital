import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/Avatar";
import { 
  Search, Filter, Activity, HeartPulse, UserRound, FileText,
  Thermometer, Droplets, Calendar, Pill, X, Stethoscope,
  ChevronRight, PhoneCall, Mail, MapPin, Plus, Edit, Trash2,
  ShieldCheck, Download, Users
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

function StatCard({ item, index }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5, scale: 1.02 }}
      className="stat-card"
    >
      <div className="flex justify-between items-start mb-6">
        <div
          className={`p-4 rounded-2xl ${index % 2 === 0 ? "bg-royalBlue/10 text-royalBlue" : "bg-royalYellow/10 text-royalYellow-700"} transition-transform duration-500`}
        >
          <item.icon size={24} />
        </div>
        <div className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-[10px] font-black text-green-700 uppercase tracking-widest dark:bg-green-500/10 dark:text-green-400">
          {item.change}
        </div>
      </div>
      <div className="text-4xl font-black text-royalBlue-900 dark:text-white mb-1">
        {item.value}
      </div>
      <div className="text-[11px] font-black text-royalBlue-400 uppercase tracking-[0.2em]">
        {item.label}
      </div>
    </motion.div>
  );
}

export default function Patients() {
  const { user } = useAuth();
  const role = user?.role || "Admin";
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", age: "", gender: "Male",
    bloodGroup: "O+", phone: "", address: "", condition: "Undiagnosed",
    status: "Stable", room: "Unassigned", assignedDoctor: ""
  });

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get("/appointments");
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const fetchPatients = async () => {
    try {
      const { data } = await api.get("/patients");
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const { data } = await api.get("/doctors");
      setDoctors(data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const handleOpenModal = (patient = null) => {
    if (patient) {
      setEditingPatient(patient);
      setFormData({
        name: patient.user?.name || patient.name,
        email: patient.user?.email || "",
        password: "", // Leave blank on edit
        age: patient.age || "",
        gender: patient.gender || "Male",
        bloodGroup: patient.bloodGroup || "O+",
        phone: patient.phone || "",
        address: patient.address || "",
        condition: patient.condition || "Undiagnosed",
        status: patient.status || "Stable",
        room: patient.room || "Unassigned",
        assignedDoctor: patient.assignedDoctor?._id || ""
      });
    } else {
      setEditingPatient(null);
      setFormData({
        name: "", email: "", password: "", age: "", gender: "Male",
        bloodGroup: "O+", phone: "", address: "", condition: "Undiagnosed",
        status: "Stable", room: "Unassigned", assignedDoctor: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPatient) {
        await api.put(`/patients/${editingPatient._id}`, formData);
      } else {
        await api.post("/patients", formData);
      }
      setIsModalOpen(false);
      fetchPatients();
    } catch (error) {
      alert("Error saving patient: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        await api.delete(`/patients/${id}`);
        fetchPatients();
      } catch (error) {
        alert("Error deleting patient");
      }
    }
  };

  const handleExport = () => {
    if (!patients.length) return alert("No data to export");
    const headers = ["Name", "Age", "Gender", "Blood Group", "Condition", "Status", "Room"].join(",");
    const csv = patients.map(p => 
      [
        JSON.stringify(p.user?.name || p.name || ""),
        JSON.stringify(p.age || ""),
        JSON.stringify(p.gender || ""),
        JSON.stringify(p.bloodGroup || ""),
        JSON.stringify(p.condition || ""),
        JSON.stringify(p.status || ""),
        JSON.stringify(p.room || "")
      ].join(",")
    ).join("\n");
    const blob = new Blob([`${headers}\n${csv}`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `patients-export.csv`;
    a.click();
  };

  const filteredPatients = patients.filter(p => {
    const pName = p.user?.name || p.name || "";
    const pId = p._id || "";
    const matchesSearch = pName.toLowerCase().includes(searchTerm.toLowerCase()) || pId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const renderStatusBadge = (status) => {
    switch(status) {
      case "Stable": return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-navyBlue-100 text-navyBlue-700 border border-navyBlue-200 dark:bg-navyBlue-900/50 dark:text-navyBlue-300 dark:border-navyBlue-700 shadow-sm">Stable</span>;
      case "Critical": return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-200 shadow-[0_0_15px_rgba(239,68,68,0.4)] dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Critical
        </span>
      );
      case "Recovering": return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-500/10 to-royalBlue/10 text-emerald-700 border border-emerald-200 dark:text-emerald-400 dark:border-emerald-800 shadow-sm">Recovering</span>;
      default: return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 shadow-sm">{status}</span>;
    }
  };

  const stats = [
    { label: "In care", value: patients.length.toString(), change: "Total Patients", icon: Users },
    { label: "Unassigned", value: patients.filter(p => p.room === "Unassigned").length.toString(), change: "No room assigned", icon: Activity },
    { label: "Appointments", value: appointments.length.toString(), change: "Scheduled", icon: Calendar },
    { label: "Critical", value: patients.filter(p => p.status === "Critical").length.toString(), change: "Urgent care", icon: ShieldCheck },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 sm:space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[28px] sm:rounded-[40px] lg:rounded-[48px] bg-royalBlue-950 p-6 sm:p-10 md:p-16 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-royalBlue/20 to-transparent blur-3xl opacity-50" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-royalYellow/10 rounded-full blur-[100px]" />
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-8 lg:gap-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-white/10 border border-white/20 text-royalYellow text-[10px] font-black uppercase tracking-[0.3em] mb-6 sm:mb-8 backdrop-blur-md">
              <ShieldCheck size={16} /> Patients Management
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter mb-4 sm:mb-6">
              Patients
            </h1>
            <p className="text-royalBlue-200/80 text-base sm:text-xl leading-relaxed max-w-xl">
              Live intake, care flow, and patient-level activity.
            </p>
            <div className="mt-6 sm:mt-10 flex flex-wrap gap-3 sm:gap-4">
              {role === "Receptionist" && (
                <button onClick={() => handleOpenModal()} className="btn-primary px-6 sm:px-8 group">
                  <Plus size={20} className="transition-transform group-hover:rotate-90" /> Add New Patient
                </button>
              )}
              <button onClick={handleExport} className="flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all backdrop-blur-md">
                <Download size={18} /> Export Data
              </button>
            </div>
          </div>

          <div className="w-full lg:w-[380px] rounded-[40px] border border-white/10 bg-white/10 p-8 backdrop-blur-2xl shadow-2xl self-center">
            <div className="flex items-center gap-5">
              <Avatar
                src={user?.profileImage}
                name={user?.name}
                size="h-16 w-16 shadow-2xl ring-2 ring-royalYellow/50"
              />
              <div className="min-w-0">
                <div className="text-xl font-black text-white truncate">
                  {user?.name}
                </div>
                <div className="text-[11px] font-black text-royalYellow uppercase tracking-widest">
                  {role} Control
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {stats.map((item, index) => (
          <StatCard key={item.label} item={item} index={index} />
        ))}
      </div>

      {/* Filter and Search Section */}
      <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-royalBlue-900 dark:text-white">
            Patient Records
          </h2>
          <p className="mt-1 text-sm font-medium text-royalBlue-500 dark:text-royalBlue-400">
            {filteredPatients.length} patients currently identified in the database.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 relative">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-royalBlue-400 group-focus-within:text-royalBlue transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 rounded-2xl border border-navyBlue-100 bg-white pl-10 pr-4 py-3 text-sm font-bold text-navyBlue-900 outline-none transition-all focus:border-royalBlue placeholder:text-royalBlue-300 dark:border-navyBlue-800 dark:bg-navyBlue-900/40 dark:text-white shadow-md shadow-navyBlue-200/5"
            />
          </div>
          
          <div className="flex items-center gap-2 rounded-2xl border border-navyBlue-100 bg-white p-1 backdrop-blur-md dark:border-navyBlue-800 dark:bg-navyBlue-900/40 shadow-md">
            {["All", "Stable", "Critical", "Recovering"].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                  filterStatus === status 
                    ? "bg-royalBlue text-white shadow-lg shadow-royalBlue/30" 
                    : "text-royalBlue-400 hover:text-royalBlue dark:text-navyBlue-300 dark:hover:text-white hover:bg-navyBlue-50/50 dark:hover:bg-white/5"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Patient Table */}
      <div className="table-container shadow-2xl relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-navyBlue-50/80 backdrop-blur-xl sticky top-0 z-10 border-b border-navyBlue-100 dark:bg-navyBlue-900/80 dark:border-navyBlue-800 text-[10px] font-black uppercase tracking-[0.2em] text-navyBlue-500 dark:text-navyBlue-300 shadow-sm">
              <tr>
                <th className="px-6 py-5">Patient Details</th>
                <th className="px-6 py-5">Demographics</th>
                <th className="px-6 py-5">Assignment</th>
                <th className="px-6 py-5">Status & Condition</th>
                {role === "Receptionist" && <th className="px-6 py-5 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-navyBlue-50 dark:divide-navyBlue-800/50">
                {filteredPatients.map((patient) => (
                  <tr
                    key={patient._id}
                    onClick={() => setSelectedPatient(patient)}
                    className="group cursor-pointer transition-all duration-300 hover:bg-navyBlue-50/80 dark:hover:bg-navyBlue-800/30 hover:shadow-inner"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative shrink-0">
                          {patient.user?.profileImage ? (
                            <img src={patient.user.profileImage} alt={patient.user.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-white dark:border-navyBlue-800 shadow-md group-hover:border-royalBlue/30 transition-colors" />
                          ) : (
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-royalBlue to-navyBlue flex items-center justify-center text-white font-black text-xl shadow-md border-2 border-white dark:border-navyBlue-800">
                              {(patient.user?.name || patient.name || "?").charAt(0)}
                            </div>
                          )}
                          {/* Online Indicator */}
                          <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-navyBlue-800 ${patient.user?.status === 'Active' ? 'bg-emerald-500' : 'bg-emerald-500'}`} />
                          
                          {/* Critical Glow */}
                          {patient.status === 'Critical' && (
                            <div className="absolute inset-0 rounded-2xl ring-2 ring-red-500/50 animate-pulse pointer-events-none" />
                          )}
                        </div>
                        <div>
                          <div className="text-base font-black text-navyBlue-900 dark:text-white group-hover:text-royalBlue transition-colors">
                            {patient.user?.name || patient.name}
                          </div>
                          <div className="text-xs font-bold text-navyBlue-500 flex items-center gap-1 mt-0.5">
                            <FileText size={12} /> {patient._id.slice(-6).toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm font-bold text-navyBlue-900 dark:text-white">{patient.age || "--"} yrs</div>
                      <div className="text-xs font-medium text-navyBlue-500">{patient.gender || "--"} • {patient.bloodGroup || "--"}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm font-bold text-navyBlue-900 dark:text-white flex items-center gap-1.5">
                        <UserRound size={14} className="text-royalBlue" /> {patient.room || "Unassigned"}
                      </div>
                      <div className="text-xs font-medium text-navyBlue-500 flex items-center gap-1.5 mt-1">
                        <Stethoscope size={14} className="text-navyBlue-400" /> {patient.assignedDoctor ? patient.assignedDoctor.name : "Unassigned"}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="mb-2">
                        {renderStatusBadge(patient.status)}
                      </div>
                      <div className="text-xs font-bold text-navyBlue-700 dark:text-navyBlue-300 truncate max-w-[200px]">
                        {patient.condition}
                      </div>
                    </td>
                    {role === "Receptionist" && (
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={(e) => { e.stopPropagation(); handleOpenModal(patient); }} className="p-2 text-navyBlue-500 hover:text-royalBlue hover:bg-royalBlue/10 rounded-lg transition-colors">
                            <Edit size={16} />
                          </button>
                          <button onClick={(e) => handleDelete(e, patient._id)} className="p-2 text-navyBlue-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
          
          {filteredPatients.length === 0 && (
            <div className="p-20 text-center flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-3xl bg-navyBlue-50 dark:bg-navyBlue-800/50 flex items-center justify-center mb-6 text-navyBlue-300">
                <Search size={32} />
              </div>
              <h3 className="text-2xl font-black text-navyBlue-900 dark:text-white mb-2">No patients found</h3>
              <p className="text-navyBlue-500 font-medium">Add a new patient or adjust your filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Patient Profile View Modal */}
      {selectedPatient && !isModalOpen && createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: 'rgba(7,27,52,0.75)', backdropFilter: 'blur(6px)' }} onClick={() => setSelectedPatient(null)}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', backgroundColor: '#0d1623', borderRadius: '24px', boxShadow: '0 25px 60px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedPatient(null)} style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
              <X size={20} />
            </button>
            <div style={{ height: '160px', background: 'linear-gradient(135deg, #071B34 0%, #1b75bb 100%)', borderRadius: '24px 24px 0 0', position: 'relative', overflow: 'hidden' }}>
              {selectedPatient.status === 'Critical' && <div style={{ position:'absolute', inset:0, backgroundColor:'rgba(239,68,68,0.2)' }} />}
            </div>
            <div className="px-8 pb-8">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-16 mb-8 relative z-10">
                <div className="relative">
                  {selectedPatient.user?.profileImage ? (
                    <img src={selectedPatient.user.profileImage} alt={selectedPatient.user.name} className="w-32 h-32 rounded-[32px] object-cover border-4 border-white dark:border-navyBlue-950 shadow-xl bg-white" />
                  ) : (
                    <div className="w-32 h-32 rounded-[32px] bg-gradient-to-br from-royalBlue to-navyBlue flex items-center justify-center text-white font-black text-5xl shadow-xl border-4 border-white dark:border-navyBlue-950">
                      {(selectedPatient.user?.name || selectedPatient.name || "?").charAt(0)}
                    </div>
                  )}
                  {selectedPatient.status === 'Critical' && <div className="absolute inset-0 rounded-[32px] ring-4 ring-red-500/50 animate-pulse pointer-events-none" />}
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h2 className="text-3xl font-black text-navyBlue-900 dark:text-white leading-none">
                      {selectedPatient.user?.name || selectedPatient.name}
                    </h2>
                    {renderStatusBadge(selectedPatient.status)}
                  </div>
                  <p className="text-sm font-bold text-navyBlue-500">
                    {selectedPatient._id.slice(-6).toUpperCase()} • {selectedPatient.age || "--"} yrs • {selectedPatient.gender || "--"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                  <div className="p-5 rounded-[24px] bg-navyBlue-50 dark:bg-navyBlue-900/30 border border-navyBlue-100 dark:border-navyBlue-800">
                    <h3 className="text-xs font-black uppercase tracking-widest text-navyBlue-400 mb-4">Patient Info</h3>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <MapPin size={18} className="text-navyBlue-400 shrink-0" />
                        <span className="text-sm font-medium text-navyBlue-700 dark:text-navyBlue-300">{selectedPatient.address || "No address on file"}</span>
                      </div>
                      <div className="flex gap-3">
                        <PhoneCall size={18} className="text-navyBlue-400 shrink-0" />
                        <span className="text-sm font-medium text-navyBlue-700 dark:text-navyBlue-300">{selectedPatient.phone || "No phone on file"}</span>
                      </div>
                      <div className="flex gap-3">
                        <Stethoscope size={18} className="text-navyBlue-400 shrink-0" />
                        <span className="text-sm font-medium text-navyBlue-700 dark:text-navyBlue-300">Primary: {selectedPatient.assignedDoctor ? selectedPatient.assignedDoctor.name : "Unassigned"}</span>
                      </div>
                      <div className="flex gap-3">
                        <UserRound size={18} className="text-navyBlue-400 shrink-0" />
                        <span className="text-sm font-medium text-navyBlue-700 dark:text-navyBlue-300">Room: {selectedPatient.room || "Unassigned"}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-navyBlue-400 mb-4 flex items-center gap-2">
                      <Activity size={16} /> Latest Vitals
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 rounded-[20px] bg-white dark:bg-navyBlue-900/50 border border-navyBlue-100 dark:border-navyBlue-800 shadow-sm">
                        <div className="flex items-center gap-2 text-navyBlue-500 mb-2">
                          <HeartPulse size={16} className="text-red-500" />
                          <span className="text-[10px] font-black uppercase">Heart Rate</span>
                        </div>
                        <p className="text-xl font-black text-navyBlue-900 dark:text-white">
                          {selectedPatient.vitals?.hr || 80} <span className="text-xs font-medium text-navyBlue-400">bpm</span>
                        </p>
                      </div>
                      <div className="p-4 rounded-[20px] bg-white dark:bg-navyBlue-900/50 border border-navyBlue-100 dark:border-navyBlue-800 shadow-sm">
                        <div className="flex items-center gap-2 text-navyBlue-500 mb-2">
                          <Activity size={16} className="text-royalBlue" />
                          <span className="text-[10px] font-black uppercase">BP</span>
                        </div>
                        <p className="text-xl font-black text-navyBlue-900 dark:text-white">
                          {selectedPatient.vitals?.bp || "120/80"} <span className="text-xs font-medium text-navyBlue-400">mmHg</span>
                        </p>
                      </div>
                      <div className="p-4 rounded-[20px] bg-white dark:bg-navyBlue-900/50 border border-navyBlue-100 dark:border-navyBlue-800 shadow-sm">
                        <div className="flex items-center gap-2 text-navyBlue-500 mb-2">
                          <Thermometer size={16} className="text-orange-500" />
                          <span className="text-[10px] font-black uppercase">Temp</span>
                        </div>
                        <p className="text-xl font-black text-navyBlue-900 dark:text-white">
                          {selectedPatient.vitals?.temp || "37.0°C"}
                        </p>
                      </div>
                      <div className="p-4 rounded-[20px] bg-white dark:bg-navyBlue-900/50 border border-navyBlue-100 dark:border-navyBlue-800 shadow-sm">
                        <div className="flex items-center gap-2 text-navyBlue-500 mb-2">
                          <Droplets size={16} className="text-cyan-500" />
                          <span className="text-[10px] font-black uppercase">SpO2</span>
                        </div>
                        <p className="text-xl font-black text-navyBlue-900 dark:text-white">
                          {selectedPatient.vitals?.o2 || "98%"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                  <div className="p-5 rounded-[24px] bg-royalBlue/5 border border-royalBlue/20">
                    <h3 className="text-xs font-black uppercase tracking-widest text-royalBlue mb-2">Current Diagnosis / Condition</h3>
                    <p className="text-lg font-bold text-navyBlue-900 dark:text-white">{selectedPatient.condition || "Undiagnosed"}</p>
                  </div>
                  
                  <div className="p-8 text-center rounded-[24px] border border-dashed border-navyBlue-200 dark:border-navyBlue-800">
                    <h3 className="text-navyBlue-500 dark:text-navyBlue-400 font-bold">Additional Medical Records</h3>
                    <p className="text-sm text-navyBlue-400 dark:text-navyBlue-500 mt-2">Appointments, Prescriptions, and full History are managed in their respective dedicated modules.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      , document.body)}

      {/* Add/Edit Modal */}
      {isModalOpen && createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999999, display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: 'rgba(7,27,52,0.75)', backdropFilter: 'blur(6px)' }} onClick={() => setIsModalOpen(false)}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '600px', backgroundColor: '#0d1623', borderRadius: '24px', padding: '32px', boxShadow: '0 25px 60px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)' }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-white">{editingPatient ? "Edit Patient" : "Add New Patient"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-navyBlue-400 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
              {!editingPatient && (
                <>
                  <div><label className="block text-xs font-bold text-navyBlue-300 uppercase tracking-wider mb-2">Full Name</label><input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-navyBlue-950/50 border border-navyBlue-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-royalBlue" /></div>
                  <div><label className="block text-xs font-bold text-navyBlue-300 uppercase tracking-wider mb-2">Email Address</label><input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-navyBlue-950/50 border border-navyBlue-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-royalBlue" /></div>
                  <div><label className="block text-xs font-bold text-navyBlue-300 uppercase tracking-wider mb-2">Password</label><input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-navyBlue-950/50 border border-navyBlue-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-royalBlue" /></div>
                </>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-navyBlue-300 uppercase tracking-wider mb-2">Age</label><input type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full bg-navyBlue-950/50 border border-navyBlue-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-royalBlue" /></div>
                <div><label className="block text-xs font-bold text-navyBlue-300 uppercase tracking-wider mb-2">Gender</label><select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full bg-navyBlue-950/50 border border-navyBlue-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-royalBlue"><option>Male</option><option>Female</option></select></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-navyBlue-300 uppercase tracking-wider mb-2">Blood Group</label><select value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value})} className="w-full bg-navyBlue-950/50 border border-navyBlue-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-royalBlue"><option>O+</option><option>O-</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option></select></div>
                <div><label className="block text-xs font-bold text-navyBlue-300 uppercase tracking-wider mb-2">Phone</label><input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-navyBlue-950/50 border border-navyBlue-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-royalBlue" /></div>
              </div>

              <div><label className="block text-xs font-bold text-navyBlue-300 uppercase tracking-wider mb-2">Address</label><input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-navyBlue-950/50 border border-navyBlue-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-royalBlue" /></div>

              <div className="my-4 border-t border-navyBlue-800 pt-4"><h3 className="text-sm font-bold text-royalBlue uppercase">Medical Info</h3></div>

              <div><label className="block text-xs font-bold text-navyBlue-300 uppercase tracking-wider mb-2">Condition / Diagnosis</label><input type="text" value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})} className="w-full bg-navyBlue-950/50 border border-navyBlue-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-royalBlue" /></div>

              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-navyBlue-300 uppercase tracking-wider mb-2">Status</label><select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-navyBlue-950/50 border border-navyBlue-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-royalBlue"><option>Stable</option><option>Recovering</option><option>Critical</option></select></div>
                <div><label className="block text-xs font-bold text-navyBlue-300 uppercase tracking-wider mb-2">Assigned Room</label><input type="text" value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})} className="w-full bg-navyBlue-950/50 border border-navyBlue-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-royalBlue" placeholder="e.g. Ward A - 101" /></div>
              </div>

              <div><label className="block text-xs font-bold text-navyBlue-300 uppercase tracking-wider mb-2">Assigned Doctor</label>
                <select value={formData.assignedDoctor} onChange={e => setFormData({...formData, assignedDoctor: e.target.value})} className="w-full bg-navyBlue-950/50 border border-navyBlue-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-royalBlue">
                  <option value="">-- No Assigned Doctor --</option>
                  {doctors.map(doc => <option key={doc._id} value={doc._id}>{doc.user?.name || doc.name} ({doc.specialization})</option>)}
                </select>
              </div>

              <div className="pt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-navyBlue-300 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="btn-primary px-8 py-3 rounded-xl font-bold shadow-lg shadow-royalBlue/30">{editingPatient ? "Save Changes" : "Create Patient"}</button>
              </div>
            </form>
          </div>
        </div>
      , document.body)}
    </motion.div>
  );
}
