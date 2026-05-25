import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { 
  Search, 
  DollarSign, 
  CreditCard, 
  Wallet, 
  Activity, 
  CheckCircle, 
  Plus, 
  User, 
  Pill, 
  Calendar, 
  UserRound, 
  FileText, 
  X,
  ShieldCheck,
  Stethoscope
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

export default function BillingCheckout() {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [unpaidBills, setUnpaidBills] = useState([]);
  const [patientBillSummary, setPatientBillSummary] = useState({});
  const [selectedBillIds, setSelectedBillIds] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");



  const fetchPatients = async () => {
    try {
      const [{ data: patientData }, { data: unpaidData }] = await Promise.all([
        api.get("/patients"),
        api.get("/bills?status=Unpaid"),
      ]);

      const summary = unpaidData.reduce((acc, bill) => {
        const patientId = bill.patient?._id || bill.patient;
        if (!patientId) return acc;

        const createdAt = bill.createdAt ? new Date(bill.createdAt).getTime() : 0;
        const existing = acc[patientId] || { count: 0, total: 0, latestAt: 0 };
        acc[patientId] = {
          count: existing.count + 1,
          total: existing.total + Number(bill.amount || 0),
          latestAt: Math.max(existing.latestAt, createdAt),
        };
        return acc;
      }, {});

      const sortedPatients = [...patientData].sort((a, b) => {
        const aSummary = summary[a._id];
        const bSummary = summary[b._id];
        const aHasDue = Boolean(aSummary);
        const bHasDue = Boolean(bSummary);

        if (aHasDue && bHasDue) return bSummary.latestAt - aSummary.latestAt;
        if (aHasDue) return -1;
        if (bHasDue) return 1;
        return (a.name || a.user?.name || "").localeCompare(b.name || b.user?.name || "");
      });

      setPatientBillSummary(summary);
      setPatients(sortedPatients);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatientBills = async (patientId) => {
    if (!patientId) {
      setUnpaidBills([]);
      setSelectedBillIds([]);
      return;
    }
    try {
      setLoading(true);
      const { data } = await api.get(`/bills?patientId=${patientId}&status=Unpaid`);
      setUnpaidBills(data);
      // Auto-select all bills by default
      setSelectedBillIds(data.map(b => b._id));
    } catch (error) {
      console.error("Error fetching patient bills:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSelect = (patientId) => {
    setSelectedPatientId(patientId);
    fetchPatientBills(patientId);
    setSuccessMsg("");
  };

  const handleToggleBillSelection = (billId) => {
    if (selectedBillIds.includes(billId)) {
      setSelectedBillIds(selectedBillIds.filter(id => id !== billId));
    } else {
      setSelectedBillIds([...selectedBillIds, billId]);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (selectedBillIds.length === 0) return alert("Please select at least one item to checkout");

    try {
      setLoading(true);
      const { data } = await api.post("/bills/checkout", {
        billIds: selectedBillIds,
        paymentMethod
      });

      setSuccessMsg(`Successfully processed $${data.totalPaid} checkout!`);
      // Clear selections and refresh
      setSelectedBillIds([]);
      fetchPatientBills(selectedPatientId);
      fetchPatients();
    } catch (error) {
      console.error("Checkout failed:", error);
      alert(error.response?.data?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };



  // Filter patients based on query
  const filteredPatients = patients.filter(p => {
    const pName = p.name || p.user?.name || "";
    return pName.toLowerCase().includes(searchQuery.toLowerCase()) || 
           p._id.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalAmount = unpaidBills
    .filter(b => selectedBillIds.includes(b._id))
    .reduce((sum, b) => sum + b.amount, 0);

  const getItemIcon = (type) => {
    switch (type) {
      case "Medicine": return <Pill size={16} className="text-royalBlue" />;
      case "Lab Test": return <Activity size={16} className="text-amber-500" />;
      case "Surgery": return <Stethoscope size={16} className="text-red-500" />;
      default: return <FileText size={16} className="text-gray-400" />;
    }
  };

  const formatBillDate = (date) => {
    if (!date) return "Today";
    return new Date(date).toLocaleDateString();
  };

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
        className="relative overflow-hidden rounded-[28px] sm:rounded-[40px] lg:rounded-[48px] bg-royalBlue-950 p-6 sm:p-10 md:p-16 text-white shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-royalBlue/20 to-transparent blur-3xl opacity-50" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-royalYellow/10 rounded-full blur-[100px]" />
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-8 lg:gap-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-white/10 border border-white/20 text-royalYellow text-[10px] font-black uppercase tracking-[0.3em] mb-6 sm:mb-8 backdrop-blur-md">
              <ShieldCheck size={16} /> Checkout & Register Till
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter mb-4 sm:mb-6">
              Billing & Checkout
            </h1>
            <p className="text-royalBlue-200/80 text-base sm:text-xl leading-relaxed max-w-xl">
              Select a patient to retrieve all pending charges (Medicines, Lab Tests, and Surgeries), collect payments, and sync accounts.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Main Billing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Patient Selection Column */}
        <motion.div variants={itemVariants} className="panel p-8">
          <h2 className="text-xl font-black text-royalBlue-900 dark:text-white mb-6">Find Patient</h2>
          
          <div className="relative group mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-royalBlue-400 group-focus-within:text-royalBlue transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search patient name or ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-navyBlue-100 bg-white pl-10 pr-4 py-3 text-sm font-semibold text-navyBlue-900 outline-none transition-all focus:border-royalBlue dark:border-navyBlue-800 dark:bg-navyBlue-900/40 dark:text-white"
            />
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {filteredPatients.map(p => (
              (() => {
                const due = patientBillSummary[p._id];
                return (
              <button
                key={p._id}
                onClick={() => handlePatientSelect(p._id)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${
                  selectedPatientId === p._id
                    ? "bg-royalBlue text-white border-royalBlue shadow-lg shadow-royalBlue/20"
                    : "border-royalBlue-50 hover:bg-royalBlue-50/50 dark:border-royalBlue-800/40 dark:hover:bg-royalBlue-900/10 text-royalBlue-950 dark:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold ${
                    selectedPatientId === p._id ? "bg-white/20 text-white" : "bg-royalBlue/10 text-royalBlue"
                  }`}>
                    <UserRound size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-black truncate max-w-[120px]">{p.name || p.user?.name}</div>
                    <div className={`text-[10px] ${selectedPatientId === p._id ? "text-royalBlue-200" : "text-royalBlue-400"}`}>ID: {p._id.slice(-6).toUpperCase()}</div>
                  </div>
                </div>
                <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                  selectedPatientId === p._id ? "bg-white/20" : "bg-royalBlue-50/50 dark:bg-royalBlue-900/20"
                }`}>
                  {due ? `$${due.total}` : (p.gender || "Stable")}
                </div>
              </button>
                );
              })()
            ))}
            {filteredPatients.length === 0 && (
              <div className="text-center py-10 text-royalBlue-400 text-sm">No matching patients identified.</div>
            )}
          </div>
        </motion.div>

        {/* Checkout List Column */}
        <motion.div variants={itemVariants} className="lg:col-span-2 panel p-8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-black text-royalBlue-900 dark:text-white">Unpaid Ledger</h2>
                <p className="text-sm font-semibold text-royalBlue-400 mt-1">Pending charges ready for checkout.</p>
              </div>

            </div>

            {successMsg && (
              <div className="mb-6 flex items-center gap-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-600 dark:text-emerald-400 text-sm font-bold">
                <CheckCircle size={18} /> {successMsg}
              </div>
            )}

            {!selectedPatientId ? (
              <div className="py-20 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-royalBlue-50 dark:bg-royalBlue-900/20 flex items-center justify-center mb-4 text-royalBlue-300">
                  <User size={28} />
                </div>
                <h3 className="text-xl font-black text-royalBlue-900 dark:text-white mb-1">No Patient Selected</h3>
                <p className="text-royalBlue-400 text-sm">Please select a patient from the ledger to load their billing data.</p>
              </div>
            ) : loading ? (
              <div className="text-center py-20 text-royalBlue-400 font-bold">Retrieving patient billing details...</div>
            ) : unpaidBills.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mb-4 text-green-500">
                  <CheckCircle size={28} />
                </div>
                <h3 className="text-xl font-black text-royalBlue-900 dark:text-white mb-1">Account Balanced</h3>
                <p className="text-royalBlue-400 text-sm">All invoices paid! Patient has no outstanding charges.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 mb-6">
                {unpaidBills.map((bill) => (
                  <div 
                    key={bill._id} 
                    onClick={() => handleToggleBillSelection(bill._id)}
                    className={`flex items-center justify-between p-5 rounded-3xl border transition-all cursor-pointer ${
                      selectedBillIds.includes(bill._id)
                        ? "bg-royalBlue/5 border-royalBlue"
                        : "border-royalBlue-50 dark:border-royalBlue-800/40 hover:bg-royalBlue-50/20 dark:hover:bg-royalBlue-900/10"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <input 
                        type="checkbox" 
                        checked={selectedBillIds.includes(bill._id)}
                        onChange={() => {}} // Handled by outer container click
                        className="rounded-lg border-royalBlue text-royalBlue focus:ring-royalBlue h-4 w-4 shrink-0"
                      />
                      <div className="h-11 w-11 rounded-2xl bg-royalBlue/10 flex items-center justify-center shrink-0">
                        {getItemIcon(bill.itemType)}
                      </div>
                      <div>
                        <div className="text-sm font-black text-royalBlue-950 dark:text-white">{bill.itemName}</div>
                        <div className="text-xs font-semibold text-royalBlue-400">
                          Reason: <span className="font-extrabold text-royalBlue-500">{bill.itemType}</span>
                          <span className="px-1">|</span>
                          Ordered by {bill.orderedBy || "Clinical Staff"}
                        </div>
                        <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-navyBlue-400">
                          Date: {formatBillDate(bill.createdAt)}
                        </div>
                        <div className="text-xs font-semibold text-royalBlue-400">By {bill.orderedBy} • Type: <span className="font-extrabold uppercase text-[10px]">{bill.itemType}</span></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-black text-royalBlue-950 dark:text-white">${bill.amount}</div>
                      <div className="text-[10px] font-bold text-red-500 uppercase">Unpaid</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedPatientId && unpaidBills.length > 0 && (
            <form onSubmit={handleCheckout} className="border-t border-royalBlue-50 dark:border-royalBlue-800/40 pt-6 mt-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-royalBlue-400">Total Checkout Amount</div>
                  <div className="text-4xl font-black text-royalBlue-900 dark:text-white mt-1">${totalAmount.toLocaleString()}</div>
                </div>

                <div className="flex items-center gap-2 rounded-2xl border border-navyBlue-100 bg-white p-1.5 dark:border-navyBlue-800 dark:bg-navyBlue-900/40 shadow-sm">
                  {[
                    { label: "Cash", icon: Wallet },
                    { label: "Card", icon: CreditCard },
                    { label: "Mobile Money", icon: DollarSign }
                  ].map(m => (
                    <button
                      key={m.label}
                      type="button"
                      onClick={() => setPaymentMethod(m.label)}
                      className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
                        paymentMethod === m.label 
                          ? "bg-royalBlue text-white shadow-md shadow-royalBlue/30" 
                          : "text-royalBlue-400 hover:text-royalBlue dark:text-navyBlue-300 dark:hover:text-white hover:bg-navyBlue-50/50"
                      }`}
                    >
                      <m.icon size={14} />
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || selectedBillIds.length === 0}
                className="w-full btn-primary py-4 rounded-3xl font-black text-base shadow-xl shadow-royalBlue/30 tracking-wider flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 transition-all"
              >
                <CheckCircle size={20} /> Pay Outstanding Charges (${totalAmount})
              </button>
            </form>
          )}
        </motion.div>
      </div>


    </motion.div>
  );
}
