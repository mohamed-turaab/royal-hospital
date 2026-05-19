import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/Avatar";
import { rolePath, sectionConfig } from "../config/roles";
import api from "../services/api";
import { 
  ArrowUpRight, 
  ShieldCheck, 
  Search, 
  Plus, 
  MoreVertical, 
  Filter,
  Download,
  X,
  Edit,
  Trash2,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function SectionPage() {
  const { section } = useParams();
  const { user } = useAuth();
  const role = user?.role || "Admin";
  const config = sectionConfig[section];
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // CRUD States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  const endpointMap = {
    patients: "/patients",
    doctors: "/doctors",
    appointments: "/appointments",
    prescriptions: "/prescriptions",
    nurses: "/auth/users?role=Nurse",
    pharmacy: "/auth/users?role=Pharmacist",
    billing: "/auth/users?role=Accountant",
  };

  const fetchData = () => {
    setLoading(true);
    const endpoint = endpointMap[section];
    if (endpoint) {
      api.get(endpoint)
        .then(res => setData(Array.isArray(res.data) ? res.data : []))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    setStatusFilter("All");
    setShowFilterDropdown(false);
    fetchData();
  }, [section]);

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({ ...item });
    } else {
      setEditingItem(null);
      setFormData({});
    }
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const endpoint = endpointMap[section];
      const basePath = endpoint.split('?')[0];
      
      const saveFormData = { ...formData };
      if (!editingItem) {
        if (section === "nurses") saveFormData.role = "Nurse";
        if (section === "pharmacy") saveFormData.role = "Pharmacist";
        if (section === "billing") saveFormData.role = "Accountant";
      }

      if (editingItem) {
        await api.put(`${basePath}/${editingItem._id || editingItem.id}`, saveFormData);
      } else {
        await api.post(basePath, saveFormData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete this ${config.title.slice(0, -1)}?`)) {
      try {
        const basePath = endpointMap[section].split('?')[0];
        await api.delete(`${basePath}/${id}`);
        fetchData();
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || "Deletion failed");
      }
    }
  };

  const handleExport = () => {
    if (!data.length) return alert("No data to export");
    const headers = Object.keys(data[0]).filter(k => typeof data[0][k] !== 'object').join(",");
    const csv = data.map(row => 
      Object.keys(data[0])
      .filter(k => typeof row[k] !== 'object')
      .map(k => JSON.stringify(row[k] || ""))
      .join(",")
    ).join("\n");
    const blob = new Blob([`${headers}\n${csv}`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${section}-export.csv`;
    a.click();
  };

  if (!config) return <Navigate to={rolePath(role)} replace />;

  const uniqueStatuses = ["All", ...new Set(data.map(item => item.status || "Active"))];

  const filteredData = data.filter(item => {
    const matchesSearch = (item.name || item.title || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (item.specialization || item.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || (item.status || "Active") === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 sm:space-y-12 animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[28px] sm:rounded-[40px] lg:rounded-[48px] bg-royalBlue-950 p-6 sm:p-10 md:p-16 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-royalBlue/20 to-transparent blur-3xl opacity-50" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-royalYellow/10 rounded-full blur-[100px]" />
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-8 lg:gap-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-white/10 border border-white/20 text-royalYellow text-[10px] font-black uppercase tracking-[0.3em] mb-6 sm:mb-8 backdrop-blur-md">
              <ShieldCheck size={16} /> {config.title} Management
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter mb-4 sm:mb-6">
              {config.title}
            </h1>
            <p className="text-royalBlue-200/80 text-base sm:text-xl leading-relaxed max-w-xl">
              {config.subtitle}
            </p>
            <div className="mt-6 sm:mt-10 flex flex-wrap gap-3 sm:gap-4">
              {role === "Admin" && endpointMap[section] && (
                <button onClick={() => openModal()} className="btn-primary px-8 group">
                  <Plus size={20} className="transition-transform group-hover:rotate-90" /> Add New {config.title.endsWith('s') ? config.title.slice(0, -1) : config.title}
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
        {config.stats.map((item, index) => (
          <StatCard key={item.label} item={item} index={index} />
        ))}
      </div>

      {/* Data Table Section */}
      <section className="table-container" style={{ overflow: "visible" }}>
        <div className="flex flex-col gap-6 border-b border-royalBlue-100 p-10 sm:flex-row sm:items-center sm:justify-between dark:border-royalBlue-800">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-royalBlue-900 dark:text-white">
              {config.title} Records
            </h2>
            <p className="mt-1 text-sm font-medium text-royalBlue-500 dark:text-royalBlue-400">
              {data.length} total entries identified in the database.
            </p>
          </div>
          <div className="flex items-center gap-4 relative">
            <div className="flex items-center gap-3 rounded-2xl border border-royalBlue-100 bg-royalBlue-50 px-5 py-3 dark:border-royalBlue-800 dark:bg-royalBlue-900/50 min-w-[300px]">
              <Search size={20} className="text-royalBlue-400" />
              <input
                type="text"
                placeholder={`Search ${config.title.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent text-sm font-bold text-royalBlue-900 outline-none placeholder:text-royalBlue-300 dark:text-white"
              />
            </div>
            <button 
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className={`p-3.5 rounded-2xl transition-all relative ${
                statusFilter !== "All"
                  ? "bg-royalBlue text-white shadow-lg shadow-royalBlue/20"
                  : "bg-royalBlue-50 text-royalBlue-500 hover:bg-royalBlue-100 dark:bg-royalBlue-900/50 dark:hover:bg-royalBlue-800"
              }`}
            >
              <Filter size={20} />
              {statusFilter !== "All" && (
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-royalYellow border border-white dark:border-navyBlue-950" />
              )}
            </button>

            {showFilterDropdown && (
              <>
                <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setShowFilterDropdown(false)} />
                <div className="absolute right-0 top-16 z-50 w-56 overflow-hidden rounded-2xl border border-navyBlue-100 dark:border-white/10 bg-white dark:bg-navyBlue-900 shadow-2xl p-2 backdrop-blur-xl">
                  <div className="px-4 py-2 text-[10px] font-black text-navyBlue-400 dark:text-royalBlue-300 uppercase tracking-widest border-b border-navyBlue-50 dark:border-white/5 mb-1">
                    Filter by Status
                  </div>
                  {uniqueStatuses.map(status => (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status);
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                        statusFilter === status
                          ? "bg-royalBlue text-white shadow-md shadow-royalBlue/10"
                          : "text-navyBlue-900 dark:text-white hover:bg-navyBlue-50 dark:hover:bg-white/10"
                      }`}
                    >
                      <span>{status}</span>
                      {statusFilter === status && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center space-y-4">
              <div className="h-12 w-12 border-4 border-royalBlue border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-royalBlue-400 font-bold uppercase tracking-widest text-xs">Loading Secure Data...</p>
            </div>
          ) : data.length > 0 ? (
            <>
              {/* Only show Table & Search if this section supports data fetching */}
              {endpointMap[section] && (
                <div className="table-container shadow-2xl relative">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-navyBlue-50/80 backdrop-blur-xl sticky top-0 z-10 border-b border-navyBlue-100 dark:bg-navyBlue-900/80 dark:border-navyBlue-800 text-[10px] font-black uppercase tracking-[0.2em] text-navyBlue-500 dark:text-navyBlue-300 shadow-sm">
                      <tr>
                        <th className="px-10 py-6">ID / Ref</th>
                        <th className="px-10 py-6">Name / Details</th>
                        <th className="px-10 py-6">Role / Type</th>
                        <th className="px-10 py-6">Status</th>
                        <th className="px-10 py-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navyBlue-50 dark:divide-navyBlue-800/50">
                      {filteredData.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-10 py-12 text-center text-navyBlue-400 dark:text-royalBlue-300">
                            No records found matching your criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredData.map((item, idx) => (
                          <motion.tr
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            key={item._id || item.id}
                            className="group cursor-pointer transition-all duration-300 hover:bg-navyBlue-50/80 dark:hover:bg-navyBlue-800/30 hover:shadow-inner border-b border-navyBlue-50 dark:border-navyBlue-800/20"
                          >
                            <td className="px-10 py-6">
                              <span className="font-mono text-xs font-bold text-navyBlue-500 dark:text-royalBlue-300">
                                #{String(item._id || item.id).slice(-6)}
                              </span>
                            </td>
                            <td className="px-10 py-6">
                              <div className="flex items-center gap-4">
                                <Avatar
                                  src={item.profileImage || item.image}
                                  name={item.patientName || item.patient?.name || item.name || item.title}
                                  size="h-12 w-12 rounded-2xl ring-2 ring-royalBlue-200"
                                />
                                <div>
                                  <div className="font-black text-base text-navyBlue-900 dark:text-white group-hover:text-royalBlue transition-colors">
                                    {item.patientName || item.patient?.name || item.name || item.title || "N/A"}
                                  </div>
                                  <div className="text-xs font-medium text-navyBlue-500 dark:text-royalBlue-200/70 mt-0.5">
                                    {item.email || item.specialization || (item.medicines && item.medicines.length > 0 ? item.medicines.map(m => `${m.name} (${m.dosage})`).join(', ') : null) || item.type || "N/A"}
                                    {item.phone && ` • Phone: ${item.phone}`}
                                    {item.gender && ` • Gender: ${item.gender}`}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-10 py-6">
                              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-royalBlue/10 text-royalBlue border border-royalBlue/20 dark:bg-royalBlue/20 dark:text-royalBlue-300 dark:border-royalBlue-700/50 shadow-sm uppercase tracking-wider">
                                {item.role || item.type || section.slice(0, -1)}
                              </span>
                            </td>
                            <td className="px-10 py-6">
                              <div className="flex items-center gap-2">
                                <div className={`h-2.5 w-2.5 rounded-full ${item.status === 'Active' || item.status === 'Available' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-navyBlue-400 dark:bg-royalBlue-400'}`} />
                                <span className="text-xs font-bold text-navyBlue-700 dark:text-navyBlue-300">
                                  {item.status || "Active"}
                                </span>
                              </div>
                            </td>
                            <td className="px-10 py-6 text-right">
                              {role === "Admin" && (
                                <div className="flex items-center justify-end gap-3">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); openModal(item); }}
                                    className="p-2.5 rounded-xl text-navyBlue-400 dark:text-royalBlue-400 transition-all hover:bg-royalBlue/10 hover:text-royalBlue dark:hover:bg-royalBlue/20 dark:hover:text-royalBlue-300"
                                    title={`Edit ${config.title.endsWith('s') ? config.title.slice(0, -1) : config.title}`}
                                  >
                                    <Edit size={18} />
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(item._id || item.id); }}
                                    className="p-2.5 rounded-xl text-navyBlue-400 dark:text-royalBlue-400 transition-all hover:bg-red-500/10 hover:text-red-500 dark:hover:bg-red-500/20 dark:hover:text-red-400"
                                    title={`Delete ${config.title.endsWith('s') ? config.title.slice(0, -1) : config.title}`}
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              )}
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : (
            <div className="px-10 py-20 text-center">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[32px] bg-royalBlue-50 dark:bg-royalBlue-900/30">
                <Filter size={40} className="text-royalBlue-200" />
              </div>
              <h3 className="text-2xl font-black text-royalBlue-900 dark:text-white mb-2">No Records Found</h3>
              <p className="text-royalBlue-400 font-medium">We couldn't find any data for the {config.title.toLowerCase()} section.</p>
              
              {/* Only show Add button if it's a manageable data section and user is Admin */}
              {role === "Admin" && endpointMap[section] && (
                <button onClick={() => openModal()} className="btn-primary mt-8 group">
                  <Plus size={20} className="transition-transform group-hover:rotate-90" /> Add New {config.title.endsWith('s') ? config.title.slice(0, -1) : config.title}
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Footer Hint */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 flex items-center justify-between rounded-[32px] border border-royalBlue-100 bg-white/50 p-8 backdrop-blur-md dark:border-royalBlue-800 dark:bg-royalBlue-900/10"
      >
        <div className="flex items-center gap-6">
          <div className="h-12 w-12 rounded-2xl bg-royalBlue/10 flex items-center justify-center">
            <ArrowUpRight className="text-royalBlue" size={24} />
          </div>
          <div>
            <div className="text-lg font-black text-royalBlue-900 dark:text-white">
              {config.title} Central Workspace
            </div>
            <div className="text-sm font-medium text-royalBlue-500">
              Manage your department flow and records from this secure interface.
            </div>
          </div>
        </div>
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-royalBlue-300">
          Last updated: Today at {new Date().toLocaleTimeString()}
        </div>
      </motion.div>

      {/* Dynamic Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-lg rounded-[32px] border border-navyBlue-100 dark:border-white/10 bg-white dark:bg-navyBlue-950 p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-6 top-6 rounded-full p-2 text-navyBlue-400 dark:text-royalBlue-300 transition-colors hover:bg-navyBlue-50 dark:hover:bg-white/10 hover:text-navyBlue-900 dark:hover:text-white outline-none"
            >
              <X size={20} />
            </button>
            
            <h2 className="mb-6 text-2xl font-black text-navyBlue-900 dark:text-white">
              {editingItem ? `Edit ${config.title.endsWith('s') ? config.title.slice(0, -1) : config.title}` : `Register New ${config.title.endsWith('s') ? config.title.slice(0, -1) : config.title}`}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Common Fields */}
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-navyBlue-500 dark:text-royalBlue-300">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name || formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-2xl border border-navyBlue-100 dark:border-white/10 bg-navyBlue-50 dark:bg-white/5 px-4 py-3 text-sm text-navyBlue-900 dark:text-white focus:border-royalBlue focus:outline-none focus:ring-2 focus:ring-royalBlue/20"
                />
              </div>

              {(!editingItem && ["doctors", "patients", "nurses", "pharmacy", "billing"].includes(section)) && (
                <>
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-navyBlue-500 dark:text-royalBlue-300">Email Address (for Login)</label>
                    <input
                      type="email"
                      required
                      value={formData.email || ""}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-2xl border border-navyBlue-100 dark:border-white/10 bg-navyBlue-50 dark:bg-white/5 px-4 py-3 text-sm text-navyBlue-900 dark:text-white focus:border-royalBlue focus:outline-none focus:ring-2 focus:ring-royalBlue/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-navyBlue-500 dark:text-royalBlue-300">Password</label>
                    <input
                      type="password"
                      required
                      value={formData.password || ""}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full rounded-2xl border border-navyBlue-100 dark:border-white/10 bg-navyBlue-50 dark:bg-white/5 px-4 py-3 text-sm text-navyBlue-900 dark:text-white focus:border-royalBlue focus:outline-none focus:ring-2 focus:ring-royalBlue/20"
                    />
                  </div>
                </>
              )}

              {/* Section Specific Fields */}
              {section === "doctors" && (
                <>
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-navyBlue-500 dark:text-royalBlue-300">Specialization</label>
                    <input
                      type="text"
                      required
                      value={formData.specialization || ""}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      className="w-full rounded-2xl border border-navyBlue-100 dark:border-white/10 bg-navyBlue-50 dark:bg-white/5 px-4 py-3 text-sm text-navyBlue-900 dark:text-white focus:border-royalBlue focus:outline-none focus:ring-2 focus:ring-royalBlue/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-navyBlue-500 dark:text-royalBlue-300">Phone</label>
                    <input
                      type="text"
                      value={formData.phone || ""}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-2xl border border-navyBlue-100 dark:border-white/10 bg-navyBlue-50 dark:bg-white/5 px-4 py-3 text-sm text-navyBlue-900 dark:text-white focus:border-royalBlue focus:outline-none focus:ring-2 focus:ring-royalBlue/20"
                    />
                  </div>
                </>
              )}

              {section === "patients" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-navyBlue-500 dark:text-royalBlue-300">Age</label>
                      <input
                        type="number"
                        value={formData.age || ""}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="w-full rounded-2xl border border-navyBlue-100 dark:border-white/10 bg-navyBlue-50 dark:bg-white/5 px-4 py-3 text-sm text-navyBlue-900 dark:text-white focus:border-royalBlue focus:outline-none focus:ring-2 focus:ring-royalBlue/20"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-navyBlue-500 dark:text-royalBlue-300">Gender</label>
                      <select
                        value={formData.gender || ""}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full rounded-2xl border border-navyBlue-100 dark:border-white/10 bg-navyBlue-50 dark:bg-white/5 px-4 py-3 text-sm text-navyBlue-900 dark:text-white focus:border-royalBlue focus:outline-none focus:ring-2 focus:ring-royalBlue/20 [&>option]:bg-white [&>option]:text-navyBlue-900 dark:[&>option]:bg-navyBlue-950 dark:[&>option]:text-white"
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-navyBlue-500 dark:text-royalBlue-300">Blood Group</label>
                      <input
                        type="text"
                        value={formData.bloodGroup || ""}
                        onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                        className="w-full rounded-2xl border border-navyBlue-100 dark:border-white/10 bg-navyBlue-50 dark:bg-white/5 px-4 py-3 text-sm text-navyBlue-900 dark:text-white focus:border-royalBlue focus:outline-none focus:ring-2 focus:ring-royalBlue/20"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-navyBlue-500 dark:text-royalBlue-300">Phone</label>
                      <input
                        type="text"
                        value={formData.phone || ""}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full rounded-2xl border border-navyBlue-100 dark:border-white/10 bg-navyBlue-50 dark:bg-white/5 px-4 py-3 text-sm text-navyBlue-900 dark:text-white focus:border-royalBlue focus:outline-none focus:ring-2 focus:ring-royalBlue/20"
                      />
                    </div>
                  </div>
                </>
              )}

              {["nurses", "pharmacy", "billing"].includes(section) && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-navyBlue-500 dark:text-royalBlue-300">Gender</label>
                      <select
                        value={formData.gender || ""}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full rounded-2xl border border-navyBlue-100 dark:border-white/10 bg-navyBlue-50 dark:bg-white/5 px-4 py-3 text-sm text-navyBlue-900 dark:text-white focus:border-royalBlue focus:outline-none focus:ring-2 focus:ring-royalBlue/20 [&>option]:bg-white [&>option]:text-navyBlue-900 dark:[&>option]:bg-navyBlue-950 dark:[&>option]:text-white"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-navyBlue-500 dark:text-royalBlue-300">Phone</label>
                      <input
                        type="text"
                        value={formData.phone || ""}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full rounded-2xl border border-navyBlue-100 dark:border-white/10 bg-navyBlue-50 dark:bg-white/5 px-4 py-3 text-sm text-navyBlue-900 dark:text-white focus:border-royalBlue focus:outline-none focus:ring-2 focus:ring-royalBlue/20"
                      />
                    </div>
                  </div>
                </>
              )}

              {editingItem && ["nurses", "pharmacy", "billing"].includes(section) && (
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-navyBlue-500 dark:text-royalBlue-300">Status</label>
                  <select
                    value={formData.status || ""}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full rounded-2xl border border-navyBlue-100 dark:border-white/10 bg-navyBlue-50 dark:bg-white/5 px-4 py-3 text-sm text-navyBlue-900 dark:text-white focus:border-royalBlue focus:outline-none focus:ring-2 focus:ring-royalBlue/20 [&>option]:bg-white [&>option]:text-navyBlue-900 dark:[&>option]:bg-navyBlue-950 dark:[&>option]:text-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    {section === "nurses" && <option value="On Shift">On Shift</option>}
                    {section === "nurses" && <option value="On Duty">On Duty</option>}
                  </select>
                </div>
              )}

              <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-navyBlue-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full px-6 py-3 text-sm font-bold text-navyBlue-500 dark:text-royalBlue-300 transition-colors hover:bg-navyBlue-50 dark:hover:bg-white/5 hover:text-navyBlue-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-full bg-royalBlue px-8 py-3 text-sm font-black text-white shadow-lg shadow-royalBlue/20 transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isSubmitting ? "Saving..." : "Save Record"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>,
        document.body
      )}
    </div>
  );
}
