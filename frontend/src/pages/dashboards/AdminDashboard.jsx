import React, { useEffect, useState, Component } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { dashboardConfig, rolePath } from "../../config/roles";
import api from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  Mail,
  ShieldCheck,
  ArrowUpRight,
  BadgeCheck,
  Users,
  DollarSign,
  Activity,
  MoreVertical,
  Plus,
  FileText,
  Search,
  DoorOpen,
  X,
  Edit,
  Trash2,
  ClipboardList,
  ActivitySquare
} from "lucide-react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

// Helper to format large numbers
const formatNumber = (num) => {
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
  return num;
};

function StatCard({ item, index }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -4, scale: 1.02 }}
      className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/5 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-md transition-all"
    >
      {/* Gradient glow accent */}
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-royalBlue/20 to-transparent blur-2xl" />
      <div className="flex items-start justify-between mb-4">
        <div
          className={`rounded-2xl p-3 ${
            index % 2 === 0
              ? "bg-royalBlue-100 text-royalBlue-600 dark:bg-royalBlue-800/50 dark:text-royalBlue-300"
              : "bg-navyBlue-100 text-navyBlue-700 dark:bg-navyBlue-800/50 dark:text-navyBlue-200"
          }`}
        >
          <item.icon size={24} />
        </div>
        <div className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700 dark:bg-green-500/10 dark:text-green-400">
          <ArrowUpRight size={14} />
          {item.change}
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-black text-royalBlue-900 dark:text-white">
          {formatNumber(item.value)}
        </h3>
        <p className="mt-1 text-sm font-semibold text-royalBlue-500 dark:text-royalBlue-400">
          {item.label}
        </p>
      </div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const config = dashboardConfig.Admin;
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [now, setNow] = useState(new Date());

  // Revenue Reports state
  const [revenueReports, setRevenueReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // CRUD States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", role: "Doctor", password: "", status: "Active" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const [usersRes, analyticsRes, reportsRes] = await Promise.all([
        api.get("/auth/users"),
        api.get("/analytics/admin"),
        api.get("/revenue-reports")
      ]);
      setUsers(usersRes.data);
      setAnalytics(analyticsRes.data);
      setRevenueReports(reportsRes.data);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    }
  };

  const handleReportStatusUpdate = async (reportId, status) => {
    try {
      await api.patch(`/revenue-reports/${reportId}/status`, { status });
      setIsReportModalOpen(false);
      setSelectedReport(null);
      fetchDashboardData();
    } catch (error) {
      console.error("Error updating report status:", error);
      alert(error.response?.data?.message || "Failed to update status");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingUser) {
        await api.put(`/auth/users/${editingUser._id}`, formData);
      } else {
        await api.post("/auth/users", formData);
      }
      setIsModalOpen(false);
      fetchDashboardData();
    } catch (error) {
      console.error("Save error:", error);
      alert(error.response?.data?.message || "Error saving user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = (id) => {
    setConfirmDeleteId(id);
  };

  const doDeleteUser = async () => {
    const id = confirmDeleteId;
    setConfirmDeleteId(null);
    try {
      await api.delete(`/auth/users/${id}`);
      fetchDashboardData();
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.response?.data?.message || "Error deleting user");
    }
  };

  const openModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({ name: user.name, email: user.email, role: user.role, status: user.status || "Active", password: "" });
    } else {
      setEditingUser(null);
      setFormData({ name: "", email: "", role: "Doctor", password: "", status: "Active" });
    }
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  // Real‑time clock
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredUsers = (Array.isArray(users) ? users : []).filter((u) =>
    u?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardErrorBoundary>
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      {/* Hero Section */}
      <motion.section
        variants={itemVariants}
        className="relative overflow-hidden rounded-[48px] bg-gradient-to-br from-navyBlue-900 to-navyBlue-800 p-10 shadow-2xl md:p-16"
      >
        {/* Mesh background */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/brick-wall.png')] opacity-10" />
        {/* Glowing orbs */}
        <div className="absolute -right-24 -top-24 h-[500px] w-[500px] rounded-full bg-royalBlue/15 blur-[120px]" />
        <div className="absolute -bottom-48 -left-48 h-[500px] w-[500px] rounded-full bg-royalBlue-500/10 blur-[120px]" />
        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl text-white">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-4 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md"
            >
              <ShieldCheck size={16} className="text-royalBlue" />
              {config.eyebrow}
            </motion.div>
            <h1 className="mb-6 text-5xl font-black leading-tight tracking-tighter md:text-7xl lg:text-8xl text-balance">
              {config.title}
            </h1>
            <p className="text-xl text-royalBlue-200/80 max-w-xl">
              {config.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button onClick={() => openModal()} className="btn-primary group">
                <Plus size={20} className="transition-transform group-hover:rotate-90" /> Add New User
              </button>
              <button
                onClick={() => navigate("/admin/rooms")}
                className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:scale-105"
              >
                <DoorOpen size={20} /> Manage Rooms
              </button>
            </div>
          </div>
          {/* Admin Profile Card */}
          <motion.div
            whileHover={{ y: -4 }}
            className="w-full max-w-xs rounded-[40px] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl lg:w-[420px]"
          >
            <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-royalBlue-200">
                System Status
              </h3>
              <div className="flex items-center gap-2.5 rounded-full bg-green-500/20 px-4 py-1.5 text-[11px] font-black text-green-400 uppercase tracking-widest">
                <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                Operational
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-3xl bg-white/5 p-5 transition-colors hover:bg-white/10">
                <div className="flex items-center gap-4 text-white">
                  <div className="rounded-xl bg-royalBlue/20 p-2.5">
                    <Activity size={22} className="text-royalBlue" />
                  </div>
                  <span className="font-bold">Server Uptime</span>
                </div>
                <span className="text-lg font-black text-white">99.9%</span>
              </div>
              <div className="flex items-center justify-between rounded-3xl bg-white/5 p-5 transition-colors hover:bg-white/10">
                <div className="flex items-center gap-4 text-white">
                  <div className="rounded-xl bg-royalBlue-500/20 p-2.5">
                    <Users size={22} className="text-royalBlue-300" />
                  </div>
                  <span className="font-bold">Active Sessions</span>
                </div>
                <span className="text-lg font-black text-white">{users.length}</span>
              </div>
            </div>
            <div className="mt-6 text-sm text-royalBlue-300">
              {now.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })} – {now.toLocaleTimeString()}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 xl:grid-cols-5">
        {analytics?.stats ? (
          [
            { label: "Active staff", value: analytics.stats.activeStaff, change: "Live", icon: Users },
            { label: "Open appointments", value: analytics.stats.pendingAppointments, change: "Pending", icon: Calendar },
            { label: "Pending Lab Tests", value: analytics.stats.pendingLabTests, change: "Requires action", icon: ActivitySquare },
            { label: "Revenue today", value: analytics.stats.revenueToday, change: analytics.stats.revenueChange, icon: DollarSign },
            { label: "Critical alerts", value: analytics.stats.criticalAlerts, change: "Needs review", icon: Activity },
          ].map((item, index) => (
            <StatCard key={item.label} item={item} index={index} />
          ))
        ) : (
          config.stats.map((item, index) => (
            <StatCard key={item.label} item={item} index={index} />
          ))
        )}
      </div>
      {/* Users Table */}
      <motion.section variants={itemVariants} className="table-container">
        <div className="flex flex-col gap-6 border-b border-royalBlue-100 p-10 sm:flex-row sm:items-center sm:justify-between dark:border-royalBlue-800">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-royalBlue-900 dark:text-white">
              System Users
            </h2>
            <p className="mt-1 text-sm font-medium text-royalBlue-500 dark:text-royalBlue-400">
              Manage platform access and administrative roles.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 rounded-2xl border border-royalBlue-100 bg-royalBlue-50 px-5 py-3 dark:border-royalBlue-800 dark:bg-royalBlue-900/50">
              <Search size={20} className="text-royalBlue-400" />
              <input
                type="text"
                placeholder="Filter users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent text-sm font-bold text-royalBlue-900 outline-none placeholder:text-royalBlue-300 dark:text-white"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-royalBlue-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-royalBlue-400 dark:bg-royalBlue-900/30 dark:text-royalBlue-300">
              <tr>
                <th className="px-10 py-6">User Identity</th>
                <th className="px-10 py-6">Access Level</th>
                <th className="px-10 py-6">System Status</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-royalBlue-50 dark:divide-royalBlue-800/50">
              {filteredUsers.map((item) => (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={item.id || item.email}
                  onClick={() => {
                    if (user?.role === "Admin") {
                      const sectionMap = {
                        Patient: "patients",
                        Doctor: "doctors",
                        Nurse: "nurses",
                        Pharmacist: "pharmacy",
                        Accountant: "billing",
                        Receptionist: "appointments",
                      };
                      const section = sectionMap[item.role];
                      if (section) navigate(`/admin/${section}`);
                      else navigate(rolePath(item.role));
                    } else {
                      navigate(rolePath(item.role));
                    }
                  }}
                  className="group cursor-pointer transition-all hover:bg-royalBlue-50/50 dark:hover:bg-royalBlue-900/20"
                >
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <Avatar
                        src={item.profileImage}
                        name={item.name}
                        size="h-14 w-14 shadow-lg ring-2 ring-transparent transition-all group-hover:ring-royalBlue/30"
                      />
                      <div>
                        <div className="text-base font-black text-royalBlue-900 dark:text-white">
                          {item.name}
                        </div>
                        <div className="text-xs font-bold text-royalBlue-400">
                          {item.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className="inline-flex rounded-xl bg-royalBlue-100 px-4 py-1.5 text-[11px] font-black uppercase tracking-wider text-royalBlue-700 dark:bg-royalBlue-800/50 dark:text-royalBlue-300">
                      {item.role}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-3">
                      <div className={`h-2.5 w-2.5 rounded-full ${item.status?.toLowerCase().includes("offline") ? "bg-gray-400" : "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"}`} />
                      <span className="text-[13px] font-bold text-royalBlue-600 dark:text-royalBlue-300">
                        {item.status || "Active"}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); openModal(item); }}
                        className="p-2.5 rounded-xl text-royalBlue-400 transition-all hover:bg-royalBlue/10 hover:text-royalBlue dark:hover:bg-royalBlue/20 dark:hover:text-royalBlue-300"
                        title="Edit User"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteUser(item._id); }}
                        className="p-2.5 rounded-xl text-royalBlue-400 transition-all hover:bg-red-500/10 hover:text-red-500 dark:hover:bg-red-500/20 dark:hover:text-red-400"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="px-10 py-20 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-royalBlue-50 dark:bg-royalBlue-900/30">
                <Search size={32} className="text-royalBlue-200" />
              </div>
              <p className="text-lg font-bold text-royalBlue-300">No users match your criteria</p>
            </div>
          )}
        </div>
      </motion.section>

      {/* Add/Edit User Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-lg rounded-[32px] border border-white/10 bg-navyBlue-950 p-8 shadow-2xl"
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-6 top-6 rounded-full p-2 text-royalBlue-300 transition-colors hover:bg-white/10 hover:text-white outline-none"
            >
              <X size={20} />
            </button>
            
            <h2 className="mb-6 text-2xl font-black text-white">
              {editingUser ? "Edit User Account" : "Register New User"}
            </h2>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-royalBlue-300">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-royalBlue focus:outline-none focus:ring-2 focus:ring-royalBlue/20"
                />
              </div>
              
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-royalBlue-300">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-royalBlue focus:outline-none focus:ring-2 focus:ring-royalBlue/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-royalBlue-300">System Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-royalBlue focus:outline-none focus:ring-2 focus:ring-royalBlue/20 [&>option]:bg-navyBlue-900"
                  >
                    {["Admin", "Doctor", "Nurse", "Receptionist", "Patient", "Pharmacist", "Accountant"].map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-royalBlue-300">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-royalBlue focus:outline-none focus:ring-2 focus:ring-royalBlue/20 [&>option]:bg-navyBlue-900"
                  >
                    <option value="Active">Active</option>
                    <option value="On Duty">On Duty</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-royalBlue-300">
                  {editingUser ? "New Password (Optional)" : "Password"}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-royalBlue focus:outline-none focus:ring-2 focus:ring-royalBlue/20"
                />
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full px-6 py-3 text-sm font-bold text-royalBlue-300 transition-colors hover:bg-white/5 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-full bg-royalBlue px-8 py-3 text-sm font-black text-white shadow-lg shadow-royalBlue/20 transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isSubmitting ? "Saving..." : "Save User"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>,
        document.body
      )}

      {/* Confirm Delete User Modal */}
      {confirmDeleteId && createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: 'rgba(7,27,52,0.85)', backdropFilter: 'blur(8px)' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '420px', backgroundColor: '#0d1623', borderRadius: '24px', padding: '32px', boxShadow: '0 25px 60px rgba(0,0,0,0.6)', border: '1px solid rgba(239,68,68,0.3)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Trash2 size={28} color="#ef4444" />
            </div>
            <h2 style={{ color: 'white', fontWeight: 900, fontSize: '1.25rem', textAlign: 'center', marginBottom: '8px' }}>Delete User?</h2>
            <p style={{ color: '#8ca8cc', fontSize: '0.875rem', textAlign: 'center', marginBottom: '28px' }}>This action cannot be undone. The user account will be permanently removed.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setConfirmDeleteId(null)} style={{ flex: 1, padding: '12px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'transparent', color: '#8ca8cc', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>
                Cancel
              </button>
              <button onClick={doDeleteUser} style={{ flex: 1, padding: '12px', borderRadius: '14px', border: 'none', backgroundColor: '#ef4444', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </motion.div>
    </DashboardErrorBoundary>
  );
}

class DashboardErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 bg-red-900/20 border border-red-500 rounded-xl text-white">
          <h2 className="text-xl font-bold text-red-500 mb-4">Admin Dashboard Crashed</h2>
          <pre className="text-sm overflow-auto">{this.state.error.toString()}</pre>
          <pre className="text-xs text-gray-400 mt-4">{this.state.error.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
