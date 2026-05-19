import React, { useState, useEffect } from "react";
import api from "../../services/api";
import Avatar from "../../components/Avatar";
import { 
  Pill, 
  Search, 
  CheckCircle2, 
  ClipboardList, 
  ShieldCheck, 
  Clock, 
  AlertCircle 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function PharmacistPrescriptions() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All"); // All, Paid, Dispensed

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/prescriptions");
      // Load both paid and dispensed prescriptions
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
      await api.patch(`/prescriptions/${id}/status`, { status: "Dispensed" });
      fetchPrescriptions(); // Refresh
    } catch (error) {
      console.error("Error dispensing prescription:", error);
      alert("Failed to dispense medication");
    }
  };

  const filteredQueue = queue.filter(item => {
    const pName = item.patientName || item.patient?.name || "Unknown Patient";
    const dName = item.doctor?.name || "Doctor";
    const medNames = (item.medicines || []).map(m => m.name).join(", ");
    
    const matchesSearch = pName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          dName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          medNames.toLowerCase().includes(searchTerm.toLowerCase());
                          
    const matchesFilter = filterStatus === "All" ||
                          (filterStatus === "Paid" && item.status === "Pending Pharmacy") ||
                          (filterStatus === "Dispensed" && item.status === "Dispensed");
                          
    return matchesSearch && matchesFilter;
  });

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 animate-fade-in"
    >
      {/* Hero Header */}
      <motion.section 
        variants={itemVariants}
        className="relative overflow-hidden rounded-[28px] sm:rounded-[40px] lg:rounded-[48px] bg-gradient-to-br from-navyBlue-900 to-navyBlue-800 p-6 sm:p-10 md:p-16 shadow-2xl"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay" />
        <div className="absolute -right-24 -top-24 h-[400px] w-[400px] rounded-full bg-royalBlue/15 blur-[120px]" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-royalYellow-300 backdrop-blur-md">
              <Pill size={14} /> Dispensing Portal
            </div>
            <h1 className="mb-4 text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tighter text-white">
              Medication Queue
            </h1>
            <p className="text-sm sm:text-base text-royalBlue-200/80 leading-relaxed max-w-xl">
              Track and dispense prescriptions that have been settled at the billing counter in real-time.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-2xl shadow-xl shrink-0">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-royalBlue-300 mb-2">Queue Statistics</div>
            <div className="flex gap-8">
              <div>
                <div className="text-3xl font-black text-white">{queue.filter(p => p.status === 'Pending Pharmacy').length}</div>
                <div className="text-[10px] font-bold text-royalBlue-200 uppercase tracking-wider">Awaiting Dispense</div>
              </div>
              <div className="w-px bg-white/10" />
              <div>
                <div className="text-3xl font-black text-green-400">{queue.filter(p => p.status === 'Dispensed').length}</div>
                <div className="text-[10px] font-bold text-royalBlue-200 uppercase tracking-wider">Completed Today</div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Filter and Control Area */}
      <motion.section variants={itemVariants} className="panel p-6 sm:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-wrap gap-2">
            {[
              { label: "All Orders", status: "All" },
              { label: "Paid & Ready", status: "Paid" },
              { label: "Dispensed Logs", status: "Dispensed" }
            ].map(btn => (
              <button
                key={btn.status}
                onClick={() => setFilterStatus(btn.status)}
                className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
                  filterStatus === btn.status
                    ? "bg-royalBlue text-white shadow-md shadow-royalBlue/20"
                    : "bg-royalBlue-50 text-royalBlue-500 hover:bg-royalBlue-100 dark:bg-royalBlue-900/40 dark:text-royalBlue-300 dark:hover:bg-royalBlue-900/60"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
          
          <div className="w-full md:w-80 flex items-center gap-3 rounded-2xl border border-royalBlue-100 bg-royalBlue-50/50 px-4 py-3 dark:border-royalBlue-800 dark:bg-royalBlue-900/20 focus-within:ring-4 focus-within:ring-royalBlue/10 transition-all">
            <Search size={18} className="text-royalBlue-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search patient, doctor, drug..." 
              className="bg-transparent text-sm font-semibold outline-none w-full text-royalBlue-900 dark:text-white placeholder-royalBlue-300 dark:placeholder-royalBlue-600" 
            />
          </div>
        </div>

        {/* Prescription Queue List */}
        <div className="mt-8 space-y-6">
          {loading ? (
            <div className="text-center py-20">
              <div className="h-12 w-12 border-4 border-royalBlue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-royalBlue-400 font-bold uppercase tracking-widest text-xs">Loading queue...</p>
            </div>
          ) : filteredQueue.length === 0 ? (
            <div className="text-center py-16 rounded-3xl border border-dashed border-royalBlue-100 dark:border-royalBlue-800 p-8">
              <ClipboardList size={48} className="text-royalBlue-200 mx-auto mb-4" />
              <h3 className="text-xl font-black text-royalBlue-900 dark:text-white mb-1">No Active Orders</h3>
              <p className="text-royalBlue-400 text-sm max-w-sm mx-auto">There are no paid prescriptions matching this status waiting in the queue.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredQueue.map((p, idx) => {
                const pName = p.patientName || p.patient?.name || "Unknown Patient";
                const dName = p.doctor?.name || "Doctor";
                const medicines = p.medicines || [];

                return (
                  <div 
                    key={p._id || idx} 
                    className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-6 sm:p-8 rounded-3xl border border-royalBlue-50 dark:border-royalBlue-800/40 hover:bg-royalBlue-50/20 dark:hover:bg-royalBlue-900/5 transition-all gap-6 bg-white dark:bg-navyBlue-900/40"
                  >
                    <div className="flex items-start sm:items-center gap-5 w-full lg:w-auto">
                      <div className="h-14 w-14 rounded-2xl bg-royalBlue text-white flex items-center justify-center font-black text-xl shadow-md shadow-royalBlue/20 shrink-0">
                        {pName[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-black text-lg text-royalBlue-900 dark:text-white truncate">{pName}</div>
                        <div className="text-xs font-bold text-royalBlue-400 mt-1 flex flex-wrap items-center gap-2">
                          <span>Ordered by: <strong className="text-royalBlue-600 dark:text-royalBlue-300 font-extrabold">{dName}</strong></span>
                          <span>•</span>
                          <span className="flex items-center gap-1"><Clock size={12} /> {new Date(p.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>

                    {/* Medicines List Panel */}
                    <div className="flex-1 w-full border-t border-b border-royalBlue-50/50 dark:border-royalBlue-800/20 py-4 lg:py-0 lg:border-t-0 lg:border-b-0 px-0 lg:px-8">
                      <div className="text-[10px] font-black uppercase tracking-widest text-royalBlue-400 mb-2">Prescribed Medicines</div>
                      <div className="flex flex-wrap gap-2">
                        {medicines.map((m, mIdx) => (
                          <div 
                            key={mIdx} 
                            className="flex items-center gap-2 rounded-xl bg-royalBlue-50/50 dark:bg-royalBlue-900/30 border border-royalBlue-100/10 px-3.5 py-2 text-xs font-extrabold text-royalBlue-900 dark:text-royalBlue-100"
                          >
                            <Pill size={12} className="text-royalBlue" />
                            <span>{m.name}</span>
                            <span className="opacity-40">•</span>
                            <span className="text-[10px] font-black text-royalBlue-500 uppercase">{m.dosage}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center justify-between lg:justify-end gap-6 w-full lg:w-auto shrink-0">
                      <div className="text-left">
                        {p.status === 'Dispensed' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-green-500/10 text-green-500 border border-green-500/20">
                            <CheckCircle2 size={12} /> Dispensed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-500 border border-blue-500/20">
                            <Clock size={12} /> Paid & Ready
                          </span>
                        )}
                      </div>

                      {p.status !== 'Dispensed' ? (
                        <button 
                          onClick={() => handleProcessMed(p._id)}
                          className="btn-primary py-3 px-8 rounded-2xl text-xs font-black transition-all shadow-md shadow-royalBlue/20"
                        >
                          Dispense Medicine
                        </button>
                      ) : (
                        <div className="text-xs font-bold text-royalBlue-400 flex items-center gap-1">
                          <CheckCircle2 size={16} className="text-green-500" /> Completed
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.section>
    </motion.div>
  );
}
