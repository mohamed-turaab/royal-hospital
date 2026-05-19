import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../../components/Avatar";
import { 
  Calendar, 
  Pill, 
  Activity, 
  ShieldCheck, 
  Clock, 
  Heart, 
  Thermometer, 
  Droplet,
  Bell,
  CheckCircle2,
  FileText,
  TrendingUp,
  ArrowRight,
  Zap,
  MessageSquare,
  Search
} from "lucide-react";
import { motion } from "framer-motion";

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

export default function PatientDashboard() {
  const { user } = useAuth();
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
              <Heart size={16} className="text-royalBlue" /> Patient Health Portal
            </motion.div>
            <h1 className="mb-6 text-5xl font-black leading-tight tracking-tighter md:text-7xl text-balance">
              Hello, <span className="text-royalBlue-400">{user?.name?.split(' ')[0] || 'Jama'}</span>
            </h1>
            <p className="text-xl text-royalBlue-200/80 leading-relaxed max-w-xl">
              Your recovery is on track. You have an upcoming check-up with <span className="text-white font-black">Dr. Amina</span> tomorrow at <span className="text-white font-black">09:00 AM</span>.
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <button className="btn-primary flex items-center gap-3 px-8 py-4 focus-visible:ring-4 focus-visible:ring-royalBlue/20 outline-none">
                <Calendar size={18} /> Book Appointment
              </button>
              <button className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:scale-105 focus-visible:ring-4 focus-visible:ring-royalBlue/30 outline-none active:scale-95">
                View Medical Records
              </button>
            </div>
          </div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="w-full lg:w-[340px] rounded-[36px] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl shrink-0 text-white"
          >
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-royalBlue-300 mb-6">Health Index</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-5">
                <div className="h-14 w-14 rounded-2xl bg-royalBlue/20 flex items-center justify-center text-royalBlue shadow-md">
                  <Activity size={24} />
                </div>
                <div>
                  <div className="text-3xl font-black text-white">92 / 100</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-royalBlue-300">Optimal Range</div>
                </div>
              </div>
              <div className="pt-6 border-t border-white/10 grid grid-cols-2 gap-6">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-royalBlue-300 mb-1">Heart Rate</div>
                  <div className="text-lg font-black text-white">72 BPM</div>
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-royalBlue-300 mb-1">Blood Type</div>
                  <div className="text-lg font-black text-white">A Positive</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Blood Pressure", value: "120/80", icon: Droplet, status: "Normal", color: "text-royalBlue-600 dark:text-royalBlue-300", bg: "bg-royalBlue-100 dark:bg-royalBlue-900/30" },
          { label: "Body Temp", value: "36.6°C", icon: Thermometer, status: "Healthy", color: "text-blue-600 dark:text-blue-300", bg: "bg-blue-100 dark:bg-blue-900/30" },
          { label: "Active Meds", value: "2 Drugs", icon: Pill, status: "On Track", color: "text-green-600 dark:text-green-300", bg: "bg-green-100 dark:bg-green-900/30" },
          { label: "Wait Time", value: "0m", icon: Clock, status: "Ready", color: "text-navyBlue-400", bg: "bg-navyBlue-100 dark:bg-navyBlue-900/30" }
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
                {stat.status}
              </div>
            </div>
            <div className="text-3xl font-black text-royalBlue-900 dark:text-white mb-1">{stat.value}</div>
            <div className="text-[11px] font-black uppercase tracking-wider text-royalBlue-500 dark:text-royalBlue-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Medical History / Appointments */}
        <motion.div variants={itemVariants} className="xl:col-span-2 space-y-8">
          <div className="panel overflow-hidden">
            <div className="p-8 flex justify-between items-center border-b border-royalBlue-100 dark:border-royalBlue-800">
              <h2 className="text-2xl font-black tracking-tight text-royalBlue-900 dark:text-white">Recent Appointments</h2>
              <button className="text-royalBlue font-black text-sm hover:underline focus-visible:ring-4 focus-visible:ring-royalBlue/20 outline-none rounded-lg px-2 py-1">Full History</button>
            </div>
            <div className="divide-y divide-royalBlue-50 dark:divide-royalBlue-800/50">
              {[
                { doctor: "Dr. Amina Warsame", date: "May 20, 2026", time: "09:00 AM", dept: "Cardiology", status: "Upcoming", img: "10" },
                { doctor: "Dr. Ibrahim Farah", date: "May 12, 2026", time: "11:30 AM", dept: "Neurology", status: "Completed", img: "11" },
                { doctor: "Dr. Halima Osman", date: "May 05, 2026", time: "03:00 PM", dept: "Pediatrics", status: "Completed", img: "12" },
              ].map((app, i) => (
                <div key={i} className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-royalBlue-50/50 transition-colors dark:hover:bg-royalBlue-900/10 group">
                  <div className="flex items-center gap-5">
                    <Avatar src={`https://i.pravatar.cc/150?img=${app.img}`} size="h-14 w-14 border-2 border-white dark:border-navyBlue-800 shadow-sm" />
                    <div>
                      <div className="font-black text-lg text-royalBlue-900 dark:text-white group-hover:text-royalBlue transition-colors">{app.doctor}</div>
                      <div className="text-xs font-bold text-royalBlue-400">{app.dept}</div>
                    </div>
                  </div>
                  <div className="flex gap-12 items-center justify-between w-full md:w-auto">
                    <div className="text-left md:text-right">
                      <div className="text-base font-black text-royalBlue-900 dark:text-white">{app.date}</div>
                      <div className="text-[10px] font-black text-royalBlue-400 uppercase tracking-widest">{app.time}</div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      app.status === 'Upcoming' ? 'bg-royalBlue text-white shadow-lg shadow-royalBlue/20' : 'bg-royalBlue-50 text-royalBlue-400 dark:bg-royalBlue-900/30'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-8">
            <h2 className="text-2xl font-black tracking-tight text-royalBlue-900 dark:text-white mb-8">Prescription History</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: "Amoxicillin", dose: "500mg, Twice daily", doctor: "Dr. Amina", duration: "7 Days" },
                { name: "Panadol Extra", dose: "1000mg, As needed", doctor: "Dr. Ibrahim", duration: "5 Days" },
              ].map((pill, i) => (
                <div key={i} className="p-6 rounded-3xl bg-royalBlue-50/50 border border-royalBlue-100/10 dark:bg-royalBlue-900/20 dark:border-royalBlue-800/50 hover:border-royalBlue-100/30 transition-colors">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-12 w-12 rounded-2xl bg-royalBlue text-white flex items-center justify-center shadow-md shadow-royalBlue/20">
                      <Pill size={22} />
                    </div>
                    <div>
                      <div className="font-black text-lg text-royalBlue-950 dark:text-white">{pill.name}</div>
                      <div className="text-xs font-bold text-royalBlue-400">By {pill.doctor}</div>
                    </div>
                  </div>
                  <div className="space-y-3 border-t border-royalBlue-100/10 pt-4 text-sm font-black text-royalBlue-850 dark:text-royalBlue-200">
                    <div className="flex justify-between">
                      <span className="text-royalBlue-400 font-bold">Dosage</span>
                      <span>{pill.dose}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-royalBlue-400 font-bold">Duration</span>
                      <span>{pill.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Reminders & Timeline activity feed */}
        <div className="space-y-8">
          <motion.div variants={itemVariants} className="panel p-8">
            <h3 className="text-xl font-black text-royalBlue-900 dark:text-white mb-6">Reminders</h3>
            <div className="space-y-4">
              {[
                { title: "Medication Round", time: "10:00 AM", desc: "Take Amoxicillin with food", type: "med" },
                { title: "Water Intake", time: "12:30 PM", desc: "Drink at least 500ml", type: "water" },
                { title: "Walk Exercise", time: "05:00 PM", desc: "Light 15min walk", type: "exercise" },
              ].map((rem, i) => (
                <div key={i} className="flex gap-4 p-5 rounded-2xl bg-royalBlue-50/50 dark:bg-royalBlue-900/20 border border-royalBlue-100/10 hover:border-royalBlue-100/30 transition-colors">
                  <div className="h-2 w-2 rounded-full bg-royalBlue mt-2 flex-shrink-0 animate-ping" />
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-black text-royalBlue-950 dark:text-white text-sm">{rem.title}</span>
                      <span className="text-[10px] font-black text-royalBlue">{rem.time}</span>
                    </div>
                    <p className="text-xs font-bold text-royalBlue-400/80 mt-1 leading-relaxed">{rem.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="panel p-8">
            <h3 className="text-xl font-black text-royalBlue-900 dark:text-white mb-8">Medical Timeline</h3>
            <div className="space-y-8 relative">
              <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-royalBlue-100 dark:bg-royalBlue-800" />
              {[
                { date: "May 15", title: "Blood Test Results", desc: "All markers within normal range" },
                { date: "May 12", title: "Neurology Consult", desc: "Follow-up scheduled in 2 weeks" },
                { date: "May 10", title: "Treatment Started", desc: "Antibiotic course initiated" },
              ].map((tl, i) => (
                <div key={i} className="relative pl-10 group last:pb-0">
                  <div className="absolute left-0 top-1 h-5 w-5 rounded-full border-4 border-white bg-royalBlue dark:border-navyBlue-950 group-hover:scale-125 transition-transform shadow-lg" />
                  <div className="text-[10px] font-black text-royalBlue uppercase tracking-widest mb-1">{tl.date}</div>
                  <div className="font-black text-royalBlue-900 dark:text-white text-sm">{tl.title}</div>
                  <p className="text-xs font-bold text-royalBlue-400/80 mt-1 leading-relaxed">{tl.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="p-8 rounded-[36px] bg-gradient-to-br from-navyBlue-900 to-navyBlue-800 text-white text-center shadow-2xl relative overflow-hidden">
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/5 blur-xl" />
            <MessageSquare size={32} className="mx-auto mb-4 text-royalBlue" />
            <h4 className="font-black mb-2 text-lg">Need Support?</h4>
            <p className="text-xs font-semibold text-royalBlue-200/80 mb-6 px-4">Our clinical team is available 24/7 for your questions.</p>
            <button className="w-full py-4 rounded-2xl bg-white text-navyBlue font-black text-sm hover:bg-royalBlue hover:text-white transition-all focus-visible:ring-4 focus-visible:ring-royalBlue/20 outline-none active:scale-95">
              Chat with Care Team
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
