import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/Avatar";
import { 
  Search, UserRound, FileText, X, Stethoscope, PhoneCall, Mail, Edit, Trash2, Plus, 
  ShieldCheck, Calendar, Download, Users, Activity
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

export default function Doctors() {
  const { user } = useAuth();
  const role = user?.role || "Admin";
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", specialization: "General Medicine", phone: ""
  });

  useEffect(() => {
    fetchDoctors();
    fetchPatients();
    fetchAppointments();
  }, []);

  const fetchPatients = async () => {
    try {
      const { data } = await api.get("/patients");
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get("/appointments");
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
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

  const handleOpenModal = (doctor = null) => {
    if (doctor) {
      setEditingDoctor(doctor);
      setFormData({
        name: doctor.user?.name || doctor.name,
        email: doctor.user?.email || "",
        password: "", // Leave blank on edit
        specialization: doctor.specialization || "General Medicine",
        phone: doctor.phone || ""
      });
    } else {
      setEditingDoctor(null);
      setFormData({
        name: "", email: "", password: "", specialization: "General Medicine", phone: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDoctor) {
        await api.put(`/doctors/${editingDoctor._id}`, formData);
      } else {
        await api.post("/doctors", formData);
      }
      setIsModalOpen(false);
      fetchDoctors();
    } catch (error) {
      alert("Error saving doctor: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      try {
        await api.delete(`/doctors/${id}`);
        fetchDoctors();
      } catch (error) {
        alert("Error deleting doctor: " + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleExport = () => {
    if (!doctors.length) return alert("No data to export");
    const headers = ["Name", "Email", "Specialization", "Phone"].join(",");
    const csv = doctors.map(doc => 
      [
        JSON.stringify(doc.user?.name || doc.name || ""),
        JSON.stringify(doc.user?.email || ""),
        JSON.stringify(doc.specialization || ""),
        JSON.stringify(doc.phone || "")
      ].join(",")
    ).join("\n");
    const blob = new Blob([`${headers}\n${csv}`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `doctors-export.csv`;
    a.click();
  };

  const filteredDoctors = doctors.filter(d => {
    const dName = d.user?.name || d.name || "";
    const dSpec = d.specialization || "";
    return dName.toLowerCase().includes(searchTerm.toLowerCase()) || dSpec.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const stats = [
    { label: "On duty", value: doctors.length.toString(), change: "Specialists", icon: Stethoscope },
    { label: "Consults", value: appointments.length.toString(), change: "Total bookings", icon: Users },
    { label: "Rounds", value: patients.filter(p => p.assignedDoctor).length.toString(), change: "Assigned Patients", icon: Calendar },
    { label: "Escalations", value: patients.filter(p => p.status === "Critical").length.toString(), change: "Critical Status", icon: ShieldCheck },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[28px] sm:rounded-[40px] lg:rounded-[48px] bg-royalBlue-950 p-6 sm:p-10 md:p-16 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-royalBlue/20 to-transparent blur-3xl opacity-50" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-royalYellow/10 rounded-full blur-[100px]" />
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-8 lg:gap-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-white/10 border border-white/20 text-royalYellow text-[10px] font-black uppercase tracking-[0.3em] mb-6 sm:mb-8 backdrop-blur-md">
              <ShieldCheck size={16} /> Doctors Management
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter mb-4 sm:mb-6">
              Doctors
            </h1>
            <p className="text-royalBlue-200/80 text-base sm:text-xl leading-relaxed max-w-xl">
              Clinical coverage, specialist load, and consultation flow.
            </p>
            <div className="mt-6 sm:mt-10 flex flex-wrap gap-3 sm:gap-4">
              {role === "Admin" && (
                <button onClick={() => handleOpenModal()} className="btn-primary px-8 group">
                  <Plus size={20} className="transition-transform group-hover:rotate-90" /> Add New Doctor
                </button>
              )}
              <button onClick={handleExport} className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all backdrop-blur-md">
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
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-royalBlue-900 dark:text-white">
            Medical Staff Records
          </h2>
          <p className="mt-1 text-sm font-medium text-royalBlue-500 dark:text-royalBlue-400">
            {filteredDoctors.length} doctors currently in system directory.
          </p>
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-royalBlue-400 group-focus-within:text-royalBlue transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search doctors or specialties..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-80 rounded-2xl border border-navyBlue-100 bg-white pl-10 pr-4 py-3.5 text-sm font-bold text-navyBlue-900 outline-none transition-all focus:border-royalBlue placeholder:text-royalBlue-300 dark:border-navyBlue-800 dark:bg-navyBlue-900/40 dark:text-white shadow-md shadow-navyBlue-200/5"
          />
        </div>
      </div>

      {/* Grid of Doctors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDoctors.map((doc) => (
          <div key={doc._id} onClick={() => setSelectedDoctor(doc)} className="panel p-6 cursor-pointer hover:border-royalBlue/50 transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-royalBlue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {role === "Admin" && (
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-50">
                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleOpenModal(doc); }} className="p-2 text-navyBlue-400 hover:text-white hover:bg-royalBlue rounded-lg transition-colors bg-white/5 backdrop-blur-md pointer-events-auto">
                  <Edit size={14} />
                </button>
                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(doc._id); }} className="p-2 text-navyBlue-400 hover:text-white hover:bg-red-500 rounded-lg transition-colors bg-white/5 backdrop-blur-md pointer-events-auto">
                  <Trash2 size={14} />
                </button>
              </div>
            )}

            <div className="flex flex-col items-center text-center relative z-10">
              <div className="mb-4 relative">
                {doc.user?.profileImage ? (
                  <img src={doc.user.profileImage} alt={doc.user.name} className="w-24 h-24 rounded-full object-cover border-4 border-navyBlue-50 dark:border-navyBlue-800 shadow-xl group-hover:border-royalBlue transition-colors" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-royalBlue to-cyan-500 flex items-center justify-center text-white font-black text-3xl shadow-xl border-4 border-navyBlue-50 dark:border-navyBlue-800">
                    {(doc.user?.name || doc.name || "?").charAt(0)}
                  </div>
                )}
                <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white dark:border-navyBlue-900 ${doc.user?.status === 'Active' ? 'bg-emerald-500' : 'bg-emerald-500'}`} />
              </div>
              
              <h3 className="text-xl font-black text-navyBlue-900 dark:text-white mb-1 group-hover:text-royalBlue transition-colors">
                {doc.user?.name || doc.name}
              </h3>
              <p className="text-sm font-bold text-royalBlue mb-4 flex items-center gap-1">
                <Stethoscope size={14} /> {doc.specialization}
              </p>
              
              <div className="w-full flex justify-center gap-4 pt-4 border-t border-navyBlue-50 dark:border-navyBlue-800/50">
                <a href={`tel:${doc.phone}`} onClick={e => e.stopPropagation()} className="p-2.5 rounded-xl bg-navyBlue-50 dark:bg-navyBlue-800/50 text-navyBlue-500 hover:bg-royalBlue hover:text-white transition-colors">
                  <PhoneCall size={16} />
                </a>
                <a href={`mailto:${doc.user?.email}`} onClick={e => e.stopPropagation()} className="p-2.5 rounded-xl bg-navyBlue-50 dark:bg-navyBlue-800/50 text-navyBlue-500 hover:bg-royalBlue hover:text-white transition-colors">
                  <Mail size={16} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredDoctors.length === 0 && (
        <div className="p-20 text-center flex flex-col items-center justify-center panel border-dashed border-2">
          <div className="w-20 h-20 rounded-3xl bg-navyBlue-50 dark:bg-navyBlue-800/50 flex items-center justify-center mb-6 text-navyBlue-300">
            <Stethoscope size={32} />
          </div>
          <h3 className="text-2xl font-black text-navyBlue-900 dark:text-white mb-2">No doctors found</h3>
          <p className="text-navyBlue-500 font-medium">Add a new doctor to the directory.</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: 'rgba(7,27,52,0.75)', backdropFilter: 'blur(6px)' }} onClick={() => setIsModalOpen(false)}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '600px', backgroundColor: '#0d1623', borderRadius: '24px', padding: '32px', boxShadow: '0 25px 60px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)' }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-white">{editingDoctor ? "Edit Doctor" : "Add New Doctor"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-navyBlue-400 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
              {!editingDoctor && (
                <>
                  <div><label className="block text-xs font-bold text-navyBlue-300 uppercase tracking-wider mb-2">Full Name</label><input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-navyBlue-950/50 border border-navyBlue-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-royalBlue" /></div>
                  <div><label className="block text-xs font-bold text-navyBlue-300 uppercase tracking-wider mb-2">Email Address</label><input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-navyBlue-950/50 border border-navyBlue-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-royalBlue" /></div>
                  <div><label className="block text-xs font-bold text-navyBlue-300 uppercase tracking-wider mb-2">Password</label><input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-navyBlue-950/50 border border-navyBlue-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-royalBlue" /></div>
                </>
              )}

              <div><label className="block text-xs font-bold text-navyBlue-300 uppercase tracking-wider mb-2">Specialization</label>
                <select value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} className="w-full bg-navyBlue-950/50 border border-navyBlue-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-royalBlue">
                  <option>General Medicine</option>
                  <option>Cardiology</option>
                  <option>Neurology</option>
                  <option>Pediatrics</option>
                  <option>Orthopedics</option>
                  <option>Surgery</option>
                  <option>Emergency Medicine</option>
                </select>
              </div>

              <div><label className="block text-xs font-bold text-navyBlue-300 uppercase tracking-wider mb-2">Phone</label><input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-navyBlue-950/50 border border-navyBlue-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-royalBlue" /></div>

              <div className="pt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-navyBlue-300 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="btn-primary px-8 py-3 rounded-xl font-bold shadow-lg shadow-royalBlue/30">{editingDoctor ? "Save Changes" : "Create Doctor"}</button>
              </div>
            </form>
          </div>
        </div>
      , document.body)}
    </motion.div>
  );
}
