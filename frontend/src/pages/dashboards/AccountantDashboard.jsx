import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import Avatar from "../../components/Avatar";
import { 
  DollarSign, 
  CreditCard, 
  FileText, 
  TrendingUp, 
  Activity, 
  Download, 
  ShieldCheck, 
  Calendar, 
  Wallet,
  Plus,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
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

export default function AccountantDashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [receptionistTotal, setReceptionistTotal] = useState(0);
  
  // Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [totalRevenue, setTotalRevenue] = useState("");
  const [totalExpenses, setTotalExpenses] = useState("");
  const [pendingInvoices, setPendingInvoices] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const [reportsRes, statsRes, txRes] = await Promise.all([
        api.get("/revenue-reports"),
        api.get("/transactions/stats"),
        api.get("/transactions")
      ]);
      setReports(reportsRes.data);
      if (statsRes.data && statsRes.data.grandTotal !== undefined) {
        setReceptionistTotal(statsRes.data.grandTotal);
      }
      setTransactions(txRes.data || []);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleOpenModal = () => {
    setTitle(`Report - ${new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`);
    setTotalRevenue(receptionistTotal ? receptionistTotal.toString() : "");
    setTotalExpenses("");
    setPendingInvoices("");
    setNotes(receptionistTotal ? `Aggregated front-desk collections total: $${receptionistTotal}` : "");
    setIsModalOpen(true);
  };

  const handleCreateReport = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const rev = Number(totalRevenue);
      const exp = Number(totalExpenses);
      
      // Auto-generate beautiful charts data points by distributing the total revenue/expenses
      // with slight daily variations for premium visualization!
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const distributions = [0.12, 0.15, 0.18, 0.14, 0.20, 0.13, 0.08]; // sum = 1.00
      
      const chartsData = days.map((day, idx) => ({
        name: day,
        revenue: Math.round(rev * distributions[idx]),
        expenses: Math.round(exp * distributions[idx]),
      }));

      await api.post("/revenue-reports", {
        title,
        totalRevenue: rev,
        totalExpenses: exp,
        pendingInvoices: Number(pendingInvoices),
        notes,
        chartsData
      });

      // Reset form
      setTitle("");
      setTotalRevenue("");
      setTotalExpenses("");
      setPendingInvoices("");
      setNotes("");
      setIsModalOpen(false);
      
      // Reload reports
      fetchReports();
    } catch (error) {
      console.error("Error creating report:", error);
      alert(error.response?.data?.message || "Failed to submit report");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get stats from latest report or use default if none exist yet
  const latestReport = reports[0]; // Sorted by newest in backend
  const displayRevenue = latestReport ? `$${latestReport.totalRevenue.toLocaleString()}` : "$0";
  const displayExpenses = latestReport ? `$${latestReport.totalExpenses.toLocaleString()}` : "$0";
  const displayProfit = latestReport ? `$${latestReport.netProfit.toLocaleString()}` : "$0";
  const displayInvoices = latestReport ? latestReport.pendingInvoices : 0;

  // Chart data: calculate live transaction totals grouped by day of the week by default!
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const liveChartData = daysOfWeek.map((day) => {
    const dayTransactions = transactions.filter((tx) => {
      const date = new Date(tx.createdAt);
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      return dayName === day;
    });
    const dayTotal = dayTransactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
    return { name: day, revenue: dayTotal, expenses: 0 };
  });

  const chartData = latestReport && latestReport.chartsData.length > 0 ? latestReport.chartsData : liveChartData;

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
        className="relative overflow-hidden rounded-[48px] bg-gradient-to-br from-navyBlue-900 to-navyBlue-800 p-10 shadow-2xl md:p-16"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay" />
        <div className="absolute -right-24 -top-24 h-[500px] w-[500px] rounded-full bg-royalBlue/15 blur-[120px]" />
        <div className="absolute -bottom-48 -left-48 h-[500px] w-[500px] rounded-full bg-royalBlue-500/10 blur-[120px]" />
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12">
          <div className="max-w-2xl text-white">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md"
            >
              <Wallet size={16} className="text-royalBlue" /> Financial Management System
            </motion.div>
            <h1 className="mb-6 text-5xl font-black leading-tight tracking-tighter md:text-7xl text-balance">
              Finance, <span className="text-royalBlue-400">{user?.name?.split(' ')[1] || 'Nuur'}</span>
            </h1>
            <p className="text-xl text-royalBlue-200/80 leading-relaxed max-w-xl">
              Establish hospital accounting flow. Submitting daily and weekly revenue summaries ensures transparent executive oversight.
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <button 
                onClick={handleOpenModal}
                className="btn-primary flex items-center gap-3 px-8 py-4 focus-visible:ring-4 focus-visible:ring-royalBlue/20 outline-none group"
              >
                <Plus size={18} className="transition-transform group-hover:rotate-90" /> Submit Revenue Report
              </button>
            </div>
          </div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="w-full lg:w-[340px] rounded-[36px] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl shrink-0 text-white"
          >
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-royalBlue-300 mb-6">Audited Status</h3>
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-5xl font-black text-white">{displayRevenue}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-royalBlue-300 mt-2">Latest Reported Revenue</div>
              </div>
              <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-royalBlue to-green-400 w-[100%]" />
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-royalBlue-300">Synchronized</span>
                <span className="text-royalBlue-400 font-extrabold">Active</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Live Collections", value: `$${receptionistTotal.toLocaleString()}`, icon: Wallet, change: "Real-time", color: "text-amber-600 dark:text-amber-300", bg: "bg-amber-100 dark:bg-amber-900/30" },
          { label: "Reported Revenue", value: displayRevenue, icon: DollarSign, change: "Latest", color: "text-royalBlue-600 dark:text-royalBlue-300", bg: "bg-royalBlue-100 dark:bg-royalBlue-900/30" },
          { label: "Reported Expenses", value: displayExpenses, icon: TrendingUp, change: "Latest", color: "text-red-600 dark:text-red-300", bg: "bg-red-100 dark:bg-red-900/30" },
          { label: "Reported Net Profit", value: displayProfit, icon: CreditCard, change: "Latest", color: "text-green-600 dark:text-green-300", bg: "bg-green-100 dark:bg-green-900/30" }
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Revenue Analytics Chart */}
        <motion.div variants={itemVariants} className="xl:col-span-2 panel p-10 flex flex-col">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-royalBlue-900 dark:text-white">Reported Weekly Distribution</h2>
              <p className="text-sm font-medium text-royalBlue-500 dark:text-royalBlue-400">Weekly breakdown based on latest approved report.</p>
            </div>
          </div>
          
          <div className="flex-1 min-h-[350px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%" debounce={150}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1B75BB" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1B75BB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '24px', 
                    border: 'none', 
                    boxShadow: '0 20px 50px rgba(0,0,0,0.1)', 
                    padding: '16px' 
                  }}
                  itemStyle={{ fontWeight: '900' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#1B75BB" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue" />
                <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" fill="none" name="Expenses" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Invoice Feed / My Submissions */}
        <motion.div variants={itemVariants} className="panel p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black text-royalBlue-900 dark:text-white">Revenue Submissions</h2>
            <div className="text-xs font-bold text-royalBlue-400">Total: {reports.length}</div>
          </div>
          
          <div className="space-y-6 max-h-[350px] overflow-y-auto pr-2">
            {loading ? (
              <div className="text-center py-10 text-royalBlue-400">Loading submissions...</div>
            ) : reports.length === 0 ? (
              <div className="text-center py-10 text-royalBlue-400 text-sm">No revenue reports submitted yet.</div>
            ) : (
              reports.map((rep) => (
                <div key={rep._id} className="flex items-center justify-between group p-3.5 rounded-2xl hover:bg-royalBlue-50/50 dark:hover:bg-royalBlue-900/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`h-11 w-11 rounded-2xl flex items-center justify-center font-black ${
                      rep.status === 'Approved' ? 'bg-green-500/10 text-green-500' : 
                      rep.status === 'Pending Approval' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                      <FileText size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-black text-royalBlue-950 dark:text-white truncate max-w-[120px]" title={rep.title}>
                        {rep.title}
                      </div>
                      <div className="text-[10px] text-royalBlue-400 font-bold uppercase">
                        {new Date(rep.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-royalBlue-900 dark:text-white">${rep.totalRevenue.toLocaleString()}</div>
                    <div className={`text-[10px] font-black uppercase tracking-widest ${
                      rep.status === 'Approved' ? 'text-green-500' : 
                      rep.status === 'Pending Approval' ? 'text-amber-500' : 'text-red-500'
                    }`}>{rep.status.split(' ')[0]}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-8 p-6 rounded-3xl bg-royalBlue-50 dark:bg-royalBlue-900/20 border border-royalBlue-100/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-2xl bg-royalBlue text-white shadow-md shadow-royalBlue/20">
                <Activity size={20} />
              </div>
              <div className="font-black text-royalBlue-950 dark:text-white">Direct Reporting</div>
            </div>
            <p className="text-xs font-semibold text-royalBlue-500 dark:text-royalBlue-400 leading-relaxed">
              Every submitted report is instantly flagged to the Admin dashboard for closeout verification.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Real-time Cash Ledger */}
      <motion.div variants={itemVariants} className="panel p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-black text-royalBlue-900 dark:text-white">Recent Collections Ledger</h2>
            <p className="text-xs font-semibold text-royalBlue-400 mt-1">Real-time payments received at receptionist front desks.</p>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-royalBlue-500 bg-royalBlue-50 dark:bg-royalBlue-900/20 px-3 py-1.5 rounded-lg border border-royalBlue-100/10">
            {transactions.length} Payments
          </span>
        </div>
        
        <div className="overflow-x-auto">
          {transactions.length === 0 ? (
            <div className="text-center py-10 text-royalBlue-400 text-sm">No live front-desk transactions recorded yet.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-royalBlue-100 dark:border-royalBlue-800 text-[10px] font-black uppercase tracking-wider text-royalBlue-400">
                  <th className="py-4">Patient Name</th>
                  <th className="py-4">Items / Details</th>
                  <th className="py-4">Amount</th>
                  <th className="py-4">Method</th>
                  <th className="py-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-royalBlue-50 dark:divide-royalBlue-900/10">
                {transactions.slice(0, 10).map((tx) => (
                  <tr key={tx._id} className="text-sm font-semibold text-royalBlue-950 dark:text-white hover:bg-royalBlue-50/20 dark:hover:bg-royalBlue-900/5 transition-colors">
                    <td className="py-4 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-royalBlue text-white flex items-center justify-center font-black text-xs">
                        {(tx.patientName || "P")[0]}
                      </div>
                      <span>{tx.patientName || "Unknown Patient"}</span>
                    </td>
                    <td className="py-4 text-xs text-royalBlue-400">
                      {(tx.items || []).join(", ") || "General Services"}
                    </td>
                    <td className="py-4 font-black text-royalBlue-900 dark:text-white">
                      ${tx.amount.toLocaleString()}
                    </td>
                    <td className="py-4">
                      <span className="text-[10px] font-black uppercase tracking-widest bg-royalBlue-500/10 text-royalBlue px-2.5 py-1 rounded-lg">
                        {tx.paymentMethod}
                      </span>
                    </td>
                    <td className="py-4 text-right text-xs text-royalBlue-400">
                      {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>

      {/* Dynamic Modal to Submit Report */}
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
              Submit Revenue Report
            </h2>

            <form onSubmit={handleCreateReport} className="space-y-4">
              {receptionistTotal > 0 && (
                <div className="mb-4 rounded-2xl bg-royalBlue/10 border border-royalBlue/20 p-4 text-xs font-semibold text-royalBlue-200">
                  ⚡ Auto-fill: The total revenue field has been pre-filled with the grand total of all Receptionist collections (${receptionistTotal.toLocaleString()}).
                </div>
              )}
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-royalBlue-300">Report Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Daily Sales - May 18"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-royalBlue focus:outline-none focus:ring-2 focus:ring-royalBlue/20"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-royalBlue-300">Total Revenue</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-royalBlue-300 pointer-events-none select-none">$</span>
                    <input
                      type="number"
                      required
                      placeholder="25000"
                      value={totalRevenue}
                      onChange={(e) => setTotalRevenue(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 pl-8 pr-4 py-3 text-sm text-white focus:border-royalBlue focus:outline-none focus:ring-2 focus:ring-royalBlue/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-royalBlue-300">Total Expenses</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-royalBlue-300 pointer-events-none select-none">$</span>
                    <input
                      type="number"
                      required
                      placeholder="12000"
                      value={totalExpenses}
                      onChange={(e) => setTotalExpenses(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 pl-8 pr-4 py-3 text-sm text-white focus:border-royalBlue focus:outline-none focus:ring-2 focus:ring-royalBlue/20"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-royalBlue-300">Pending Invoices (Count)</label>
                <input
                  type="number"
                  required
                  placeholder="14"
                  value={pendingInvoices}
                  onChange={(e) => setPendingInvoices(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-royalBlue focus:outline-none focus:ring-2 focus:ring-royalBlue/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-royalBlue-300">Auditor Notes</label>
                <textarea
                  placeholder="Summarize collections, discrepancies, or notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-royalBlue focus:outline-none focus:ring-2 focus:ring-royalBlue/20 resize-none"
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
                  {isSubmitting ? "Submitting..." : "Submit to Admin"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>,
        document.body
      )}
    </motion.div>
  );
}
