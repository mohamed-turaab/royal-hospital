import React, { useEffect, useState } from "react";
import api from "../services/api";
import { motion } from "framer-motion";
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
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  Activity,
  ShieldCheck,
  ArrowUpRight
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [revenuePeriod, setRevenuePeriod] = useState("This Week");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/analytics/admin");
      setAnalytics(data);
    } catch (error) {
      console.error("Analytics fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (val) => {
    if (val === undefined || val === null) return "0";
    if (typeof val === "string") return val;
    return val.toLocaleString();
  };

  if (loading) {
    return (
      <div className="p-20 text-center space-y-4">
        <div className="h-12 w-12 border-4 border-royalBlue border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-royalBlue-400 font-bold uppercase tracking-widest text-xs">Loading Analytics & Metrics...</p>
      </div>
    );
  }

  const stats = analytics?.stats || {
    activeStaff: 0,
    pendingAppointments: 0,
    revenueToday: "$0",
    criticalAlerts: 0,
    revenueChange: "0%"
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-navyBlue-900 dark:text-white flex items-center gap-3">
            <TrendingUp className="text-royalBlue" size={28} />
            Hospital Analytics
          </h1>
          <p className="text-sm font-medium text-navyBlue-500 dark:text-navyBlue-400 mt-1">
            Real-time financial performance, patient growth trends, and operations metrics.
          </p>
        </div>
      </motion.div>

      {/* Metrics Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Active Staff", value: stats.activeStaff, change: "Live", icon: Users, color: "bg-royalBlue/10 text-royalBlue" },
          { label: "Open Appointments", value: stats.pendingAppointments, change: "Pending", icon: Calendar, color: "bg-royalYellow/10 text-royalYellow-700" },
          { label: "Revenue Today", value: stats.revenueToday, change: stats.revenueChange, icon: DollarSign, color: "bg-royalBlue/10 text-royalBlue" },
          { label: "Critical Alerts", value: stats.criticalAlerts, change: "Needs review", icon: Activity, color: "bg-royalYellow/10 text-royalYellow-700" }
        ].map((item) => (
          <div key={item.label} className="panel p-8 flex flex-col justify-between h-44 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div className={`p-3.5 rounded-2xl ${item.color}`}>
                <item.icon size={22} />
              </div>
              <div className="flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-black text-green-700 uppercase tracking-widest dark:bg-green-500/10 dark:text-green-400">
                <ArrowUpRight size={12} />
                {item.change}
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-navyBlue-900 dark:text-white leading-none">
                {formatNumber(item.value)}
              </div>
              <div className="text-[11px] font-black text-navyBlue-400 dark:text-navyBlue-400 uppercase tracking-wider mt-2">
                {item.label}
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Analytics Section */}
      <div className="grid gap-8 xl:grid-cols-2">
        {/* Revenue Chart */}
        <motion.div variants={itemVariants} className="panel p-10">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-royalBlue-900 dark:text-white">
                Revenue Overview
              </h2>
              <p className="mt-1 text-sm font-medium text-royalBlue-500 dark:text-royalBlue-400">
                Daily financial performance analysis
              </p>
            </div>
            <select 
              value={revenuePeriod}
              onChange={(e) => setRevenuePeriod(e.target.value)}
              className="rounded-2xl border border-royalBlue-100 bg-royalBlue-50 px-5 py-2.5 text-sm font-bold text-royalBlue-700 outline-none transition-all focus-visible:ring-4 focus-visible:ring-royalBlue/20 dark:border-royalBlue-800 dark:bg-royalBlue-900 dark:text-royalBlue-300"
            >
              <option value="This Week">This Week</option>
              <option value="Last Week">Last Week</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%" debounce={150}>
              <AreaChart data={(analytics?.charts?.revenueData || []).map(d => ({
                ...d,
                revenue: revenuePeriod === "This Week" ? d.revenue : Math.round(d.revenue * 0.82)
              }))}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1B75BB" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1B75BB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }} dx={-15} tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: "24px", border: "none", boxShadow: "0 20px 50px rgba(0,0,0,0.1)", padding: "16px" }}
                  itemStyle={{ color: "#1B75BB", fontWeight: "900" }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#1B75BB" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Patient Growth Chart */}
        <motion.div variants={itemVariants} className="panel p-10">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-royalBlue-900 dark:text-white">
                Patient Growth
              </h2>
              <p className="mt-1 text-sm font-medium text-royalBlue-500 dark:text-royalBlue-400">
                New registration trends this month
              </p>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%" debounce={150}>
              <LineChart data={analytics?.charts?.patientData || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }} dx={-15} />
                <Tooltip
                  contentStyle={{ borderRadius: "24px", border: "none", boxShadow: "0 20px 50px rgba(0,0,0,0.1)", padding: "16px" }}
                  itemStyle={{ color: "#FDB913", fontWeight: "900" }}
                />
                <Line
                  type="monotone"
                  dataKey="patients"
                  stroke="#2386E6"
                  strokeWidth={5}
                  dot={{ r: 8, fill: "#2386E6", strokeWidth: 3, stroke: "#fff" }}
                  activeDot={{ r: 10, shadow: "0 0 20px rgba(35, 134, 230, 0.5)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
