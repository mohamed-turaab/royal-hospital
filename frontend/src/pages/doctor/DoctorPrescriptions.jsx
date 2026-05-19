import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ClipboardPlus, Pill, Search, Plus, Trash2, 
  Save, Printer, Send, UserRound, FileText, AlertCircle,
  CheckCircle, XCircle, Info, Loader
} from "lucide-react";
import api from "../../services/api";

const commonMedicines = [
  "Amoxicillin 500mg", "Ibuprofen 400mg", "Lisinopril 10mg",
  "Metformin 500mg", "Atorvastatin 20mg", "Omeprazole 20mg"
];

const statusColors = {
  Stable: "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  Critical: "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
  Recovering: "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

function PatientPicker({ selectedPatient, onSelect, patients = [], loading = false }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = patients.filter(p =>
    (p?.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (p?._id || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (patient) => {
    onSelect(patient);
    setOpen(false);
    setSearch("");
  };

  return (
    <div className="relative">
      {selectedPatient ? (
        <div className="flex items-center justify-between p-4 rounded-2xl border-2 border-royalBlue bg-royalBlue/5 dark:bg-royalBlue/10 shadow-sm">
          <div className="flex items-center gap-3">
            {selectedPatient.profileImage ? (
              <img src={selectedPatient.profileImage} alt={selectedPatient.name} className="w-12 h-12 rounded-xl object-cover border-2 border-white dark:border-navyBlue-800 shadow" />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-royalBlue to-navyBlue flex items-center justify-center text-white font-black text-lg shadow">
                {selectedPatient.name?.charAt(0) || "?"}
              </div>
            )}
            <div>
              <p className="text-base font-bold text-navyBlue-900 dark:text-white">{selectedPatient.name}</p>
              <p className="text-xs text-navyBlue-500">{selectedPatient._id ? selectedPatient._id.slice(-6).toUpperCase() : "UNK"} · {selectedPatient.age || "?"} yrs · {selectedPatient.gender || "?"}</p>
            </div>
          </div>
          <button
            onClick={() => onSelect(null)}
            className="text-xs font-bold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 px-3 py-1.5 rounded-lg transition-colors"
          >
            Change
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full flex items-center gap-3 p-4 rounded-2xl border-2 border-dashed border-navyBlue-200 dark:border-navyBlue-700 bg-navyBlue-50/50 dark:bg-navyBlue-900/30 hover:border-royalBlue hover:bg-royalBlue/5 transition-all group text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-navyBlue-100 dark:bg-navyBlue-800 flex items-center justify-center text-navyBlue-400 group-hover:bg-royalBlue/20 group-hover:text-royalBlue transition-colors">
            <UserRound size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-navyBlue-700 dark:text-navyBlue-300 group-hover:text-royalBlue transition-colors">Click to select a patient</p>
            <p className="text-xs text-navyBlue-400">{patients.length} patients available</p>
          </div>
        </button>
      )}

      {open && (
        <div
          style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: "8px", zIndex: 9999 }}
          className="bg-white dark:bg-navyBlue-900 rounded-2xl border border-navyBlue-100 dark:border-navyBlue-700 shadow-2xl overflow-hidden"
        >
          <div className="p-3 border-b border-navyBlue-100 dark:border-navyBlue-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-navyBlue-400" size={15} />
              <input
                autoFocus
                type="text"
                placeholder="Search patient name or ID..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-navyBlue-50 dark:bg-navyBlue-800 border border-navyBlue-100 dark:border-navyBlue-700 rounded-xl py-2 pl-9 pr-3 text-sm font-medium text-navyBlue-900 dark:text-white outline-none focus:border-royalBlue"
              />
            </div>
          </div>

          <div style={{ maxHeight: "280px", overflowY: "auto" }}>
            {filtered.length === 0 ? (
              <div className="p-6 text-center text-sm text-navyBlue-400">No patients found</div>
            ) : (
              filtered.map((patient, index) => (
                <button
                  type="button"
                  key={patient._id || index}
                  onClick={() => handleSelect(patient)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-navyBlue-50 dark:hover:bg-navyBlue-800 transition-colors text-left group border-b border-navyBlue-50 dark:border-navyBlue-800/50 last:border-0"
                >
                  {patient.profileImage ? (
                    <img src={patient.profileImage} alt={patient.name} className="w-11 h-11 rounded-xl object-cover border-2 border-white dark:border-navyBlue-700 shadow shrink-0" />
                  ) : (
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-royalBlue to-navyBlue flex items-center justify-center text-white font-black text-base shrink-0 shadow">
                      {patient.name?.charAt(0) || "?"}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-navyBlue-900 dark:text-white group-hover:text-royalBlue transition-colors truncate">{patient.name}</p>
                    <p className="text-xs text-navyBlue-500 truncate">{patient._id ? patient._id.slice(-6).toUpperCase() : "UNK"} · {patient.age || "?"} yrs · {patient.gender || "?"}</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border shrink-0 bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
                    Patient
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {open && <div style={{ position: "fixed", inset: 0, zIndex: 9998 }} onClick={() => setOpen(false)} />}

    </div>
  );
}

function Toast({ toasts }) {
  return (
    <div style={{ position: "fixed", top: "24px", right: "24px", zIndex: 99999, display: "flex", flexDirection: "column", gap: "12px" }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          display: "flex", alignItems: "center", gap: "12px",
          padding: "14px 20px", borderRadius: "16px", minWidth: "300px",
          background: t.type === "success" ? "#052e16" : t.type === "error" ? "#450a0a" : "#0c1a2e",
          border: `1px solid ${t.type === "success" ? "#166534" : t.type === "error" ? "#991b1b" : "#1e40af"}`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          color: t.type === "success" ? "#4ade80" : t.type === "error" ? "#f87171" : "#93c5fd"
        }}>
          {t.type === "success" ? <CheckCircle size={20} /> : t.type === "error" ? <XCircle size={20} /> : <Info size={20} />}
          <span style={{ fontSize: "14px", fontWeight: "600", color: "#fff" }}>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-50 text-red-900 rounded-2xl m-8">
          <h1 className="text-2xl font-bold mb-4">Something went wrong.</h1>
          <pre className="whitespace-pre-wrap text-sm">{this.state.error.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function DoctorPrescriptionsContent() {
  const [medications, setMedications] = useState([
    { id: 1, name: "", dosage: "", frequency: "", duration: "", instructions: "" }
  ]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [notes, setNotes] = useState("");
  const [toasts, setToasts] = useState([]);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [patients, setPatients] = useState([]);
  const [recentPrescriptions, setRecentPrescriptions] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingPrescriptions, setLoadingPrescriptions] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [patientsRes, prescriptionsRes] = await Promise.all([
        api.get("/patients"),
        api.get("/prescriptions")
      ]);
      setPatients(patientsRes.data);
      setRecentPrescriptions(prescriptionsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      showToast("Failed to load initial data", "error");
    } finally {
      setLoadingPatients(false);
      setLoadingPrescriptions(false);
    }
  };

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };

  const handleSave = async () => {
    if (!selectedPatient) {
      showToast("Please select a patient first.", "error");
      return;
    }
    const incomplete = medications.some(m => !m.name.trim());
    if (incomplete) {
      showToast("Please fill in all medication names.", "error");
      return;
    }
    
    setIsSaving(true);
    try {
      await api.post("/prescriptions", {
        patientId: selectedPatient._id,
        medicines: medications.map(m => ({
          name: m.name,
          dosage: m.dosage,
          frequency: m.frequency,
          duration: m.duration,
          instructions: m.instructions
        })),
        notes: notes
      });
      
      setSaved(true);
      showToast(`Prescription saved for ${selectedPatient.name}!`, "success");
      
      // Refresh recent prescriptions
      const prescriptionsRes = await api.get("/prescriptions");
      setRecentPrescriptions(prescriptionsRes.data);
      
    } catch (error) {
      console.error("Error saving prescription:", error);
      showToast(error.response?.data?.message || "Failed to save prescription", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendToPharmacy = () => {
    if (!selectedPatient) {
      showToast("Please select a patient first.", "error");
      return;
    }
    if (!saved) {
      showToast("Please save the prescription before sending.", "error");
      return;
    }
    showToast(`Sent to pharmacy for ${selectedPatient.name}!`, "success");
  };

  const handlePrint = () => {
    if (!selectedPatient) {
      showToast("Please select a patient before printing.", "error");
      return;
    }
    window.print();
  };

  const addMedication = () => {
    setSaved(false);
    setMedications([...medications, { id: Date.now(), name: "", dosage: "", frequency: "", duration: "", instructions: "" }]);
  };

  const addCommonMedicine = (medName) => {
    setSaved(false);
    const nameParts = medName.split(" ");
    const dosage = nameParts.length > 1 ? nameParts.pop() : "";
    const name = nameParts.join(" ");
    
    if (medications.length === 1 && !medications[0].name) {
      setMedications([{ ...medications[0], name, dosage }]);
    } else {
      setMedications([...medications, { id: Date.now(), name, dosage, frequency: "", duration: "", instructions: "" }]);
    }
  };

  const removeMedication = (id) => {
    if (medications.length > 1) { setSaved(false); setMedications(medications.filter(m => m.id !== id)); }
  };

  const updateMedication = (id, field, value) => {
    setSaved(false);
    setMedications(medications.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  return (
    <>
    <Toast toasts={toasts} />
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-black text-navyBlue-900 dark:text-white">Prescriptions</h1>
          <p className="text-sm font-medium text-navyBlue-500 dark:text-navyBlue-400">Create and manage digital prescriptions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Prescription Builder */}
        <div className="xl:col-span-2 space-y-6">
          <div className="panel p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-navyBlue-100 dark:border-navyBlue-800">
              <div className="p-2.5 bg-royalBlue/10 text-royalBlue rounded-xl">
                <ClipboardPlus size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-navyBlue-900 dark:text-white">New Prescription</h2>
                <p className="text-xs font-medium text-navyBlue-500">RX-4922 · Today</p>
              </div>
            </div>
            
            {/* Patient Selection */}
            <div className="mb-8">
              <label className="block text-xs font-bold uppercase tracking-widest text-navyBlue-400 mb-3">Select Patient</label>
              <PatientPicker selectedPatient={selectedPatient} onSelect={setSelectedPatient} patients={patients} loading={loadingPatients} />
            </div>

            {/* Medication List */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-xs font-bold uppercase tracking-widest text-navyBlue-400">Medications</label>
                <button type="button" onClick={addMedication} className="flex items-center gap-1 text-xs font-bold text-royalBlue hover:text-royalBlue-700 transition-colors">
                  <Plus size={14} /> Add Medicine
                </button>
              </div>
              
              <div className="space-y-4 mt-2 ml-3">
                  {medications.map((med, index) => (
                    <div 
                      key={med.id}
                      className="p-4 rounded-2xl border border-navyBlue-100 bg-white dark:border-navyBlue-800 dark:bg-navyBlue-900/50 relative group"
                    >
                      <div className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-navyBlue-900 text-white flex items-center justify-center text-xs font-bold shadow-md">
                        {index + 1}
                      </div>
                      {medications.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => removeMedication(med.id)}
                          className="absolute right-4 top-4 text-navyBlue-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-[10px] font-bold text-navyBlue-500 uppercase tracking-widest mb-1">Medicine Name</label>
                          <div className="relative">
                            <Pill className="absolute left-3 top-1/2 -translate-y-1/2 text-navyBlue-400" size={14} />
                            <input 
                              type="text" 
                              className="w-full bg-navyBlue-50 border border-navyBlue-100 rounded-xl py-2 pl-9 pr-3 text-sm font-bold text-navyBlue-900 focus:outline-none focus:border-royalBlue dark:bg-navyBlue-950 dark:border-navyBlue-800 dark:text-white"
                              placeholder="e.g. Amoxicillin"
                              value={med.name}
                              onChange={(e) => updateMedication(med.id, 'name', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-navyBlue-500 uppercase tracking-widest mb-1">Dosage</label>
                            <input 
                              type="text" 
                              className="w-full bg-navyBlue-50 border border-navyBlue-100 rounded-xl py-2 px-3 text-sm font-bold text-navyBlue-900 focus:outline-none focus:border-royalBlue dark:bg-navyBlue-950 dark:border-navyBlue-800 dark:text-white"
                              placeholder="500mg"
                              value={med.dosage}
                              onChange={(e) => updateMedication(med.id, 'dosage', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-navyBlue-500 uppercase tracking-widest mb-1">Duration</label>
                            <input 
                              type="text" 
                              className="w-full bg-navyBlue-50 border border-navyBlue-100 rounded-xl py-2 px-3 text-sm font-bold text-navyBlue-900 focus:outline-none focus:border-royalBlue dark:bg-navyBlue-950 dark:border-navyBlue-800 dark:text-white"
                              placeholder="7 days"
                              value={med.duration}
                              onChange={(e) => updateMedication(med.id, 'duration', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-navyBlue-500 uppercase tracking-widest mb-1">Frequency</label>
                          <select 
                            className="w-full bg-navyBlue-50 border border-navyBlue-100 rounded-xl py-2 px-3 text-sm font-bold text-navyBlue-900 focus:outline-none focus:border-royalBlue dark:bg-navyBlue-950 dark:border-navyBlue-800 dark:text-white appearance-none"
                            value={med.frequency}
                            onChange={(e) => updateMedication(med.id, 'frequency', e.target.value)}
                          >
                            <option value="">Select frequency...</option>
                            <option value="Once daily">Once daily (OD)</option>
                            <option value="Twice daily">Twice daily (BD)</option>
                            <option value="Three times daily">Three times daily (TDS)</option>
                            <option value="Four times daily">Four times daily (QDS)</option>
                            <option value="As needed">As needed (PRN)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-navyBlue-500 uppercase tracking-widest mb-1">Instructions</label>
                          <input 
                            type="text" 
                            className="w-full bg-navyBlue-50 border border-navyBlue-100 rounded-xl py-2 px-3 text-sm font-medium text-navyBlue-900 focus:outline-none focus:border-royalBlue dark:bg-navyBlue-950 dark:border-navyBlue-800 dark:text-white"
                            placeholder="e.g. Take after meals"
                            value={med.instructions}
                            onChange={(e) => updateMedication(med.id, 'instructions', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            
            {/* Notes */}
            <div className="mb-8">
              <label className="block text-xs font-bold uppercase tracking-widest text-navyBlue-400 mb-2">Clinical Notes & Advice</label>
              <textarea 
                rows="3" 
                className="input-field shadow-inner resize-none"
                placeholder="Add any specific diet instructions, warnings, or follow-up advice here..."
                value={notes}
                onChange={e => { setSaved(false); setNotes(e.target.value); }}
              ></textarea>
            </div>
            
            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-navyBlue-100 dark:border-navyBlue-800">
              <button type="button" onClick={handleSave} disabled={isSaving} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                {isSaving ? <Loader size={18} className="animate-spin" /> : <Save size={18} />} 
                {saved ? "Saved ✓" : isSaving ? "Saving..." : "Save Prescription"}
              </button>
              <button type="button" onClick={handleSendToPharmacy} className="btn-secondary">
                <Send size={18} /> Send to Pharmacy
              </button>
              <button type="button" onClick={handlePrint} className="btn-secondary">
                <Printer size={18} /> Print
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-1 space-y-6">
          
          <div className="panel p-6 bg-navyBlue text-white border-transparent">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <AlertCircle size={18} className="text-royalBlue-300" /> Interaction Check
            </h3>
            <p className="text-sm text-navyBlue-300 mb-4 leading-relaxed">
              Auto-check is active. No severe drug-drug interactions detected in the current prescription draft.
            </p>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="w-full h-full bg-emerald-500" />
            </div>
          </div>
          
          <div className="panel p-6">
            <h3 className="font-bold text-navyBlue-900 dark:text-white mb-4">Commonly Prescribed</h3>
            <div className="flex flex-wrap gap-2">
              {commonMedicines.map(med => (
                <button 
                  key={med} 
                  onClick={() => addCommonMedicine(med)}
                  className="px-3 py-1.5 bg-navyBlue-50 dark:bg-navyBlue-800 hover:bg-royalBlue hover:text-white dark:hover:bg-royalBlue text-xs font-semibold text-navyBlue-600 dark:text-navyBlue-300 rounded-lg transition-colors border border-navyBlue-100 dark:border-navyBlue-700"
                >
                  {med}
                </button>
              ))}
            </div>
          </div>
          
          <div className="panel p-6">
            <h3 className="font-bold text-navyBlue-900 dark:text-white mb-4 flex items-center justify-between">
              Recent Prescriptions
              <button className="text-xs text-royalBlue hover:underline">View all</button>
            </h3>
            <div className="space-y-4">
              {loadingPrescriptions ? (
                <div className="text-sm text-navyBlue-400 p-4 text-center">Loading...</div>
              ) : recentPrescriptions.length === 0 ? (
                <div className="text-sm text-navyBlue-400 p-4 text-center">No recent prescriptions</div>
              ) : recentPrescriptions.map((rx, index) => (
                <div key={rx._id || index} className="flex gap-4 items-start p-3 rounded-xl hover:bg-navyBlue-50 dark:hover:bg-navyBlue-800/50 transition-colors border border-transparent hover:border-navyBlue-100 dark:hover:border-navyBlue-700">
                  <div className="w-10 h-10 rounded-full bg-royalBlue/10 flex items-center justify-center text-royalBlue shrink-0">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-navyBlue-900 dark:text-white leading-tight mb-0.5">{rx.patientName || (rx.patient?.name) || "Unknown"}</h4>
                    <p className="text-xs text-navyBlue-500 mb-1.5">{rx._id ? rx._id.slice(-6).toUpperCase() : "UNK"} · {new Date(rx.createdAt).toLocaleDateString()} · {rx.medicines?.length || 0} items</p>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      {rx.status || "Pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </motion.div>
    </>
  );
}

export default function DoctorPrescriptions() {
  return (
    <ErrorBoundary>
      <DoctorPrescriptionsContent />
    </ErrorBoundary>
  );
}
