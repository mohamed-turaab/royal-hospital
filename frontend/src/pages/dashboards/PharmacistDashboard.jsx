import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import Avatar from "../../components/Avatar";
import PrintablePrescription from "../../components/PrintablePrescription";
import { 
  Pill, 
  Package, 
  AlertTriangle, 
  ClipboardList, 
  Activity, 
  Search, 
  Filter, 
  MoreVertical, 
  Plus, 
  Truck, 
  CheckCircle2, 
  Clock,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";

const inventoryData = [
  { name: "Antibiotics", value: 400, color: "#1B75BB" },
  { name: "Painkillers", value: 300, color: "#2386E6" },
  { name: "Vitamins", value: 300, color: "#4ab2e1" },
  { name: "Injectables", value: 200, color: "#a5d8ff" },
];

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

export default function PharmacistDashboard() {
  const { user } = useAuth();
  const [now, setNow] = useState(new Date());
  
  // Dynamic Prescription Queue
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [printingPrescription, setPrintingPrescription] = useState(null);

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/prescriptions");
      // Filter out 'Pending Payment' prescriptions so only paid ones show up in the dispensing queue!
      setQueue(data.filter(p => p.status === "Pending Pharmacy" || p.status === "Dispensed"));
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const handleProcessMed = async (id) => {
    try {
      // Mark as dispensed in the database!
      await api.patch(`/prescriptions/${id}/status`, { status: "Dispensed" });
      fetchPrescriptions(); // Refresh
    } catch (error) {
      console.error("Error dispensing prescription:", error);
      alert("Failed to dispense medication");
    }
  };

  const handlePrint = (p) => {
    setPrintingPrescription(p);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const filteredQueue = queue.filter(item => {
    const pName = item.patientName || item.patient?.name || "Unknown Patient";
    const dName = item.doctor?.name || "Doctor";
    const medNames = (item.medicines || []).map(m => m.name).join(", ");
    return pName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           dName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           medNames.toLowerCase().includes(searchTerm.toLowerCase());
  });

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
              <Pill size={16} className="text-royalBlue" /> Pharmacy Management System
            </motion.div>
            <h1 className="mb-4 sm:mb-6 text-4xl sm:text-5xl md:text-7xl font-black leading-tight tracking-tighter text-balance">
              Pharmacy, <span className="text-royalBlue-400">{user?.name?.split(' ')[0] || 'Pharmacist'}</span>
            </h1>
            <p className="text-base sm:text-xl text-royalBlue-200/80 leading-relaxed max-w-xl">
              Inventory is stable. There are <span className="text-white font-black">{queue.filter(p => p.status === 'Pending Pharmacy').length} prescriptions</span> paid and waiting to be dispensed.
            </p>
          </div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="w-full lg:w-[340px] rounded-[36px] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl shrink-0"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-royalBlue-300">Low Stock Alerts</h3>
              <AlertTriangle size={18} className="text-red-500 animate-pulse" />
            </div>
            <div className="space-y-4">
              {[
                { name: "Amoxicillin", stock: "12 units", color: "text-red-400", bg: "bg-red-500/10" },
                { name: "Paracetamol", stock: "45 units", color: "text-orange-400", bg: "bg-orange-500/10" },
                { name: "Insulin", stock: "8 units", color: "text-red-400", bg: "bg-red-500/10" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                  <div className="text-sm font-black text-white">{item.name}</div>
                  <div className={`text-[10px] font-black uppercase tracking-wider ${item.color} ${item.bg} px-3 py-1 rounded-lg`}>{item.stock}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Stock", value: "4,284", icon: Package, change: "+5%", color: "text-royalBlue-600 dark:text-royalBlue-300", bg: "bg-royalBlue-100 dark:bg-royalBlue-900/30" },
          { label: "Active Queue", value: queue.filter(p => p.status === 'Pending Pharmacy').length.toString(), icon: ClipboardList, change: "Paid & Ready", color: "text-blue-600 dark:text-blue-300", bg: "bg-blue-100 dark:bg-blue-900/30" },
          { label: "Low Stock Items", value: "5", icon: AlertTriangle, change: "Critical", color: "text-red-600 dark:text-red-300", bg: "bg-red-100 dark:bg-red-900/30", glow: true },
          { label: "Dispensed Today", value: queue.filter(p => p.status === 'Dispensed').length.toString(), icon: CheckCircle2, change: "Completed", color: "text-green-600 dark:text-green-300", bg: "bg-green-100 dark:bg-green-900/30" }
        ].map((stat, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className={`relative overflow-hidden rounded-3xl border border-white/20 bg-white/5 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-md transition-all ${
              stat.glow ? 'ring-2 ring-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.15)] dark:border-red-500/20' : ''
            }`}
          >
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br from-royalBlue/10 to-transparent blur-xl" />
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3.5 rounded-2xl ${stat.bg} ${stat.color} relative`}>
                {stat.glow && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-ping" />}
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Prescription Processing Queue */}
        <motion.div variants={itemVariants} className="xl:col-span-2 panel overflow-hidden">
          <div className="p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-royalBlue-100 dark:border-royalBlue-800 gap-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-royalBlue-900 dark:text-white">Prescription Queue</h2>
              <p className="text-sm font-semibold text-royalBlue-400 mt-1">Dispense medicines for paid prescriptions.</p>
            </div>
            <div className="w-full sm:w-64 flex items-center gap-3 rounded-2xl border border-royalBlue-100 bg-royalBlue-50/50 px-4 py-2.5 dark:border-royalBlue-800 dark:bg-royalBlue-900/20 focus-within:ring-4 focus-within:ring-royalBlue/10 transition-all">
              <Search size={16} className="text-royalBlue-400" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search patient, doctor..." 
                className="bg-transparent text-sm font-semibold outline-none w-full text-royalBlue-900 dark:text-white placeholder-royalBlue-300 dark:placeholder-royalBlue-600" 
              />
            </div>
          </div>
          
          <div className="p-8 space-y-6 max-h-[500px] overflow-y-auto">
            {loading ? (
              <div className="text-center py-10 text-royalBlue-400">Loading prescription queue...</div>
            ) : filteredQueue.length === 0 ? (
              <div className="text-center py-10 text-royalBlue-400">No prescriptions in queue.</div>
            ) : (
              <div className="space-y-6">
                {filteredQueue.map((p, idx) => {
                  const pName = p.patientName || p.patient?.name || "Unknown Patient";
                  const dName = p.doctor?.name || "Doctor";
                  return (
                    <div 
                      key={p._id || idx} 
                      className="flex flex-col items-start justify-between p-6 rounded-3xl border border-royalBlue-50 dark:border-royalBlue-800/50 hover:bg-royalBlue-50/50 dark:hover:bg-royalBlue-900/10 transition-colors gap-6 bg-white dark:bg-navyBlue-900/40"
                    >
                      <div className="flex flex-col md:flex-row w-full justify-between gap-6">
                        <div className="flex items-start gap-5">
                          <div className="h-14 w-14 rounded-2xl bg-royalBlue text-white flex items-center justify-center font-black text-xl shadow-md shadow-royalBlue/20 shrink-0">
                            {pName[0]}
                          </div>
                          <div className="w-full">
                            <div className="font-black text-lg text-royalBlue-900 dark:text-white">{pName}</div>
                            <div className="text-xs font-bold text-royalBlue-400 mb-4">Prescribed by {dName}</div>
                            
                            {/* Detailed Medicine List */}
                            <div className="space-y-3 w-full">
                              {(p.medicines || []).map((m, i) => (
                                <div key={i} className="p-4 rounded-2xl bg-royalBlue-50/50 dark:bg-navyBlue-950/50 border border-royalBlue-100/50 dark:border-navyBlue-800/50 w-full md:min-w-[400px]">
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="font-black text-royalBlue-900 dark:text-white">{m.name}</div>
                                    <div className="text-[10px] font-black bg-royalBlue text-white px-2 py-1 rounded-lg uppercase tracking-wider">{m.dosage || 'N/A'}</div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                                    <div><span className="text-royalBlue-400 font-bold uppercase tracking-wider text-[9px]">Frequency:</span> <span className="font-semibold text-royalBlue-900 dark:text-royalBlue-200">{m.frequency || '-'}</span></div>
                                    <div><span className="text-royalBlue-400 font-bold uppercase tracking-wider text-[9px]">Duration:</span> <span className="font-semibold text-royalBlue-900 dark:text-royalBlue-200">{m.duration || '-'}</span></div>
                                  </div>
                                  {m.instructions && (
                                    <div className="text-xs text-navyBlue-500 dark:text-navyBlue-400 bg-white/50 dark:bg-black/20 p-2 rounded-xl border border-royalBlue-100/20">
                                      <span className="font-bold text-royalBlue-400 mr-1">Instructions:</span> 
                                      {m.instructions}
                                    </div>
                                  )}
                                </div>
                              ))}
                              
                              {p.notes && (
                                <div className="mt-4 text-xs p-3 rounded-2xl bg-royalYellow/10 text-royalYellow-700 border border-royalYellow/20">
                                  <span className="font-black uppercase tracking-wider mr-2">Doctor's Notes:</span>
                                  {p.notes}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-royalBlue-50 dark:border-royalBlue-800/30 pt-4 md:pt-0">
                        <div className="text-left">
                          <div className="text-[10px] text-green-500 font-black uppercase tracking-widest bg-green-500/10 px-2.5 py-1 rounded-lg">PAID</div>
                        </div>
                        {p.status === 'Dispensed' ? (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 text-green-500 font-black text-xs uppercase tracking-widest bg-green-500/10 px-3.5 py-1.5 rounded-xl">
                              <CheckCircle2 size={18} /> Dispensed
                            </div>
                            <button 
                              onClick={() => handlePrint(p)}
                              className="btn-secondary py-2 px-4 rounded-xl text-xs font-black shadow-sm"
                            >
                              Print Slip
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handlePrint(p)}
                              className="btn-secondary py-2.5 px-4 rounded-xl text-xs font-black shadow-sm"
                            >
                              Print Slip
                            </button>
                            <button 
                              onClick={() => handleProcessMed(p._id)}
                              className="btn-primary py-2.5 px-6 rounded-xl text-xs font-black transition-all focus-visible:ring-4 focus-visible:ring-royalBlue/20 outline-none active:scale-95 shadow-md shadow-royalBlue/20"
                            >
                              Dispense Medicine
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>

        {/* Stock Distribution Pie Chart */}
        <div className="space-y-8">
          <motion.div variants={itemVariants} className="panel p-8">
            <h2 className="text-xl font-black text-royalBlue-900 dark:text-white mb-6">Stock Distribution</h2>
            <div className="h-[220px] w-full relative">
              <ResponsiveContainer width="100%" height="100%" debounce={150}>
                <PieChart>
                  <Pie
                    data={inventoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={6}
                    dataKey="value"
                    stroke="none"
                  >
                    {inventoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-royalBlue-900 dark:text-white">1.2k</span>
                <span className="text-[10px] font-black uppercase tracking-wider text-royalBlue-400">Total Items</span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {inventoryData.map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-royalBlue-50/50 dark:hover:bg-royalBlue-900/10 transition-colors">
                  <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] font-black text-royalBlue-500 uppercase tracking-widest truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="panel p-8">
            <h3 className="text-xl font-black text-royalBlue-900 dark:text-white mb-8">Delivery Tracker</h3>
            <div className="space-y-6">
              {[
                { order: "#ORD-9921", status: "Out for Delivery", time: "Est. 20m", icon: Truck },
                { order: "#ORD-9844", status: "Processing Logistics", time: "Est. 1h", icon: Clock },
              ].map((del, i) => (
                <div key={i} className="p-5 rounded-3xl bg-royalBlue-50/50 dark:bg-royalBlue-900/20 border border-royalBlue-100/10 hover:border-royalBlue-100/30 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="font-black text-base text-royalBlue-950 dark:text-white">{del.order}</div>
                    <del.icon size={18} className="text-royalBlue" />
                  </div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest pt-2 border-t border-royalBlue-100/10">
                    <span className="text-royalBlue">{del.status}</span>
                    <span className="text-royalBlue-400">{del.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Hidden Printable Component */}
      <PrintablePrescription prescription={printingPrescription} />
    </motion.div>
  );
}
