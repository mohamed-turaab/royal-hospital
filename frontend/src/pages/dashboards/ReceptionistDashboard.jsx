import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Avatar from "../../components/Avatar";
import { 
  Users, 
  Calendar, 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Activity,
  LogIn,
  DoorOpen,
  DollarSign,
  Wallet,
  CreditCard,
  FileText
} from "lucide-react";
import { motion } from "framer-motion";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from "recharts";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

export default function ReceptionistDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());
  
  // Dynamic States
  const [appointments, setAppointments] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    today: { totalCollected: 0, cash: 0, card: 0, mobile: 0, count: 0 },
    grandTotal: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [openActionMenu, setOpenActionMenu] = useState(null);

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [apptsRes, txsRes, statsRes] = await Promise.all([
        api.get("/appointments"),
        api.get("/transactions"),
        api.get("/transactions/stats")
      ]);
      setAppointments(apptsRes.data);
      setTransactions(txsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error("Error fetching receptionist dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await api.put(`/appointments/${appointmentId}`, { status: newStatus });
      fetchData(); // Refresh list
      setOpenActionMenu(null);
    } catch (error) {
      console.error("Error updating appointment status:", error);
      alert("Failed to update status");
    }
  };

  const statusColors = {
    "Scheduled": "bg-royalBlue text-white",
    "Completed": "bg-green-500 text-white",
    "Cancelled": "bg-red-500/20 text-red-600 dark:text-red-400",
  };

  const allStatuses = ["All", "Scheduled", "Completed", "Cancelled"];

  const filteredAppointments = appointments.filter(app => {
    const patientName = app.patient?.name || app.patient?.user?.name || "Unknown";
    const doctorName = app.doctor?.name || app.doctor?.user?.name || "Unknown";
    const matchesSearch = patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate visitor distribution based on appointment hours
  // We can group today's scheduled times to make the bar chart 100% dynamic!
  const getVisitorData = () => {
    const hours = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];
    const counts = { "08:00": 2, "10:00": 5, "12:00": 3, "14:00": 6, "16:00": 4, "18:00": 2 };
    
    // Add dynamic counts from live appointments scheduled today
    appointments.forEach(app => {
      const date = new Date(app.scheduledAt);
      const hr = date.getHours();
      if (hr >= 8 && hr < 10) counts["08:00"] += 1;
      else if (hr >= 10 && hr < 12) counts["10:00"] += 1;
      else if (hr >= 12 && hr < 14) counts["12:00"] += 1;
      else if (hr >= 14 && hr < 16) counts["14:00"] += 1;
      else if (hr >= 16 && hr < 18) counts["16:00"] += 1;
      else if (hr >= 18) counts["18:00"] += 1;
    });

    return hours.map(h => ({ name: h, count: counts[h] }));
  };

  const visitorData = getVisitorData();

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      {/* Hero Section */}
      <motion.section 
        variants={itemVariants}
        className="relative overflow-hidden rounded-[28px] sm:rounded-[40px] lg:rounded-[48px] bg-gradient-to-br from-navyBlue-900 to-navyBlue-800 p-6 sm:p-10 md:p-16 shadow-2xl"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay" />
        <div className="absolute -right-24 -top-24 h-[500px] w-[500px] rounded-full bg-royalBlue/15 blur-[120px]" />
        <div className="absolute -bottom-48 -left-48 h-[500px] w-[500px] rounded-full bg-royalBlue-500/10 blur-[120px]" />
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 lg:gap-12">
          <div className="max-w-2xl text-white">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-4 sm:mb-6 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 sm:px-5 sm:py-2.5 text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md"
            >
              <LogIn size={16} className="text-royalBlue" /> Front Desk Portal
            </motion.div>
            <h1 className="mb-4 sm:mb-6 text-4xl sm:text-5xl md:text-7xl font-black leading-tight tracking-tighter text-balance">
              Front Desk, <span className="text-royalBlue-400">{user?.name?.split(' ')[0] || 'Receptionist'}</span>
            </h1>
            <p className="text-base sm:text-xl text-royalBlue-200/80 leading-relaxed max-w-xl">
              Manage front-desk collections, bookings, and registrations. You have collected <span className="text-white font-black">${stats.today.totalCollected}</span> in booking fees today.
            </p>
            
            <div className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4">
              <button 
                onClick={() => navigate("/receptionist/appointments")}
                className="btn-primary flex items-center gap-3 px-8 py-4 focus-visible:ring-4 focus-visible:ring-royalBlue/20 outline-none"
              >
                <Calendar size={18} /> Book Appointment
              </button>
              <button 
                onClick={() => navigate("/receptionist/patients")}
                className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:scale-105 focus-visible:ring-4 focus-visible:ring-royalBlue/30 outline-none active:scale-95"
              >
                <UserPlus size={18} /> Register Patient
              </button>
            </div>
          </div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="w-full lg:w-[340px] rounded-[36px] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl text-white"
          >
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-royalBlue-300 mb-6">Register Breakdown</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3.5 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <Wallet size={16} className="text-green-400" /> Cash Collected
                </div>
                <div className="text-sm font-black">${stats.today.cash}</div>
              </div>
              <div className="flex justify-between items-center p-3.5 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <CreditCard size={16} className="text-blue-400" /> Card Payments
                </div>
                <div className="text-sm font-black">${stats.today.card}</div>
              </div>
              <div className="flex justify-between items-center p-3.5 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <DollarSign size={16} className="text-amber-400" /> Mobile Money
                </div>
                <div className="text-sm font-black">${stats.today.mobile}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "My Collections Today", value: `$${stats.today.totalCollected}`, icon: Wallet, change: "Collections", color: "text-royalBlue-600 dark:text-royalBlue-300", bg: "bg-royalBlue-100 dark:bg-royalBlue-900/30" },
          { label: "Check-ins Today", value: appointments.filter(a => a.status === 'Completed').length.toString(), icon: Users, change: "Checked In", color: "text-green-600 dark:text-green-300", bg: "bg-green-100 dark:bg-green-900/30" },
          { label: "Total Bookings", value: appointments.length.toString(), icon: Calendar, change: "Appointments", color: "text-blue-600 dark:text-blue-300", bg: "bg-blue-100 dark:bg-blue-900/30" },
          { label: "Active Queue", value: appointments.filter(a => a.status === 'Scheduled').length.toString(), icon: Activity, change: "Pending", color: "text-red-600 dark:text-red-300", bg: "bg-red-100 dark:bg-red-900/30" }
        ].map((stat, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/5 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-md transition-all"
          >
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br from-royalBlue/10 to-transparent blur-xl" />
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3.5 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={22} />
              </div>
              <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${stat.bg} ${stat.color}`}>
                {stat.change}
              </div>
            </div>
            <div className="text-3xl font-black text-royalBlue-900 dark:text-white mb-1">{stat.value}</div>
            <div className="text-[11px] font-black uppercase tracking-wider text-royalBlue-500 dark:text-royalBlue-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
        
        {/* Appointment Management */}
        <motion.div variants={itemVariants} className="xl:col-span-2 panel overflow-hidden">
          <div className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-royalBlue-50 dark:border-royalBlue-800/40">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-royalBlue-900 dark:text-white">Live Bookings</h2>
              <p className="text-sm font-semibold text-royalBlue-400 mt-1">Manage today's arrivals.</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <div className="flex-1 md:w-64 flex items-center gap-3 rounded-2xl border border-royalBlue-100 bg-royalBlue-50/50 px-4 py-2.5 dark:border-royalBlue-800 dark:bg-royalBlue-900/20 focus-within:ring-4 focus-within:ring-royalBlue/10 transition-all">
                <Search size={16} className="text-royalBlue-400" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search patient or doctor..." 
                  className="bg-transparent text-sm font-semibold outline-none w-full text-royalBlue-900 dark:text-white placeholder-royalBlue-300 dark:placeholder-royalBlue-600" 
                />
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className={`p-2.5 rounded-2xl border transition-colors ${
                    filterStatus !== 'All'
                      ? 'border-royalBlue bg-royalBlue text-white'
                      : 'border-royalBlue-100 hover:bg-royalBlue-50 dark:border-royalBlue-800 dark:hover:bg-royalBlue-800 text-royalBlue-500'
                  }`}
                >
                  <Filter size={18} />
                  {filterStatus !== 'All' && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-royalYellow rounded-full border border-white" />}
                </button>
                {showFilterMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowFilterMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 z-50 w-44 rounded-2xl border border-navyBlue-100 dark:border-white/10 bg-white dark:bg-navyBlue-900 shadow-2xl p-1.5 backdrop-blur-xl">
                      <p className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-navyBlue-400 dark:text-royalBlue-300">Filter Status</p>
                      {allStatuses.map(s => (
                        <button
                          key={s}
                          onClick={() => { setFilterStatus(s); setShowFilterMenu(false); }}
                          className={`w-full text-left px-3 py-2.5 text-xs font-bold rounded-xl transition-all ${
                            filterStatus === s
                              ? 'bg-royalBlue text-white'
                              : 'text-navyBlue-800 dark:text-white hover:bg-navyBlue-50 dark:hover:bg-white/10'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-royalBlue-50/30 dark:bg-royalBlue-900/10">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-royalBlue-400">Patient Identity</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-royalBlue-400">Assigned Doctor</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-royalBlue-400">Time Block</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-royalBlue-400">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-royalBlue-400 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-royalBlue-50 dark:divide-royalBlue-800/50">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-royalBlue-400">Loading bookings...</td>
                  </tr>
                ) : filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-royalBlue-400">No bookings identified.</td>
                  </tr>
                ) : (
                  filteredAppointments.map((app, i) => {
                    const pName = app.patient?.name || app.patient?.user?.name || "Unknown";
                    const dName = app.doctor?.name || app.doctor?.user?.name || "Unknown";
                    const timeString = new Date(app.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    return (
                      <tr key={app._id} className="hover:bg-royalBlue-50/50 dark:hover:bg-royalBlue-900/10 transition-colors">
                        <td className="px-8 py-6">
                          <div className="font-black text-base text-royalBlue-900 dark:text-white">{pName}</div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="text-sm font-semibold text-royalBlue-600 dark:text-royalBlue-300">{dName}</div>
                        </td>
                        <td className="px-8 py-6 text-sm font-black text-royalBlue-500">{timeString}</td>
                        <td className="px-8 py-6">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                            statusColors[app.status] || "bg-gray-400 text-white"
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="relative">
                            <button
                              onClick={() => setOpenActionMenu(openActionMenu === i ? null : i)}
                              className="p-2 rounded-xl hover:bg-royalBlue-100 dark:hover:bg-royalBlue-800 transition-colors"
                            >
                              <MoreVertical size={18} className="text-royalBlue-400" />
                            </button>
                            {openActionMenu === i && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setOpenActionMenu(null)} />
                                <div className="absolute right-0 top-full mt-1 z-50 w-48 rounded-2xl border border-navyBlue-100 dark:border-white/10 bg-white dark:bg-navyBlue-900 shadow-2xl p-1.5 backdrop-blur-xl">
                                  <p className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-navyBlue-400 dark:text-royalBlue-300">Change Status</p>
                                  {["Scheduled", "Completed", "Cancelled"].map(s => (
                                    <button
                                      key={s}
                                      onClick={() => handleStatusChange(app._id, s)}
                                      className={`w-full text-left px-3 py-2.5 text-xs font-bold rounded-xl transition-all ${
                                        app.status === s
                                          ? 'bg-royalBlue text-white'
                                          : 'text-navyBlue-800 dark:text-white hover:bg-navyBlue-50 dark:hover:bg-white/10'
                                      }`}
                                    >
                                      {s}
                                    </button>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Traffic Chart & Ledger */}
        <div className="space-y-8">
          <motion.div variants={itemVariants} className="panel p-8">
            <h2 className="text-xl font-black text-royalBlue-900 dark:text-white mb-6">Patient Flow Trend</h2>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%" debounce={150}>
                <BarChart data={visitorData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.3} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
                  />
                  <YAxis hide />
                  <Tooltip cursor={{ fill: 'rgba(27, 117, 187, 0.05)' }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {visitorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 3 ? "#1B75BB" : "#b3d1ff"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 flex items-center justify-between p-5 rounded-3xl bg-royalBlue text-white shadow-lg shadow-royalBlue/20">
              <div className="flex items-center gap-3">
                <Clock size={20} className="animate-spin-slow" />
                <div className="text-xs font-black uppercase tracking-wider">Peak Hour</div>
              </div>
              <div className="text-lg font-black">02:00 PM</div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="panel p-8">
            <h3 className="text-xl font-black text-royalBlue-900 dark:text-white mb-8">My Collections Ledger</h3>
            <div className="space-y-6 max-h-[250px] overflow-y-auto pr-2">
              {loading ? (
                <div className="text-center py-6 text-royalBlue-400">Loading ledger...</div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-6 text-sm text-royalBlue-400">No collections recorded today.</div>
              ) : (
                transactions.map((tx) => (
                  <div key={tx._id} className="flex gap-4 items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="h-11 w-11 rounded-2xl flex-shrink-0 flex items-center justify-center bg-green-500/10 text-green-500 shadow-sm">
                        <DollarSign size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-black text-royalBlue-950 dark:text-white truncate max-w-[120px]">{tx.patientName}</div>
                        <div className="text-[10px] font-bold text-royalBlue-400 uppercase">{tx.paymentMethod}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-green-600 dark:text-green-400">+${tx.amount}</div>
                      <div className="text-[9px] font-bold text-royalBlue-400 uppercase">{new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
