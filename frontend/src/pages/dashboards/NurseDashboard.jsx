import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../../components/Avatar";
import api from "../../services/api";
import { 
  Users, 
  ClipboardList, 
  Clock, 
  Activity, 
  ShieldCheck, 
  BadgeCheck, 
  AlertCircle, 
  Heart, 
  Thermometer, 
  Droplet,
  Bell,
  CheckCircle2,
  Calendar,
  Zap
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

export default function NurseDashboard() {
  const { user } = useAuth();
  const [now, setNow] = useState(new Date());
  const [patients, setPatients] = useState([]);
  const [meds, setMeds] = useState([]);
  const [loadingWard, setLoadingWard] = useState(true);

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const buildWardRounds = async () => {
      try {
        setLoadingWard(true);
        const [{ data: roomsData }, { data: prescriptionData }] = await Promise.all([
          api.get("/rooms"),
          api.get("/prescriptions"),
        ]);

        const occupiedRooms = (Array.isArray(roomsData) ? roomsData : [])
          .filter((room) => room.status === "Occupied" && room.currentPatient);

        const activePatients = occupiedRooms.map((room, index) => {
          const patient = room.currentPatient;
          const isIcu = room.type === "ICU";
          return {
            id: patient._id,
            name: patient.name || "Unknown Patient",
            room: room.roomNumber,
            status: isIcu ? "Critical" : "Admitted",
            vitals: {
              heart: isIcu ? 106 : 72 + (index * 7) % 18,
              temp: isIcu ? 38.7 : 36.5 + ((index % 3) * 0.3),
              bp: isIcu ? "145/95" : "120/80",
            },
            priority: isIcu ? "high" : "low",
          };
        });

        const admittedPatientIds = new Set(activePatients.map((patient) => patient.id));
        const nextMeds = (Array.isArray(prescriptionData) ? prescriptionData : [])
          .filter((prescription) => admittedPatientIds.has(prescription.patient?._id))
          .flatMap((prescription, prescriptionIndex) =>
            (prescription.medicines || []).map((medicine, medicineIndex) => ({
              id: `${prescription._id}-${medicineIndex}`,
              time: new Date(Date.now() + (prescriptionIndex + medicineIndex) * 45 * 60 * 1000)
                .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              patient: prescription.patient?.name || prescription.patientName || "Unknown Patient",
              med: `${medicine.name || "Medicine"}${medicine.dosage ? ` - ${medicine.dosage}` : ""}`,
              status: "pending",
            }))
          );

        setPatients(activePatients);
        setMeds(nextMeds);
      } catch (error) {
        console.error("Error loading admitted patients for nurse dashboard:", error);
        setPatients([]);
        setMeds([]);
      } finally {
        setLoadingWard(false);
      }
    };

    buildWardRounds();
  }, []);

  const handleConfirmMed = (id) => {
    setMeds(meds.map(m => m.id === id ? { ...m, status: "completed" } : m));
  };

  const pendingMedicationCount = meds.filter((m) => m.status !== "completed").length;

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
          <div className="text-white">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md"
            >
              <Zap size={16} className="text-royalBlue" /> Ward Management Portal
            </motion.div>
            <h1 className="mb-6 text-5xl font-black leading-tight tracking-tighter md:text-7xl text-balance">
              Hello, <span className="text-royalBlue-400">Nurse {user?.name?.split(' ')[1] || 'Hodan'}</span>
            </h1>
            <p className="text-xl text-royalBlue-200/80 leading-relaxed max-w-xl">
              Ward patients are loaded from occupied hospital rooms. You have <span className="text-white font-black">{pendingMedicationCount} medication rounds</span> remaining for your shift.
            </p>
          </div>

          <motion.div variants={itemVariants} className="flex gap-6">
            <div className="p-6 rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl text-center min-w-[150px] shadow-2xl">
              <div className="text-4xl font-black text-royalBlue mb-1">04h</div>
              <div className="text-[10px] font-black uppercase tracking-wider text-royalBlue-300">Remaining Shift</div>
            </div>
            <div className="p-6 rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl text-center min-w-[150px] shadow-2xl">
              <div className="text-4xl font-black text-green-400 mb-1">{patients.length}</div>
              <div className="text-[10px] font-black uppercase tracking-wider text-royalBlue-300">Patients Active</div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Emergency Alerts Panel */}
      <motion.div 
        variants={itemVariants} 
        className="p-1 rounded-[36px] bg-gradient-to-r from-red-500/20 to-transparent border border-red-500/10 shadow-[0_0_30px_rgba(239,68,68,0.1)]"
      >
        <div className="panel p-8 flex flex-col md:flex-row items-center justify-between gap-8 bg-white dark:bg-navyBlue-950">
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 rounded-2xl bg-red-500 flex items-center justify-center text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.4)]">
              <AlertCircle size={32} />
            </div>
            <div>
              <div className="text-xl font-black text-royalBlue-900 dark:text-white">Emergency Alert: Room ICU-04</div>
              <p className="text-sm font-semibold text-royalBlue-500 dark:text-royalBlue-400 mt-1">Patient Abdi Gure: Heart rate spike detected. Immediate attention required.</p>
            </div>
          </div>
          <button className="px-8 py-4 rounded-2xl bg-red-500 text-white font-black text-sm hover:bg-red-600 transition-all shadow-lg shadow-red-500/30 focus-visible:ring-4 focus-visible:ring-red-500/50 outline-none active:scale-95">
            Acknowledge Alert
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Patient Monitoring */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div variants={itemVariants} className="panel p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black tracking-tight text-royalBlue-900 dark:text-white">Active Patient Monitoring</h2>
              <button className="text-royalBlue font-black text-sm hover:underline focus-visible:ring-4 focus-visible:ring-royalBlue/20 outline-none rounded-lg px-2 py-1">View Ward Map</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loadingWard ? (
                <div className="col-span-full rounded-3xl border border-royalBlue-100/30 bg-royalBlue-50/50 p-8 text-center text-sm font-bold text-royalBlue-400 dark:border-royalBlue-800 dark:bg-royalBlue-900/20">
                  Loading admitted patients...
                </div>
              ) : patients.length === 0 ? (
                <div className="col-span-full rounded-3xl border border-royalBlue-100/30 bg-royalBlue-50/50 p-8 text-center text-sm font-bold text-royalBlue-400 dark:border-royalBlue-800 dark:bg-royalBlue-900/20">
                  No admitted patients in occupied rooms.
                </div>
              ) : patients.map((p, i) => (
                <div key={i} className="group p-6 rounded-3xl border border-royalBlue-100/30 bg-royalBlue-50/50 hover:bg-white hover:shadow-2xl transition-all dark:border-royalBlue-800 dark:bg-royalBlue-900/20">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-royalBlue text-white flex items-center justify-center font-black shadow-md shadow-royalBlue/20">
                        {p.room.split('-')[0]}
                      </div>
                      <div>
                        <div className="font-black text-lg text-royalBlue-900 dark:text-white group-hover:text-royalBlue transition-colors">{p.name}</div>
                        <div className="text-xs font-bold text-royalBlue-400">Room {p.room}</div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider text-white ${
                      p.priority === 'high' ? 'bg-red-500' : 
                      p.priority === 'medium' ? 'bg-royalBlue' : 'bg-green-500'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3.5 rounded-2xl bg-white dark:bg-navyBlue-900/60 shadow-sm border border-royalBlue-100/10">
                      <Heart size={18} className="mx-auto mb-2 text-red-500" />
                      <div className="text-base font-black text-royalBlue-900 dark:text-white">{p.vitals.heart}</div>
                      <div className="text-[9px] font-black text-royalBlue-400 uppercase tracking-wider">BPM</div>
                    </div>
                    <div className="text-center p-3.5 rounded-2xl bg-white dark:bg-navyBlue-900/60 shadow-sm border border-royalBlue-100/10">
                      <Thermometer size={18} className="mx-auto mb-2 text-blue-500" />
                      <div className="text-base font-black text-royalBlue-900 dark:text-white">{p.vitals.temp}°</div>
                      <div className="text-[9px] font-black text-royalBlue-400 uppercase tracking-wider">Temp</div>
                    </div>
                    <div className="text-center p-3.5 rounded-2xl bg-white dark:bg-navyBlue-900/60 shadow-sm border border-royalBlue-100/10">
                      <Droplet size={18} className="mx-auto mb-2 text-royalBlue animate-pulse" />
                      <div className="text-sm font-black text-royalBlue-900 dark:text-white truncate">{p.vitals.bp}</div>
                      <div className="text-[9px] font-black text-royalBlue-400 uppercase tracking-wider">BP</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Medication Schedule */}
          <motion.div variants={itemVariants} className="panel p-8">
            <h2 className="text-2xl font-black tracking-tight text-royalBlue-900 dark:text-white mb-8">Medication Rounds</h2>
            <div className="space-y-4">
              {loadingWard ? (
                <div className="rounded-2xl border border-royalBlue-50 p-6 text-center text-sm font-bold text-royalBlue-400 dark:border-royalBlue-800/50">
                  Loading medication rounds...
                </div>
              ) : meds.length === 0 ? (
                <div className="rounded-2xl border border-royalBlue-50 p-6 text-center text-sm font-bold text-royalBlue-400 dark:border-royalBlue-800/50">
                  No medication rounds for admitted patients.
                </div>
              ) : meds.map((m) => (
                <div key={m.id} className="flex items-center justify-between p-5 rounded-2xl border border-royalBlue-50 dark:border-royalBlue-800/50 hover:bg-royalBlue-50/50 dark:hover:bg-royalBlue-900/10 transition-colors">
                  <div className="flex items-center gap-6">
                    <div className="text-sm font-black text-royalBlue w-24">{m.time}</div>
                    <div>
                      <div className="font-black text-lg text-royalBlue-900 dark:text-white">{m.patient}</div>
                      <div className="text-xs font-bold text-royalBlue-400">{m.med}</div>
                    </div>
                  </div>
                  {m.status === 'completed' ? (
                    <div className="flex items-center gap-2 text-green-500 font-black text-xs uppercase tracking-widest bg-green-500/10 px-3.5 py-1.5 rounded-xl">
                      <CheckCircle2 size={16} /> Administered
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleConfirmMed(m.id)}
                      className="px-6 py-2.5 rounded-xl bg-royalBlue text-white font-black text-xs hover:bg-royalBlue-600 transition-all focus-visible:ring-4 focus-visible:ring-royalBlue/20 outline-none active:scale-95 shadow-md shadow-royalBlue/20"
                    >
                      Confirm Dose
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar: Shift & Tasks */}
        <div className="space-y-8">
          <motion.div 
            variants={itemVariants} 
            whileHover={{ y: -5 }}
            className="panel p-8 bg-royalBlue text-white shadow-xl shadow-royalBlue/30 relative overflow-hidden"
          >
            <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10 blur-xl" />
            <h3 className="text-xl font-black mb-8">Shift Metrics</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xs font-black uppercase tracking-widest opacity-80 mb-1">Tasks Completed</div>
                  <div className="text-4xl font-black">18 / 24</div>
                </div>
                <div className="h-16 w-16 relative">
                  <svg className="h-full w-full" viewBox="0 0 36 36">
                    <path className="stroke-white/10" strokeDasharray="100, 100" strokeWidth="3.5" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="stroke-white" strokeDasharray="75, 100" strokeWidth="3.5" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-black">75%</div>
                </div>
              </div>
              <div className="pt-6 border-t border-white/10 grid grid-cols-2 gap-6">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Rounds Done</div>
                  <div className="text-2xl font-black">06</div>
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Care Logs</div>
                  <div className="text-2xl font-black">14</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="panel p-8">
            <h3 className="text-xl font-black text-royalBlue-900 dark:text-white mb-8">Ward Activity Log</h3>
            <div className="space-y-6">
              {[
                { title: "Shift Handover", time: "08:00 AM", desc: "Received briefing from Nurse Ali" },
                { title: "Lab Request", time: "09:30 AM", desc: "Blood samples sent for Room 302" },
                { title: "Patient Discharge", time: "10:15 AM", desc: "Room 105 successfully discharged" },
              ].map((act, i) => (
                <div key={i} className="relative pl-6 pb-6 border-l border-royalBlue-100 dark:border-royalBlue-800 last:pb-0">
                  <div className="absolute left-[-5px] top-0 h-2.5 w-2.5 rounded-full bg-royalBlue shadow-[0_0_8px_rgba(27,117,187,0.4)]" />
                  <div className="text-[10px] font-black text-royalBlue uppercase tracking-wider mb-1">{act.time}</div>
                  <div className="font-black text-royalBlue-950 dark:text-white text-sm">{act.title}</div>
                  <p className="text-xs font-bold text-royalBlue-400/80 mt-1 leading-relaxed">{act.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
