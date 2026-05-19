import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/Avatar";
import { 
  Search, Calendar, Clock, UserRound, Stethoscope, X, Edit, Trash2, Plus, CheckCircle, XCircle,
  ShieldCheck, Download, Users, Activity
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

export default function Appointments() {
  const { user } = useAuth();
  const role = user?.role || "Admin";
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [formData, setFormData] = useState({
    patient: "", doctor: "", scheduledDate: "", scheduledTime: "", status: "Scheduled", notes: "",
    amountCollected: "", paymentMethod: "Cash"
  });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchDoctors();
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

  const handleOpenModal = (appt = null) => {
    if (appt) {
      setEditingAppointment(appt);
      const apptDate = new Date(appt.scheduledAt);
      const dateStr = apptDate.toISOString().slice(0, 10); // YYYY-MM-DD
      const timeStr = apptDate.toTimeString().slice(0, 5); // HH:MM
      setFormData({
        patient: appt.patient?._id || "",
        doctor: appt.doctor?._id || "",
        scheduledDate: dateStr,
        scheduledTime: timeStr,
        status: appt.status || "Scheduled",
        notes: appt.notes || "",
        amountCollected: "",
        paymentMethod: "Cash"
      });
    } else {
      setEditingAppointment(null);
      setFormData({
        patient: role === "Patient" ? (patients[0]?._id || "") : "",
        doctor: "",
        scheduledDate: "",
        scheduledTime: "",
        status: "Scheduled",
        notes: "",
        amountCollected: "",
        paymentMethod: "Cash"
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const scheduledAt = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`).toISOString();
      const payload = {
        patient: formData.patient,
        doctor: formData.doctor,
        scheduledAt,
        status: formData.status,
        notes: formData.notes,
        amountCollected: formData.amountCollected,
        paymentMethod: formData.paymentMethod
      };

      if (editingAppointment) {
        await api.put(`/appointments/${editingAppointment._id}`, payload);
      } else {
        await api.post("/appointments", payload);
      }
      setIsModalOpen(false);
      fetchAppointments();
    } catch (error) {
      alert("Error saving appointment: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    setConfirmDeleteId(id);
  };

  const doDelete = async () => {
    const id = confirmDeleteId;
    setConfirmDeleteId(null);
    try {
      await api.delete(`/appointments/${id}`);
      fetchAppointments();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting appointment: " + (error.response?.data?.message || error.message));
    }
  };

  const handleExport = () => {
    if (!appointments.length) return alert("No data to export");
    const headers = ["Scheduled At", "Patient Name", "Doctor Name", "Doctor Specialty", "Status", "Notes"].join(",");
    const csv = appointments.map(appt => 
      [
        JSON.stringify(appt.scheduledAt || ""),
        JSON.stringify(appt.patient?.user?.name || appt.patient?.name || ""),
        JSON.stringify(appt.doctor?.user?.name || appt.doctor?.name || ""),
        JSON.stringify(appt.doctor?.specialization || ""),
        JSON.stringify(appt.status || ""),
        JSON.stringify(appt.notes || "")
      ].join(",")
    ).join("\n");
    const blob = new Blob([`${headers}\n${csv}`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `appointments-export.csv`;
    a.click();
  };

  const filteredAppointments = appointments.filter(a => {
    const pName = a.patient?.name || a.patient?.user?.name || "";
    const dName = a.doctor?.name || a.doctor?.user?.name || "";
    const matchesSearch = pName.toLowerCase().includes(searchTerm.toLowerCase()) || dName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || a.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const renderStatusBadge = (status) => {
    switch(status) {
      case "Scheduled": return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-royalBlue/20 text-royalBlue border border-royalBlue/30 shadow-sm">Scheduled</span>;
      case "Completed": return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 shadow-sm"><CheckCircle size={12} className="mr-1"/> Completed</span>;
      case "Cancelled": return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-500 border border-red-500/30 shadow-sm"><XCircle size={12} className="mr-1"/> Cancelled</span>;
      default: return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 shadow-sm">{status}</span>;
    }
  };

  const stats = [
    { label: "Total Booked", value: appointments.length.toString(), change: "All appointments", icon: Calendar },
    { label: "Scheduled", value: appointments.filter(a => a.status === 'Scheduled').length.toString(), change: "Active bookings", icon: Activity },
    { label: "Completed", value: appointments.filter(a => a.status === 'Completed').length.toString(), change: "Successful visits", icon: Users },
    { label: "Cancelled", value: appointments.filter(a => a.status === 'Cancelled').length.toString(), change: "Cancelled visits", icon: ShieldCheck },
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
              <ShieldCheck size={16} /> Appointments Management
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter mb-4 sm:mb-6">
              Appointments
            </h1>
            <p className="text-royalBlue-200/80 text-base sm:text-xl leading-relaxed max-w-xl">
              Bookings, confirmations, and queue management.
            </p>
            <div className="mt-6 sm:mt-10 flex flex-wrap gap-3 sm:gap-4">
              {(role === "Receptionist" || role === "Patient") && (
                <button onClick={() => handleOpenModal()} className="btn-primary px-6 sm:px-8 group">
                  <Plus size={20} className="transition-transform group-hover:rotate-90" /> {role === "Patient" ? "Book Appointment" : "New Booking"}
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
            Appointment Records
          </h2>
          <p className="mt-1 text-sm font-medium text-royalBlue-500 dark:text-royalBlue-400">
            {filteredAppointments.length} total entries identified in the database.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 relative">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-royalBlue-400 group-focus-within:text-royalBlue transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search patient or doctor..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 rounded-2xl border border-navyBlue-100 bg-white pl-10 pr-4 py-3 text-sm font-bold text-navyBlue-900 outline-none transition-all focus:border-royalBlue placeholder:text-royalBlue-300 dark:border-navyBlue-800 dark:bg-navyBlue-900/40 dark:text-white shadow-md shadow-navyBlue-200/5"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 rounded-2xl border border-navyBlue-100 bg-white p-1 backdrop-blur-md dark:border-navyBlue-800 dark:bg-navyBlue-900/40 shadow-md">
            {["All", "Scheduled", "Completed", "Cancelled"].map(status => (
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

      <div className="table-container shadow-2xl relative">
        <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
          <table className="w-full text-left text-sm">
            <thead className="bg-navyBlue-50/80 backdrop-blur-xl sticky top-0 z-10 border-b border-navyBlue-100 dark:bg-navyBlue-900/80 dark:border-navyBlue-800 text-[10px] font-black uppercase tracking-[0.2em] text-navyBlue-500 dark:text-navyBlue-300 shadow-sm">
              <tr>
                <th className="px-6 py-5">Date & Time</th>
                <th className="px-6 py-5">Patient Details</th>
                <th className="px-6 py-5">Doctor Assigned</th>
                <th className="px-6 py-5">Status</th>
                {(role === "Receptionist" || role === "Admin") && <th className="px-6 py-5 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-navyBlue-50 dark:divide-navyBlue-800/50">
                {filteredAppointments.map((appt) => (
                  <tr key={appt._id} className="group transition-all duration-300 hover:bg-navyBlue-50/80 dark:hover:bg-navyBlue-800/30">
                    <td className="px-6 py-5">
                      <div className="text-sm font-black text-navyBlue-900 dark:text-white flex items-center gap-2">
                        <Calendar size={14} className="text-royalBlue" />
                        {new Date(appt.scheduledAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs font-medium text-navyBlue-500 flex items-center gap-2 mt-1">
                        <Clock size={14} className="text-navyBlue-400" />
                        {new Date(appt.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm font-bold text-navyBlue-900 dark:text-white flex items-center gap-1.5">
                        <UserRound size={14} className="text-navyBlue-400" /> {appt.patient?.user?.name || appt.patient?.name || "Unknown"}
                      </div>
                      <div className="text-xs font-medium text-navyBlue-500 mt-1">ID: {appt.patient?._id?.slice(-6).toUpperCase()}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm font-bold text-navyBlue-900 dark:text-white flex items-center gap-1.5">
                        <Stethoscope size={14} className="text-royalBlue" /> {appt.doctor?.user?.name || appt.doctor?.name || "Unknown"}
                      </div>
                      <div className="text-xs font-medium text-navyBlue-500 mt-1">{appt.doctor?.specialization}</div>
                    </td>
                    <td className="px-6 py-5">
                      {renderStatusBadge(appt.status)}
                    </td>
                    {(role === "Receptionist" || role === "Admin") && (
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={(e) => { e.stopPropagation(); handleOpenModal(appt); }} className="p-2 text-navyBlue-500 hover:text-royalBlue hover:bg-royalBlue/10 rounded-lg transition-colors" title="Edit Appointment">
                            <Edit size={16} />
                          </button>
                          <button onClick={(e) => handleDelete(e, appt._id)} className="p-2 text-navyBlue-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete Appointment">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
          
          {filteredAppointments.length === 0 && (
            <div className="p-20 text-center flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-3xl bg-navyBlue-50 dark:bg-navyBlue-800/50 flex items-center justify-center mb-6 text-navyBlue-300">
                <Calendar size={32} />
              </div>
              <h3 className="text-2xl font-black text-navyBlue-900 dark:text-white mb-2">No appointments found</h3>
              <p className="text-navyBlue-500 font-medium">
                {role === "Patient"
                  ? "Your scheduled appointments will appear here. Contact the receptionist desk to book a new appointment."
                  : "Create a new booking or adjust your filters."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Delete Modal */}
      {confirmDeleteId && createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: 'rgba(7,27,52,0.85)', backdropFilter: 'blur(8px)' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '420px', backgroundColor: '#0d1623', borderRadius: '24px', padding: '32px', boxShadow: '0 25px 60px rgba(0,0,0,0.6)', border: '1px solid rgba(239,68,68,0.3)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Trash2 size={28} color="#ef4444" />
            </div>
            <h2 style={{ color: 'white', fontWeight: 900, fontSize: '1.25rem', textAlign: 'center', marginBottom: '8px' }}>Delete Appointment?</h2>
            <p style={{ color: '#8ca8cc', fontSize: '0.875rem', textAlign: 'center', marginBottom: '28px' }}>This action cannot be undone. The appointment will be permanently removed.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setConfirmDeleteId(null)} style={{ flex: 1, padding: '12px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'transparent', color: '#8ca8cc', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>
                Cancel
              </button>
              <button onClick={doDelete} style={{ flex: 1, padding: '12px', borderRadius: '14px', border: 'none', backgroundColor: '#ef4444', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {isModalOpen && createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: 'rgba(7,27,52,0.75)', backdropFilter: 'blur(6px)' }} onClick={() => setIsModalOpen(false)}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '500px', backgroundColor: '#0d1623', borderRadius: '24px', padding: '32px', boxShadow: '0 25px 60px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)' }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-white">{editingAppointment ? "Edit Appointment" : "New Appointment"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-navyBlue-400 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {role === "Patient" ? (
                <div>
                  <label className="block text-xs font-bold text-navyBlue-300 uppercase tracking-wider mb-2">Patient Name</label>
                  <input
                    type="text"
                    disabled
                    value={user?.name || ""}
                    className="w-full bg-navyBlue-950/30 border border-navyBlue-800/50 rounded-xl px-4 py-3 text-navyBlue-400 cursor-not-allowed focus:outline-none"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-navyBlue-300 uppercase tracking-wider mb-2">Select Patient</label>
                  <select
                    required
                    value={formData.patient}
                    onChange={e => setFormData({...formData, patient: e.target.value})}
                    className="w-full bg-navyBlue-950/50 border border-navyBlue-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-royalBlue"
                  >
                    <option value="">-- Choose Patient --</option>
                    {patients.map(p => <option key={p._id} value={p._id}>{p.user?.name || p.name}</option>)}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-navyBlue-300 uppercase tracking-wider mb-2">Select Doctor</label>
                <select
                  required
                  value={formData.doctor}
                  onChange={e => setFormData({...formData, doctor: e.target.value})}
                  className="w-full bg-navyBlue-950/50 border border-navyBlue-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-royalBlue"
                >
                  <option value="">-- Choose Doctor --</option>
                  {doctors.map(d => <option key={d._id} value={d._id}>{d.user?.name || d.name} ({d.specialization})</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navyBlue-300 uppercase tracking-wider mb-2">Scheduled Date</label>
                  <input
                    type="date"
                    required
                    value={formData.scheduledDate}
                    onChange={e => setFormData({...formData, scheduledDate: e.target.value})}
                    className="w-full bg-navyBlue-950/50 border border-navyBlue-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-royalBlue [&::-webkit-calendar-picker-indicator]:invert"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navyBlue-300 uppercase tracking-wider mb-2">Scheduled Time</label>
                  <input
                    type="time"
                    required
                    value={formData.scheduledTime}
                    onChange={e => setFormData({...formData, scheduledTime: e.target.value})}
                    className="w-full bg-navyBlue-950/50 border border-navyBlue-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-royalBlue [&::-webkit-calendar-picker-indicator]:invert"
                  />
                </div>
              </div>

              {role !== "Patient" && (
                <div>
                  <label className="block text-xs font-bold text-navyBlue-300 uppercase tracking-wider mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                    className="w-full bg-navyBlue-950/50 border border-navyBlue-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-royalBlue"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              )}

              {!editingAppointment && role !== "Patient" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-navyBlue-300 uppercase tracking-wider mb-2">Booking Fee ($)</label>
                    <input
                      type="number"
                      placeholder="e.g. 50"
                      value={formData.amountCollected}
                      onChange={e => setFormData({...formData, amountCollected: e.target.value})}
                      className="w-full bg-navyBlue-950/50 border border-navyBlue-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-royalBlue"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-navyBlue-300 uppercase tracking-wider mb-2">Payment Method</label>
                    <select
                      value={formData.paymentMethod}
                      onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
                      className="w-full bg-navyBlue-950/50 border border-navyBlue-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-royalBlue [&>option]:bg-navyBlue-900"
                    >
                      <option value="Cash">Cash</option>
                      <option value="Card">Card</option>
                      <option value="Mobile Money">Mobile Money</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-navyBlue-300 uppercase tracking-wider mb-2">Additional Notes</label>
                <textarea rows="3" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full bg-navyBlue-950/50 border border-navyBlue-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-royalBlue" placeholder="Reason for visit..."></textarea>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-navyBlue-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-navyBlue-300 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="btn-primary px-8 py-3 rounded-xl font-bold shadow-lg shadow-royalBlue/30">{editingAppointment ? "Save Changes" : "Book Appointment"}</button>
              </div>
            </form>
          </div>
        </div>
      , document.body)}
    </motion.div>
  );
}
