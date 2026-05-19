import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { 
  Users, 
  ClipboardList, 
  TrendingUp, 
  Calendar, 
  Activity, 
  Search, 
  Filter, 
  Stethoscope, 
  Pill, 
  HeartPulse, 
  AlertTriangle, 
  FilePlus, 
  PhoneCall, 
  ArrowRight,
  Heart
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

const weeklyActivityData = [
  { name: "Mon", consultations: 12, surgeries: 2, emergency: 1 },
  { name: "Tue", consultations: 18, surgeries: 4, emergency: 0 },
  { name: "Wed", consultations: 15, surgeries: 1, emergency: 3 },
  { name: "Thu", consultations: 22, surgeries: 5, emergency: 1 },
  { name: "Fri", consultations: 30, surgeries: 3, emergency: 2 },
  { name: "Sat", consultations: 25, surgeries: 2, emergency: 0 },
  { name: "Sun", consultations: 10, surgeries: 0, emergency: 0 },
];

const recoveryData = [
  { name: "Fully Recovered", value: 65, color: "#10b981" },
  { name: "In Progress", value: 25, color: "#2386E6" },
  { name: "Critical", value: 10, color: "#ef4444" },
];

const criticalPatients = [
  { id: "PT-9921", name: "Michael Chen", condition: "Cardiac Arrhythmia", room: "ICU - Bed 3", hr: 110, bp: "145/95", time: "10 mins ago" },
  { id: "PT-1158", name: "Robert Wilson", condition: "Pneumonia / Low O2", room: "Ward A - 201", hr: 95, bp: "130/85", time: "1 hr ago" }
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

// Helper to format large numbers
const formatNumber = (num) => {
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
  return num;
};

export default function DoctorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
        {/* Carbon texture layer */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay" />
        {/* Glow Effects */}
        <div className="absolute -right-24 -top-24 h-[500px] w-[500px] rounded-full bg-royalBlue/15 blur-[120px]" />
        <div className="absolute -bottom-48 -left-48 h-[500px] w-[500px] rounded-full bg-royalBlue-500/10 blur-[120px]" />
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12">
          <div className="max-w-2xl text-white">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md"
            >
              <Activity size={16} className="text-royalBlue" />
              Medical Portal Dashboard
            </motion.div>
            <h1 className="mb-6 text-5xl font-black leading-tight tracking-tighter md:text-7xl text-balance">
              Welcome back, <span className="text-royalBlue-400">Dr. {user?.name?.split(' ')[1] || 'Doctor'}</span>
            </h1>
            <p className="text-xl text-royalBlue-200/80 leading-relaxed max-w-xl">
              Your clinical workspace is ready. You have <span className="text-white font-black">8 appointments</span> scheduled for today and <span className="text-red-400 font-black">2 critical patients</span> require attention.
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <button 
                onClick={() => navigate("/doctor/appointments")}
                className="btn-primary flex items-center gap-3 px-8 py-4 focus-visible:ring-4 focus-visible:ring-royalBlue/20 outline-none"
              >
                <Calendar size={18} /> View Schedule
              </button>
              <button 
                onClick={() => navigate("/doctor/prescriptions")}
                className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:scale-105 focus-visible:ring-4 focus-visible:ring-royalBlue/30 outline-none active:scale-95"
              >
                <ClipboardList size={18} /> Write Prescription
              </button>
            </div>
          </div>

          {/* Doctor Info Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="w-full lg:w-[360px] rounded-[40px] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl shrink-0"
          >
            <div className="flex items-center gap-5 mb-8 border-b border-white/10 pb-6">
              <Avatar src={user?.profileImage} name={user?.name} size="h-16 w-16 shadow-lg ring-2 ring-royalBlue/50" />
              <div>
                <div className="text-lg font-black text-white">{user?.name}</div>
                <div className="text-xs font-black uppercase tracking-widest text-royalBlue-300">Chief Surgeon</div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-royalBlue-200 font-semibold">Duty Status</span>
                <span className="flex items-center gap-2 font-black text-green-400 uppercase tracking-wider text-xs bg-green-500/20 px-3.5 py-1 rounded-full">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]" /> On Duty
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-royalBlue-200 font-semibold">Today's Load</span>
                <span className="font-black text-white">85% Complete</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-royalBlue to-green-400 w-[85%]" />
              </div>
            </div>
            <div className="mt-6 text-xs text-royalBlue-300">
              {now.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })} – {now.toLocaleTimeString()}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          { label: "Total Patients", value: 1284, icon: Users, change: "+12%", color: "text-royalBlue-600 dark:text-royalBlue-300", bg: "bg-royalBlue-100 dark:bg-royalBlue-900/30" },
          { label: "Today's Appts", value: 24, icon: Calendar, change: "Active", color: "text-blue-600 dark:text-blue-300", bg: "bg-blue-100 dark:bg-blue-900/30" },
          { label: "Completed", value: 16, icon: ClipboardList, change: "Today", color: "text-green-600 dark:text-green-300", bg: "bg-green-100 dark:bg-green-900/30" },
          { label: "Critical Cases", value: 2, icon: AlertTriangle, change: "Review", color: "text-red-600 dark:text-red-300", bg: "bg-red-100 dark:bg-red-900/30", glow: true },
          { label: "Pending Signoffs", value: 5, icon: TrendingUp, change: "Needs Sign", color: "text-orange-600 dark:text-orange-300", bg: "bg-orange-100 dark:bg-orange-900/30" }
        ].map((stat, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.02 }}
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
            <div className="text-3xl font-black text-royalBlue-900 dark:text-white mb-1">
              {formatNumber(stat.value)}
            </div>
            <div className="text-[11px] font-black uppercase tracking-wider text-royalBlue-500 dark:text-royalBlue-400">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Main Analytics Chart */}
        <motion.div variants={itemVariants} className="xl:col-span-2 panel p-10 flex flex-col">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-royalBlue-900 dark:text-white">Weekly Patient Activity</h2>
              <p className="text-sm font-medium text-royalBlue-500 dark:text-royalBlue-400">Consultations vs Surgeries vs Emergencies</p>
            </div>
            <select className="rounded-2xl border border-royalBlue-100 bg-royalBlue-50 px-5 py-2.5 text-sm font-bold text-royalBlue-700 outline-none transition-all focus-visible:ring-4 focus-visible:ring-royalBlue/20 dark:border-royalBlue-800 dark:bg-royalBlue-900 dark:text-royalBlue-300">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          
          <div className="flex-1 min-h-[350px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%" debounce={150}>
              <AreaChart data={weeklyActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorConsults" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1B75BB" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1B75BB" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEmerg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
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
                <Area type="monotone" dataKey="consultations" stroke="#1B75BB" strokeWidth={4} fillOpacity={1} fill="url(#colorConsults)" name="Consultations" />
                <Area type="monotone" dataKey="emergency" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorEmerg)" name="Emergencies" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quick Actions & Recovery Rate */}
        <div className="space-y-8">
          <motion.div variants={itemVariants} className="panel p-8">
            <h2 className="text-xl font-black text-royalBlue-900 dark:text-white mb-6">Quick Tools</h2>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => navigate("/doctor/prescriptions")}
                className="flex flex-col items-center justify-center p-5 rounded-3xl bg-royalBlue-50 hover:bg-royalBlue hover:text-white dark:bg-royalBlue-900/20 dark:hover:bg-royalBlue text-royalBlue-700 dark:text-royalBlue-300 transition-all border border-royalBlue-100/20 hover:scale-105 group"
              >
                <FilePlus size={26} className="mb-3 text-royalBlue group-hover:text-white transition-colors" />
                <span className="text-xs font-black text-center">New Prescription</span>
              </button>
              <button 
                onClick={() => navigate("/doctor/reports")}
                className="flex flex-col items-center justify-center p-5 rounded-3xl bg-green-50 hover:bg-green-500 hover:text-white dark:bg-green-950/20 dark:hover:bg-green-500 text-green-700 dark:text-green-300 transition-all border border-green-100/20 hover:scale-105 group"
              >
                <Stethoscope size={26} className="mb-3 text-green-500 group-hover:text-white transition-colors" />
                <span className="text-xs font-black text-center">Add Diagnosis</span>
              </button>
              <button 
                onClick={() => navigate("/doctor/appointments")}
                className="flex flex-col items-center justify-center p-5 rounded-3xl bg-purple-50 hover:bg-purple-500 hover:text-white dark:bg-purple-950/20 dark:hover:bg-purple-500 text-purple-700 dark:text-purple-300 transition-all border border-purple-100/20 hover:scale-105 group"
              >
                <Calendar size={26} className="mb-3 text-purple-500 group-hover:text-white transition-colors" />
                <span className="text-xs font-black text-center">Book Appt</span>
              </button>
              <button 
                onClick={() => navigate("/doctor/patients")}
                className="flex flex-col items-center justify-center p-5 rounded-3xl bg-orange-50 hover:bg-orange-500 hover:text-white dark:bg-orange-950/20 dark:hover:bg-orange-500 text-orange-700 dark:text-orange-300 transition-all border border-orange-100/20 hover:scale-105 group"
              >
                <Activity size={26} className="mb-3 text-orange-500 group-hover:text-white transition-colors" />
                <span className="text-xs font-black text-center">Update Vitals</span>
              </button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="panel p-8">
            <h2 className="text-xl font-black text-royalBlue-900 dark:text-white mb-4">Patient Recovery Rate</h2>
            <div className="h-[200px] w-full relative">
              <ResponsiveContainer width="100%" height="100%" debounce={150}>
                <PieChart>
                  <Pie
                    data={recoveryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={6}
                    dataKey="value"
                    stroke="none"
                  >
                    {recoveryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-royalBlue-900 dark:text-white">65%</span>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-500">Recovered</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Emergency Alerts */}
        <motion.div variants={itemVariants} className="panel overflow-hidden border border-red-500/20 dark:border-red-500/30">
          <div className="p-8 bg-gradient-to-r from-red-500/10 to-transparent border-b border-red-500/10 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-red-500 text-white rounded-2xl animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                <AlertTriangle size={22} />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-royalBlue-900 dark:text-white">Emergency Alerts</h2>
            </div>
            <span className="bg-red-500 text-white text-xs font-black px-4 py-1.5 rounded-xl uppercase tracking-widest">2 Critical</span>
          </div>
          
          <div className="p-8 space-y-6">
            <AnimatePresence>
              {criticalPatients.map((patient, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-6 rounded-3xl bg-red-50 dark:bg-red-900/10 border border-red-100/50 dark:border-red-900/30 hover:border-red-300 dark:hover:border-red-500/50 transition-colors group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-black text-lg text-red-900 dark:text-red-400 flex items-center gap-3">
                        {patient.name} <span className="text-[10px] font-black uppercase tracking-wider bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300 px-3 py-1 rounded-lg">{patient.room}</span>
                      </h3>
                      <p className="text-sm font-bold text-red-700 dark:text-red-300/70">{patient.condition}</p>
                    </div>
                    <span className="text-xs font-bold text-red-500">{patient.time}</span>
                  </div>
                  
                  <div className="flex items-center gap-5 text-sm font-black text-red-800 dark:text-red-200">
                    <span className="flex items-center gap-2"><HeartPulse size={18} className="text-red-500" /> HR: {patient.hr} BPM</span>
                    <span className="flex items-center gap-2"><Activity size={18} className="text-red-500" /> BP: {patient.bp}</span>
                  </div>
                  
                  <div className="mt-5 flex gap-3">
                    <button 
                      onClick={() => navigate("/doctor/patients")}
                      className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-2xl text-xs font-bold transition-all shadow-lg shadow-red-500/20 focus-visible:ring-4 focus-visible:ring-red-500/50 outline-none active:scale-95"
                    >
                      View Vitals
                    </button>
                    <button 
                      className="p-3 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-2xl transition-colors focus-visible:ring-4 focus-visible:ring-red-500/50 outline-none active:scale-95"
                      aria-label="Call Patient Care Coordinator"
                    >
                      <PhoneCall size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Upcoming Appointments */}
        <motion.div variants={itemVariants} className="panel overflow-hidden">
          <div className="p-8 flex justify-between items-center border-b border-royalBlue-100 dark:border-royalBlue-800">
            <h2 className="text-2xl font-black tracking-tight text-royalBlue-900 dark:text-white flex items-center gap-3">
              <Calendar size={22} className="text-royalBlue" /> Today's Schedule
            </h2>
            <button 
              onClick={() => navigate("/doctor/appointments")}
              className="text-royalBlue font-black text-sm hover:underline flex items-center gap-2"
            >
              View Schedule <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          <div className="divide-y divide-royalBlue-50 dark:divide-royalBlue-800/50">
            {[
              { name: "Hassan Ali", time: "09:00 AM", type: "Checkup", img: "1", status: "Waiting" },
              { name: "Fartun Mohamed", time: "10:30 AM", type: "Consultation", img: "2", status: "Confirmed" },
              { name: "Abdi Guleid", time: "01:00 PM", type: "Surgery", img: "3", status: "Confirmed" },
              { name: "Leyla Warsame", time: "03:30 PM", type: "Follow-up", img: "4", status: "Unconfirmed" }
            ].map((app, i) => (
              <div key={i} className="p-6 flex items-center justify-between hover:bg-royalBlue-50/50 transition-colors dark:hover:bg-royalBlue-900/20 group">
                <div className="flex items-center gap-5">
                  <Avatar src={`https://i.pravatar.cc/150?img=${app.img}`} size="h-14 w-14 border-2 border-white dark:border-navyBlue-800 shadow-sm" />
                  <div>
                    <div className="font-black text-lg text-royalBlue-900 dark:text-white group-hover:text-royalBlue transition-colors">{app.name}</div>
                    <div className="text-xs font-bold text-royalBlue-400">{app.type}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-royalBlue-900 dark:text-white">{app.time}</div>
                  <div className={`text-[10px] font-black uppercase tracking-widest ${
                    app.status === 'Waiting' ? 'text-orange-500' :
                    app.status === 'Confirmed' ? 'text-emerald-500' : 'text-royalBlue-400'
                  }`}>
                    {app.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        
      </div>
    </motion.div>
  );
}
