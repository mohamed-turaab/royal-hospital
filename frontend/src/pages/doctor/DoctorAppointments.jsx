import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../../services/api";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  UserRound, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Stethoscope,
  FileText
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/appointments");
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async (id) => {
    try {
      await api.put(`/appointments/${id}`, { status: "Completed" });
      fetchAppointments();
    } catch (err) {
      alert("Error updating appointment");
    }
  };

  const handleMarkCancelled = async (id) => {
    try {
      await api.put(`/appointments/${id}`, { status: "Cancelled" });
      fetchAppointments();
    } catch (err) {
      alert("Error updating appointment");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed": return <CheckCircle2 className="text-emerald-500" size={16} />;
      case "Cancelled": return <XCircle className="text-red-500" size={16} />;
      case "Scheduled": return <Clock className="text-royalBlue" size={16} />;
      default: return <AlertCircle className="text-navyBlue-400" size={16} />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Completed": return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800";
      case "Cancelled": return "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
      case "Scheduled": return "bg-royalBlue-50 text-royalBlue-700 border-royalBlue-200 dark:bg-royalBlue-900/30 dark:text-royalBlue-400 dark:border-royalBlue-800";
      default: return "bg-navyBlue-50 text-navyBlue-600 border-navyBlue-200 dark:bg-navyBlue-800 dark:text-navyBlue-300 dark:border-navyBlue-700";
    }
  };

  const filtered = filterStatus === "All"
    ? appointments
    : appointments.filter(a => a.status === filterStatus);

  const stats = {
    total: appointments.length,
    scheduled: appointments.filter(a => a.status === "Scheduled").length,
    completed: appointments.filter(a => a.status === "Completed").length,
    cancelled: appointments.filter(a => a.status === "Cancelled").length,
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-navyBlue-900 dark:text-white flex items-center gap-3">
            <Stethoscope className="text-royalBlue" size={28} />
            My Appointments
          </h1>
          <p className="text-sm font-medium text-navyBlue-500 dark:text-navyBlue-400 mt-1">
            All appointments assigned to you from the hospital system
          </p>
        </div>
        <button
          onClick={fetchAppointments}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-royalBlue/10 text-royalBlue font-bold text-sm hover:bg-royalBlue/20 transition-colors"
        >
          <Clock size={16} /> Refresh
        </button>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.total, color: "royalBlue" },
          { label: "Scheduled", value: stats.scheduled, color: "blue" },
          { label: "Completed", value: stats.completed, color: "emerald" },
          { label: "Cancelled", value: stats.cancelled, color: "red" },
        ].map(stat => (
          <div key={stat.label} className="panel p-5 text-center">
            <div className="text-3xl font-black text-navyBlue-900 dark:text-white">{stat.value}</div>
            <div className="text-xs font-bold text-navyBlue-500 uppercase tracking-wider mt-1">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Filter Tabs */}
      <motion.div variants={itemVariants} className="flex items-center gap-2 border-b border-navyBlue-100 dark:border-navyBlue-800 pb-px">
        {["All", "Scheduled", "Completed", "Cancelled"].map(tab => (
          <button
            key={tab}
            onClick={() => setFilterStatus(tab)}
            className={`pb-3 px-4 text-sm font-bold transition-all relative ${
              filterStatus === tab
                ? "text-royalBlue"
                : "text-navyBlue-500 hover:text-navyBlue-900 dark:text-navyBlue-400 dark:hover:text-white"
            }`}
          >
            {tab}
            {filterStatus === tab && (
              <motion.div layoutId="doctorApptTab" className="absolute bottom-0 left-0 right-0 h-1 bg-royalBlue rounded-t-full" />
            )}
          </button>
        ))}
      </motion.div>

      {/* Appointment List */}
      {loading ? (
        <div className="p-20 text-center space-y-4">
          <div className="h-12 w-12 border-4 border-royalBlue border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-royalBlue-400 font-bold uppercase tracking-widest text-xs">Loading Appointments...</p>
        </div>
      ) : filtered.length === 0 ? (
        <motion.div variants={itemVariants} className="panel p-16 text-center flex flex-col items-center justify-center">
          <CalendarIcon size={52} className="text-navyBlue-200 dark:text-navyBlue-700 mb-4" />
          <h3 className="text-xl font-bold text-navyBlue-900 dark:text-white mb-2">No appointments found</h3>
          <p className="text-navyBlue-500 text-sm">
            {filterStatus === "All"
              ? "You have no appointments assigned yet. The receptionist will book appointments for you."
              : `No ${filterStatus.toLowerCase()} appointments.`}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filtered.map((appt) => {
            const patientName = appt.patient?.user?.name || appt.patient?.name || "Unknown Patient";
            const scheduledDate = new Date(appt.scheduledAt);
            const isScheduled = appt.status === "Scheduled";

            return (
              <motion.div
                key={appt._id}
                variants={itemVariants}
                className={`panel p-5 relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                  isScheduled ? "border-l-4 border-l-royalBlue" : ""
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: Date + Patient */}
                  <div className="flex items-center gap-4">
                    {/* Date Block */}
                    <div className="shrink-0 w-20 text-center bg-royalBlue/10 rounded-2xl p-3">
                      <p className="text-xs font-bold text-royalBlue uppercase tracking-widest">
                        {scheduledDate.toLocaleDateString("en", { month: "short" })}
                      </p>
                      <p className="text-2xl font-black text-navyBlue-900 dark:text-white leading-none">
                        {scheduledDate.getDate()}
                      </p>
                      <p className="text-xs font-bold text-navyBlue-500 mt-1">
                        {scheduledDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>

                    {/* Patient Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-royalBlue to-navyBlue flex items-center justify-center text-white font-black text-lg shadow-md">
                        {patientName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-base font-black text-navyBlue-900 dark:text-white flex items-center gap-1.5">
                          <UserRound size={14} className="text-navyBlue-400" />
                          {patientName}
                        </h3>
                        {appt.notes && (
                          <p className="text-xs font-medium text-navyBlue-500 flex items-center gap-1 mt-0.5">
                            <FileText size={11} /> {appt.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Status + Actions */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusClass(appt.status)}`}>
                      {getStatusIcon(appt.status)} {appt.status}
                    </div>

                    {isScheduled && (
                      <>
                        <button
                          onClick={() => handleMarkComplete(appt._id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-colors"
                        >
                          <CheckCircle2 size={14} /> Complete
                        </button>
                        <button
                          onClick={() => handleMarkCancelled(appt._id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 text-red-500 text-xs font-bold hover:bg-red-500/20 transition-colors"
                        >
                          <XCircle size={14} /> Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
