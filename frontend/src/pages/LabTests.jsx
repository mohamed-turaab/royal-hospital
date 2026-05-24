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
  const [createForm, setCreateForm] = useState({ patientId: "", testName: "", notes: "" });
  const [creating, setCreating] = useState(false);

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
    setCreating(true);
    try {
      await api.post("/lab-tests", createForm);
      setShowCreateModal(false);
      setCreateForm({ patientId: "", testName: "", notes: "" });
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

  // Nurse: Mark Sample Collected
  const handleCollect = async (id) => {
    try {
      await api.patch(`/lab-tests/${id}/collect`);
      fetchLabTests();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to collect sample");
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
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-navyBlue-900 dark:text-white flex items-center gap-3">
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
            className="flex items-center gap-2 rounded-2xl bg-royalBlue px-6 py-3 text-sm font-black text-white shadow-lg shadow-royalBlue/30 transition-all hover:scale-105 active:scale-95"
          >
            <Plus size={18} /> Request Lab Test
          </button>
        )}
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 md:grid-cols-4">
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
        <div className="flex flex-col gap-4 border-b border-navyBlue-100 p-6 sm:flex-row sm:items-center sm:justify-between dark:border-navyBlue-800">
          <h2 className="text-xl font-black text-navyBlue-900 dark:text-white">
            {role === "Receptionist" ? "Pending Payments" :
             role === "Nurse" ? "Samples to Collect" :
             role === "Lab Technician" ? "Tests to Analyze" :
             "All Lab Tests"}
          </h2>
          <div className="flex items-center gap-3 rounded-2xl border border-navyBlue-100 bg-navyBlue-50 px-4 py-2.5 dark:border-navyBlue-700 dark:bg-navyBlue-800/50">
            <Search size={16} className="text-navyBlue-400" />
            <input
              type="text"
              placeholder="Search patient or test..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-sm font-bold text-navyBlue-900 outline-none placeholder:text-navyBlue-300 dark:text-white w-48"
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
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-navyBlue-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-navyBlue-400 dark:bg-navyBlue-900/30 dark:text-navyBlue-300">
                <tr>
                  <th className="px-6 py-4">Patient</th>
                  <th className="px-6 py-4">Test</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Doctor</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navyBlue-50 dark:divide-navyBlue-800/50">
                {filtered.map((test) => {
                  const patientName = test.patient?.name || test.patient?.user?.name || "Unknown";
                  const doctorName  = test.doctor?.name || "Unknown";
                  const date = new Date(test.createdAt).toLocaleDateString();

                  return (
                    <motion.tr
                      key={test._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="group transition-colors hover:bg-navyBlue-50/50 dark:hover:bg-navyBlue-800/20"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-royalBlue/10 text-sm font-black text-royalBlue">
                            {patientName[0]}
                          </div>
                          <span className="font-bold text-navyBlue-900 dark:text-white">{patientName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-navyBlue-700 dark:text-navyBlue-200">{test.testName}</td>
                      <td className="px-6 py-4"><StatusBadge status={test.status} /></td>
                      <td className="px-6 py-4 text-sm text-navyBlue-500 dark:text-navyBlue-400">{doctorName}</td>
                      <td className="px-6 py-4 text-sm text-navyBlue-400">{date}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
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
                              onClick={() => handleCollect(test._id)}
                              className="flex items-center gap-1.5 rounded-xl bg-blue-500 px-3 py-1.5 text-xs font-black text-white transition-all hover:scale-105 hover:bg-blue-600"
                            >
                              <Droplets size={13} /> Collect Sample
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
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* DOCTOR: Create Lab Test Modal */}
      {showCreateModal && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-md rounded-[32px] border border-white/10 bg-navyBlue-950 p-8 shadow-2xl"
          >
            <button onClick={() => setShowCreateModal(false)} className="absolute right-5 top-5 rounded-full p-2 text-navyBlue-300 hover:bg-white/10 hover:text-white">
              <X size={20} />
            </button>
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-2xl bg-royalBlue/20 p-3">
                <FlaskConical className="text-royalBlue" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Request Lab Test</h2>
                <p className="text-xs text-navyBlue-400">Select patient and test type</p>
              </div>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-navyBlue-400">Patient</label>
                <select
                  required
                  value={createForm.patientId}
                  onChange={(e) => setCreateForm({ ...createForm, patientId: e.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-royalBlue focus:outline-none focus:ring-2 focus:ring-royalBlue/20 [&>option]:bg-navyBlue-900"
                >
                  <option value="">— Select Patient —</option>
                  {patients.map((p) => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-navyBlue-400">Test Type</label>
                <select
                  required
                  value={createForm.testName}
                  onChange={(e) => setCreateForm({ ...createForm, testName: e.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-royalBlue focus:outline-none focus:ring-2 focus:ring-royalBlue/20 [&>option]:bg-navyBlue-900"
                >
                  <option value="">— Select Test —</option>
                  {TEST_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-navyBlue-400">Notes (Optional)</label>
                <textarea
                  rows={3}
                  value={createForm.notes}
                  onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })}
                  placeholder="Any special instructions..."
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-navyBlue-500 focus:border-royalBlue focus:outline-none focus:ring-2 focus:ring-royalBlue/20 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="rounded-full px-6 py-3 text-sm font-bold text-navyBlue-300 hover:text-white hover:bg-white/5">Cancel</button>
                <button type="submit" disabled={creating} className="rounded-full bg-royalBlue px-8 py-3 text-sm font-black text-white shadow-lg shadow-royalBlue/30 hover:scale-105 active:scale-95 disabled:opacity-50 transition-transform">
                  {creating ? "Sending..." : "Send Request"}
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
            className="relative w-full max-w-md rounded-[32px] border border-white/10 bg-navyBlue-950 p-8 shadow-2xl"
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
                <div className="flex items-center gap-3 rounded-2xl border border-dashed border-white/20 bg-white/5 p-4 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => document.getElementById("resultFileInput").click()}>
                  <Upload className="text-purple-400" size={20} />
                  <span className="text-sm text-navyBlue-300">
                    {resultFile ? resultFile.name : "Click to select PDF or image file"}
                  </span>
                </div>
                <input id="resultFileInput" type="file" accept=".pdf,image/*" className="hidden" onChange={(e) => setResultFile(e.target.files[0])} />
              </div>

              <div className="flex justify-end gap-3 pt-2">
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
            className="relative w-full max-w-lg rounded-[32px] border border-white/10 bg-navyBlue-950 p-8 shadow-2xl"
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
