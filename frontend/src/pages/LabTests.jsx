import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  FlaskConical, CheckCircle2, Clock, CreditCard, Upload,
  Droplets, FileText, X, Plus, ChevronRight, Search,
  AlertCircle, Microscope, Activity
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

const STATUS_CONFIG = {
  "Pending Payment": { color: "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400", icon: CreditCard },
  "Pending Sample":  { color: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",   icon: Droplets },
  "Pending Lab":     { color: "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400", icon: Microscope },
  "Completed":       { color: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400", icon: CheckCircle2 },
};

const TEST_TYPES = [
  "Blood Test (CBC)", "Blood Glucose", "Lipid Panel", "Liver Function Test",
  "Kidney Function Test", "Thyroid Test", "Urine Analysis", "Stool Test",
  "X-Ray", "Ultrasound", "CT Scan", "MRI", "ECG", "Culture & Sensitivity",
];

const SPECIMEN_TYPES = [
  "Blood Sample",
  "Urine Sample",
  "Stool Sample",
  "X-Ray Imaging",
  "Ultrasound Imaging",
  "CT Scan Imaging",
  "MRI Imaging",
  "ECG Reading",
  "Culture Swab",
  "Other",
];

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["Pending Payment"];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wider ${cfg.color}`}>
      <Icon size={12} />
      {status}
    </span>
  );
}

export default function LabTests() {
  const { user } = useAuth();
  const role = user?.role;

  const [labTests, setLabTests] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Doctor: Create Lab Test modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({ patientId: "", testNames: [], notes: "", amount: 25 });
  const [creating, setCreating] = useState(false);

  // Nurse: Collect sample modal
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [collectTest, setCollectTest] = useState(null);
  const [collectForm, setCollectForm] = useState({ specimenTypes: [], sampleNotes: "" });
  const [collecting, setCollecting] = useState(false);

  // Lab Tech: Upload Result modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [resultText, setResultText] = useState("");
  const [resultFile, setResultFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // View Result modal
  const [showResultModal, setShowResultModal] = useState(false);
  const [viewTest, setViewTest] = useState(null);

  const fetchLabTests = async () => {
    try {
      setLoading(true);
      const res = await api.get("/lab-tests");
      setLabTests(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching lab tests:", err);
      setLabTests([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await api.get("/patients");
      setPatients(Array.isArray(res.data) ? res.data : res.data?.patients || []);
    } catch (err) {
      console.error("Error fetching patients:", err);
    }
  };

  useEffect(() => {
    fetchLabTests();
    if (role === "Doctor") fetchPatients();
  }, [role]);

  // Doctor: Create Lab Test
  const handleCreate = async (e) => {
    e.preventDefault();
    if (createForm.testNames.length === 0) {
      alert("Please select at least one lab test");
      return;
    }

    setCreating(true);
    try {
      await api.post("/lab-tests", createForm);
      setShowCreateModal(false);
      setCreateForm({ patientId: "", testNames: [], notes: "", amount: 25 });
      fetchLabTests();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create lab test");
    } finally {
      setCreating(false);
    }
  };

  // Receptionist: Mark as Paid
  const handleMarkPaid = async (id) => {
    try {
      await api.patch(`/lab-tests/${id}/pay`);
      fetchLabTests();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to mark as paid");
    }
  };

  // Nurse: Mark Sample Collected and forward to Lab
  const handleCollectSubmit = async (e) => {
    e.preventDefault();
    if (!collectTest) return;
    setCollecting(true);
    try {
      await api.patch(`/lab-tests/${collectTest._id}/collect`, collectForm);
      setShowCollectModal(false);
      setCollectTest(null);
      setCollectForm({ specimenTypes: [], sampleNotes: "" });
      fetchLabTests();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to collect sample");
    } finally {
      setCollecting(false);
    }
  };

  // Lab Tech: Upload Result
  const handleUploadResult = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const formData = new FormData();
      if (resultText) formData.append("resultText", resultText);
      if (resultFile) formData.append("resultFile", resultFile);
      await api.patch(`/lab-tests/${selectedTest._id}/result`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setShowUploadModal(false);
      setSelectedTest(null);
      setResultText("");
      setResultFile(null);
      fetchLabTests();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to upload result");
    } finally {
      setUploading(false);
    }
  };

  const filtered = labTests.filter((t) => {
    const name = t.patient?.name || t.patient?.user?.name || "";
    const test = t.testName || "";
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Stats
  const pendingPayment = labTests.filter(t => t.status === "Pending Payment").length;
  const pendingSample  = labTests.filter(t => t.status === "Pending Sample").length;
  const pendingLab     = labTests.filter(t => t.status === "Pending Lab").length;
  const completed      = labTests.filter(t => t.status === "Completed").length;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 sm:space-y-8">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-black text-navyBlue-900 dark:text-white sm:text-3xl">
            <FlaskConical className="text-royalBlue" size={32} />
            Lab Tests
          </h1>
          <p className="mt-1 text-sm font-bold text-navyBlue-500 dark:text-navyBlue-300">
            {role === "Doctor" && "Request lab tests and view patient results"}
            {role === "Receptionist" && "Process payments for pending lab test orders"}
            {role === "Nurse" && "Collect samples from patients with approved tests"}
            {role === "Lab Technician" && "Analyze samples and upload test results"}
            {role === "Patient" && "View your lab test history and results"}
            {role === "Admin" && "Complete overview of all lab test activity"}
          </p>
        </div>
        {role === "Doctor" && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-royalBlue px-6 py-3 text-sm font-black text-white shadow-lg shadow-royalBlue/30 transition-all hover:scale-105 active:scale-95 sm:w-auto"
          >
            <Plus size={18} /> Request Lab Test
          </button>
        )}
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {[
          { label: "Pending Payment", value: pendingPayment, icon: CreditCard, color: "text-orange-500" },
          { label: "Pending Sample",  value: pendingSample,  icon: Droplets,   color: "text-blue-500" },
          { label: "Pending Lab",     value: pendingLab,     icon: Microscope, color: "text-purple-500" },
          { label: "Completed",       value: completed,      icon: CheckCircle2, color: "text-green-500" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-navyBlue-100 bg-white p-5 dark:border-navyBlue-800 dark:bg-navyBlue-900/40 shadow-sm">
            <s.icon className={`mb-3 ${s.color}`} size={22} />
            <div className="text-3xl font-black text-navyBlue-900 dark:text-white">{s.value}</div>
            <div className="mt-1 text-[11px] font-black uppercase tracking-wider text-navyBlue-400">{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Search + Table */}
      <motion.div variants={itemVariants} className="rounded-3xl border border-navyBlue-100 bg-white overflow-hidden shadow-sm dark:border-navyBlue-800 dark:bg-navyBlue-900/40">
        <div className="flex flex-col gap-4 border-b border-navyBlue-100 p-4 sm:p-6 sm:flex-row sm:items-center sm:justify-between dark:border-navyBlue-800">
          <h2 className="text-xl font-black text-navyBlue-900 dark:text-white">
            {role === "Receptionist" ? "Pending Payments" :
             role === "Nurse" ? "Samples to Collect" :
             role === "Lab Technician" ? "Tests to Analyze" :
             "All Lab Tests"}
          </h2>
          <div className="flex w-full items-center gap-3 rounded-2xl border border-navyBlue-100 bg-navyBlue-50 px-4 py-2.5 dark:border-navyBlue-700 dark:bg-navyBlue-800/50 sm:w-auto">
            <Search size={16} className="text-navyBlue-400" />
            <input
              type="text"
              placeholder="Search patient or test..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-sm font-bold text-navyBlue-900 outline-none placeholder:text-navyBlue-300 dark:text-white sm:w-48"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-royalBlue border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <FlaskConical className="mx-auto mb-4 text-navyBlue-200" size={48} />
            <p className="text-base font-bold text-navyBlue-300">No lab tests found</p>
          </div>
        ) : (
          <div className="space-y-3 p-3 sm:p-4">
            {filtered.map((test) => {
                  const patientName = test.patient?.name || test.patient?.user?.name || "Unknown";
                  const doctorName  = test.doctor?.name || "Unknown";
                  const date = new Date(test.createdAt).toLocaleDateString();

                  return (
                    <motion.div
                      key={test._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="grid min-w-0 grid-cols-[minmax(135px,1.05fr)_minmax(145px,1.1fr)_minmax(72px,0.55fr)_minmax(126px,0.8fr)_minmax(128px,0.85fr)_minmax(86px,auto)] items-center gap-3 rounded-2xl border border-navyBlue-100 bg-navyBlue-50/40 p-3 transition-colors hover:bg-navyBlue-50 dark:border-navyBlue-800/60 dark:bg-navyBlue-950/30 dark:hover:bg-navyBlue-800/20"
                    >
                        <div className="flex min-w-0 items-center gap-2">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-royalBlue/10 text-sm font-black text-royalBlue">
                            {patientName[0]}
                          </div>
                          <div className="min-w-0">
                            <div className="truncate font-bold text-navyBlue-900 dark:text-white">{patientName}</div>
                          </div>
                        </div>
                        <div className="min-w-0">
                          <div className="truncate font-bold text-navyBlue-700 dark:text-navyBlue-200">{test.testName}</div>
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-navyBlue-500 dark:text-navyBlue-300">{test.specimenType || "Awaiting"}</div>
                        </div>
                        <div className="min-w-0">
                          <StatusBadge status={test.status} />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-navyBlue-500 dark:text-navyBlue-300">{doctorName}</div>
                          <div className="text-xs font-bold text-navyBlue-400">{date}</div>
                        </div>
                        <div className="flex min-w-0 items-center justify-end gap-2">
                          {/* Receptionist: Pay */}
                          {(role === "Receptionist" || role === "Admin" || role === "Accountant") && test.status === "Pending Payment" && (
                            <button
                              onClick={() => handleMarkPaid(test._id)}
                              className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-3 py-1.5 text-xs font-black text-white transition-all hover:scale-105 hover:bg-orange-600"
                            >
                              <CreditCard size={13} /> Mark Paid
                            </button>
                          )}

                          {/* Nurse: Collect Sample */}
                          {role === "Nurse" && test.status === "Pending Sample" && (
                            <button
                              onClick={() => {
                                setCollectTest(test);
                                setCollectForm({
                                  specimenTypes: Array.isArray(test.specimenTypes) && test.specimenTypes.length
                                    ? test.specimenTypes
                                    : test.specimenType
                                      ? test.specimenType.split(",").map((item) => item.trim()).filter(Boolean)
                                      : [],
                                  sampleNotes: test.sampleNotes || ""
                                });
                                setShowCollectModal(true);
                              }}
                              className="flex items-center gap-1 rounded-xl bg-blue-500 px-2.5 py-1.5 text-xs font-black text-white transition-all hover:scale-105 hover:bg-blue-600"
                            >
                              <Droplets size={13} /> <span>Forward</span>
                            </button>
                          )}

                          {/* Lab Tech: Upload Result */}
                          {role === "Lab Technician" && test.status === "Pending Lab" && (
                            <button
                              onClick={() => { setSelectedTest(test); setShowUploadModal(true); }}
                              className="flex items-center gap-1.5 rounded-xl bg-purple-500 px-3 py-1.5 text-xs font-black text-white transition-all hover:scale-105 hover:bg-purple-600"
                            >
                              <Upload size={13} /> Upload Result
                            </button>
                          )}

                          {/* View Result for completed */}
                          {test.status === "Completed" && (
                            <button
                              onClick={() => { setViewTest(test); setShowResultModal(true); }}
                              className="flex items-center gap-1.5 rounded-xl bg-green-500 px-3 py-1.5 text-xs font-black text-white transition-all hover:scale-105 hover:bg-green-600"
                            >
                              <FileText size={13} /> View Result
                            </button>
                          )}
                        </div>
                    </motion.div>
                  );
                })}
          </div>
        )}
      </motion.div>

      {/* DOCTOR: Create Lab Test Modal */}
      {showCreateModal && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-2 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-5xl rounded-[22px] border border-white/10 bg-navyBlue-950 p-3 shadow-2xl sm:p-4"
          >
            <button onClick={() => setShowCreateModal(false)} className="absolute right-3 top-3 rounded-full p-2 text-navyBlue-300 hover:bg-white/10 hover:text-white">
              <X size={16} />
            </button>
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded-xl bg-royalBlue/20 p-2">
                <FlaskConical className="text-royalBlue" size={18} />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">Request Lab Tests</h2>
                <p className="text-[11px] text-navyBlue-400">Select patient and one or more test types</p>
              </div>
            </div>

            <form onSubmit={handleCreate} className="space-y-2">
              <div>
                <label className="mb-0.5 block text-[10px] font-black uppercase tracking-wider text-navyBlue-400">Patient</label>
                <select
                  required
                  value={createForm.patientId}
                  onChange={(e) => setCreateForm({ ...createForm, patientId: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-royalBlue focus:outline-none focus:ring-2 focus:ring-royalBlue/20 [&>option]:bg-navyBlue-900"
                >
                  <option value="">— Select Patient —</option>
                  {patients.map((p) => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between gap-3">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-navyBlue-400">Test Types</label>
                  <span className="rounded-full bg-royalBlue/20 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-royalBlue">
                    {createForm.testNames.length} selected
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 rounded-xl border border-white/10 bg-white/5 p-1.5 md:grid-cols-4">
                  {TEST_TYPES.map((test) => {
                    const checked = createForm.testNames.includes(test);
                    return (
                      <label
                        key={test}
                        className={`flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border px-2 text-[10px] font-black transition ${
                          checked
                            ? "border-royalBlue bg-royalBlue/25 text-white"
                            : "border-white/10 bg-white/5 text-navyBlue-300 hover:bg-white/10"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            setCreateForm((prev) => ({
                              ...prev,
                              testNames: checked
                                ? prev.testNames.filter((item) => item !== test)
                                : [...prev.testNames, test],
                            }));
                          }}
                          className="h-3 w-3 rounded border-white/20 text-royalBlue focus:ring-royalBlue"
                        />
                        <span className="leading-tight">{test}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="mb-0.5 block text-[10px] font-black uppercase tracking-wider text-navyBlue-400">Notes (Optional)</label>
                <textarea
                  rows={1}
                  value={createForm.notes}
                  onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })}
                  placeholder="Any special instructions..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-navyBlue-500 focus:border-royalBlue focus:outline-none focus:ring-2 focus:ring-royalBlue/20 resize-none"
                />
              </div>

              <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
                <div>
                <label className="mb-0.5 block text-[10px] font-black uppercase tracking-wider text-navyBlue-400">Lab Fee Per Test</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={createForm.amount}
                  onChange={(e) => setCreateForm({ ...createForm, amount: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-royalBlue focus:outline-none focus:ring-2 focus:ring-royalBlue/20"
                />
                </div>
                <div className="rounded-xl bg-white/5 px-4 py-2 text-sm font-black text-royalBlue">
                  Total: ${((Number(createForm.amount) || 0) * createForm.testNames.length).toLocaleString()}
                </div>
              </div>

              <div className="flex flex-col justify-end gap-2 sm:flex-row">
                <button type="button" onClick={() => setShowCreateModal(false)} className="rounded-full px-5 py-2 text-sm font-bold text-navyBlue-300 hover:text-white hover:bg-white/5">Cancel</button>
                <button type="submit" disabled={creating || createForm.testNames.length === 0} className="rounded-full bg-royalBlue px-7 py-2 text-sm font-black text-white shadow-lg shadow-royalBlue/30 hover:scale-105 active:scale-95 disabled:opacity-50 transition-transform">
                  {creating ? "Sending..." : "Send Request"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>,
        document.body
      )}

      {/* NURSE: Collect Sample Modal */}
      {showCollectModal && collectTest && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-[24px] border border-white/10 bg-navyBlue-950 p-5 shadow-2xl sm:rounded-[32px] sm:p-8"
          >
            <button onClick={() => setShowCollectModal(false)} className="absolute right-5 top-5 rounded-full p-2 text-navyBlue-300 hover:bg-white/10 hover:text-white">
              <X size={20} />
            </button>
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-2xl bg-blue-500/20 p-3">
                <Droplets className="text-blue-400" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Forward to Lab</h2>
                <p className="text-xs text-navyBlue-400">{collectTest.testName} - {collectTest.patient?.name || collectTest.patient?.user?.name || "Patient"}</p>
              </div>
            </div>

            <form onSubmit={handleCollectSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-wider text-navyBlue-400">Sample / Procedure Types</label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {SPECIMEN_TYPES.map((type) => {
                    const checked = collectForm.specimenTypes.includes(type);
                    return (
                      <label
                        key={type}
                        className={`flex cursor-pointer items-center gap-2 rounded-2xl border px-3 py-2.5 text-xs font-black transition ${
                          checked
                            ? "border-blue-500 bg-blue-500/20 text-white"
                            : "border-white/10 bg-white/5 text-navyBlue-300 hover:bg-white/10"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            setCollectForm((prev) => ({
                              ...prev,
                              specimenTypes: checked
                                ? prev.specimenTypes.filter((item) => item !== type)
                                : [...prev.specimenTypes, type],
                            }));
                          }}
                          className="h-4 w-4 rounded border-white/20 text-blue-500 focus:ring-blue-500"
                        />
                        {type}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-navyBlue-400">Nurse Notes</label>
                <textarea
                  rows={3}
                  value={collectForm.sampleNotes}
                  onChange={(e) => setCollectForm({ ...collectForm, sampleNotes: e.target.value })}
                  placeholder="Sample condition, timing, or handoff notes..."
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-navyBlue-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                />
              </div>

              <div className="flex flex-col justify-end gap-3 pt-2 sm:flex-row">
                <button type="button" onClick={() => setShowCollectModal(false)} className="rounded-full px-6 py-3 text-sm font-bold text-navyBlue-300 hover:text-white hover:bg-white/5">Cancel</button>
                <button type="submit" disabled={collecting || collectForm.specimenTypes.length === 0} className="rounded-full bg-blue-600 px-8 py-3 text-sm font-black text-white shadow-lg shadow-blue-600/30 hover:scale-105 active:scale-95 disabled:opacity-50 transition-transform">
                  {collecting ? "Forwarding..." : "Send to Lab"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>,
        document.body
      )}

      {/* LAB TECH: Upload Result Modal */}
      {showUploadModal && selectedTest && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-[24px] border border-white/10 bg-navyBlue-950 p-5 shadow-2xl sm:rounded-[32px] sm:p-8"
          >
            <button onClick={() => setShowUploadModal(false)} className="absolute right-5 top-5 rounded-full p-2 text-navyBlue-300 hover:bg-white/10 hover:text-white">
              <X size={20} />
            </button>
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-2xl bg-purple-500/20 p-3">
                <Microscope className="text-purple-400" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Upload Result</h2>
                <p className="text-xs text-navyBlue-400">{selectedTest.testName} — {selectedTest.patient?.name || "Patient"}</p>
              </div>
            </div>

            <div className="mb-5 rounded-2xl bg-white/5 p-4">
              <div className="text-xs font-black uppercase tracking-wider text-navyBlue-400">Nurse Handoff</div>
              <div className="mt-2 text-sm font-bold text-white">{selectedTest.specimenType || "Sample forwarded"}</div>
              {selectedTest.sampleNotes && <div className="mt-1 text-sm text-navyBlue-300">{selectedTest.sampleNotes}</div>}
            </div>

            <form onSubmit={handleUploadResult} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-navyBlue-400">Result Notes / Summary</label>
                <textarea
                  rows={4}
                  value={resultText}
                  onChange={(e) => setResultText(e.target.value)}
                  placeholder="Enter test findings, values, and interpretation..."
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-navyBlue-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-navyBlue-400">Upload File (PDF / Image)</label>
                <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-dashed border-white/20 bg-white/5 p-4 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => document.getElementById("resultFileInput").click()}>
                  <Upload className="text-purple-400" size={20} />
                  <span className="min-w-0 truncate text-sm text-navyBlue-300">
                    {resultFile ? resultFile.name : "Click to select PDF or image file"}
                  </span>
                </div>
                <input id="resultFileInput" type="file" accept=".pdf,image/*" className="hidden" onChange={(e) => setResultFile(e.target.files[0])} />
              </div>

              <div className="flex flex-col justify-end gap-3 pt-2 sm:flex-row">
                <button type="button" onClick={() => setShowUploadModal(false)} className="rounded-full px-6 py-3 text-sm font-bold text-navyBlue-300 hover:text-white hover:bg-white/5">Cancel</button>
                <button type="submit" disabled={uploading || (!resultText && !resultFile)} className="rounded-full bg-purple-600 px-8 py-3 text-sm font-black text-white shadow-lg shadow-purple-600/30 hover:scale-105 active:scale-95 disabled:opacity-50 transition-transform">
                  {uploading ? "Uploading..." : "Submit Result"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>,
        document.body
      )}

      {/* View Result Modal */}
      {showResultModal && viewTest && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-[24px] border border-white/10 bg-navyBlue-950 p-5 shadow-2xl sm:rounded-[32px] sm:p-8"
          >
            <button onClick={() => setShowResultModal(false)} className="absolute right-5 top-5 rounded-full p-2 text-navyBlue-300 hover:bg-white/10 hover:text-white">
              <X size={20} />
            </button>
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-2xl bg-green-500/20 p-3">
                <CheckCircle2 className="text-green-400" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Lab Result</h2>
                <p className="text-xs text-navyBlue-400">{viewTest.testName}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-white/5 p-4">
                <div className="text-xs font-black uppercase tracking-wider text-navyBlue-400 mb-2">Patient</div>
                <div className="text-sm font-bold text-white">{viewTest.patient?.name || viewTest.patient?.user?.name || "—"}</div>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <div className="text-xs font-black uppercase tracking-wider text-navyBlue-400 mb-2">Lab Technician</div>
                <div className="text-sm font-bold text-white">{viewTest.labTechnician?.name || "—"}</div>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <div className="text-xs font-black uppercase tracking-wider text-navyBlue-400 mb-2">Sample / Procedure</div>
                <div className="text-sm font-bold text-white">{viewTest.specimenType || "None"}</div>
                {viewTest.sampleNotes && <div className="mt-2 text-sm text-navyBlue-300">{viewTest.sampleNotes}</div>}
              </div>
              {viewTest.resultText && (
                <div className="rounded-2xl bg-white/5 p-4">
                  <div className="text-xs font-black uppercase tracking-wider text-navyBlue-400 mb-2">Result Notes</div>
                  <div className="text-sm text-navyBlue-200 whitespace-pre-wrap">{viewTest.resultText}</div>
                </div>
              )}
              {viewTest.resultFileUrl && (
                <a
                  href={viewTest.resultFileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-2xl bg-royalBlue/20 p-4 text-royalBlue transition-colors hover:bg-royalBlue/30"
                >
                  <FileText size={20} />
                  <span className="text-sm font-black">View Attached File</span>
                  <ChevronRight size={16} className="ml-auto" />
                </a>
              )}
            </div>

            <button onClick={() => setShowResultModal(false)} className="mt-6 w-full rounded-2xl bg-white/5 py-3 text-sm font-black text-white hover:bg-white/10 transition-colors">
              Close
            </button>
          </motion.div>
        </div>,
        document.body
      )}
    </motion.div>
  );
}
