import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  UploadCloud, 
  Search, 
  CheckCircle2,
  FileBadge,
  Clock,
  Download,
  Eye,
  X
} from "lucide-react";
import api from "../../services/api";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function DoctorReports() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  
  // Data states
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  
  // Quick Note States
  const [notePatient, setNotePatient] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");

  // Modal State for viewing notes
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.get("/reports");
      setReports(res.data);
    } catch (error) {
      alert("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUploadFile = async () => {
    if (!file) return;
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", file.name);
    formData.append("patientName", "Unknown Patient"); // In a real app, you'd select a patient
    formData.append("type", "Document");

    try {
      const res = await api.post("/reports", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setReports([res.data, ...reports]);
      setFile(null);
      alert("File uploaded successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to upload file");
    }
  };

  const handleSaveNote = async () => {
    if (!noteTitle || !noteContent) {
      return alert("Title and content are required");
    }

    try {
      const res = await api.post("/reports", {
        title: noteTitle,
        patientName: notePatient || "Unknown Patient",
        type: "Clinical Note",
        content: noteContent
      });
      setReports([res.data, ...reports]);
      setNotePatient("");
      setNoteTitle("");
      setNoteContent("");
      alert("Clinical note saved");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save note");
    }
  };

  const handleView = (report) => {
    if (report.fileUrl) {
      window.open(`http://localhost:5000${report.fileUrl}`, "_blank");
    } else {
      setSelectedNote(report);
    }
  };

  const handleDownload = (report) => {
    if (report.fileUrl) {
      const link = document.createElement("a");
      link.href = `http://localhost:5000${report.fileUrl}`;
      link.download = report.fileName || "document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("Clinical notes cannot be downloaded directly. Please view them instead.");
    }
  };

  const toggleStatus = async (report) => {
    try {
      const newStatus = report.status === "Reviewed" ? "Pending Review" : "Reviewed";
      const res = await api.patch(`/reports/${report._id}/status`, { status: newStatus });
      setReports(reports.map(r => r._id === report._id ? res.data : r));
      alert(`Status updated to ${newStatus}`);
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const pendingCount = reports.filter(r => r.status === "Pending Review").length;

  const categories = [
    { name: "Lab Result", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { name: "Imaging", color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
    { name: "Clinical Note", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { name: "Document", color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
    { name: "Other", color: "text-gray-500", bg: "bg-gray-50 dark:bg-gray-800" },
  ].map(cat => ({
    ...cat,
    count: reports.filter(r => r.type === cat.name).length
  })).filter(cat => cat.count > 0);

  const filteredReports = reports.filter(r => {
    if (filter === "All") return true;
    if (filter === "Pending") return r.status === "Pending Review";
    return r.type === filter;
  });

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-black text-navyBlue-900 dark:text-white">Reports & Documents</h1>
          <p className="text-sm font-medium text-navyBlue-500 dark:text-navyBlue-400">Manage lab results, imaging, and treatment notes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Upload & Create Area */}
        <div className="xl:col-span-2 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* File Uploader */}
            <div className="panel p-6 flex flex-col h-full">
              <h3 className="font-bold text-navyBlue-900 dark:text-white mb-4">Upload Patient Document</h3>
              
              <div 
                className={`flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl transition-all ${
                  dragActive 
                    ? "border-royalBlue bg-royalBlue/5" 
                    : "border-navyBlue-200 dark:border-navyBlue-700 bg-navyBlue-50/50 dark:bg-navyBlue-800/30 hover:border-navyBlue-300 dark:hover:border-navyBlue-600"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {file ? (
                  <div className="text-center">
                    <CheckCircle2 size={48} className="mx-auto text-emerald-500 mb-3" />
                    <p className="font-bold text-navyBlue-900 dark:text-white truncate max-w-[200px] mb-1">{file.name}</p>
                    <p className="text-xs text-navyBlue-500 mb-4">Ready to upload</p>
                    <button className="btn-primary py-2 px-6 shadow-none text-xs" onClick={handleUploadFile}>
                      Upload File
                    </button>
                    <button className="block w-full text-center mt-3 text-xs text-red-500 hover:underline" onClick={() => setFile(null)}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <UploadCloud size={48} className="mx-auto text-royalBlue mb-3" />
                    <p className="font-bold text-navyBlue-900 dark:text-white mb-1">Drag & Drop files here</p>
                    <p className="text-xs text-navyBlue-500 mb-4">PDF, JPG, PNG, or DICOM (Max 50MB)</p>
                    <label className="btn-secondary py-2 px-6 shadow-none text-xs cursor-pointer inline-flex">
                      Browse Files
                      <input type="file" className="hidden" onChange={(e) => e.target.files && setFile(e.target.files[0])} />
                    </label>
                  </div>
                )}
              </div>
            </div>
            
            {/* Quick Note */}
            <div className="panel p-6 flex flex-col h-full">
              <h3 className="font-bold text-navyBlue-900 dark:text-white mb-4">Quick Clinical Note</h3>
              
              <div className="flex-1 flex flex-col gap-4">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-navyBlue-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search patient..." 
                    value={notePatient}
                    onChange={(e) => setNotePatient(e.target.value)}
                    className="w-full bg-navyBlue-50 border border-navyBlue-100 rounded-xl py-2 pl-9 pr-3 text-sm font-medium text-navyBlue-900 focus:outline-none focus:border-royalBlue dark:bg-navyBlue-950 dark:border-navyBlue-800 dark:text-white"
                  />
                </div>
                
                <input 
                  type="text" 
                  placeholder="Note Title (e.g. Initial Assessment)" 
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full bg-navyBlue-50 border border-navyBlue-100 rounded-xl py-2 px-3 text-sm font-medium text-navyBlue-900 focus:outline-none focus:border-royalBlue dark:bg-navyBlue-950 dark:border-navyBlue-800 dark:text-white"
                />
                
                <textarea 
                  className="w-full flex-1 min-h-[100px] bg-navyBlue-50 border border-navyBlue-100 rounded-xl py-2 px-3 text-sm font-medium text-navyBlue-900 focus:outline-none focus:border-royalBlue dark:bg-navyBlue-950 dark:border-navyBlue-800 dark:text-white resize-none"
                  placeholder="Enter clinical observations, diagnosis, or treatment updates here..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                ></textarea>
                
                <button className="btn-primary py-2.5 w-full justify-center" onClick={handleSaveNote}>Save Note</button>
              </div>
            </div>
          </div>
          
          {/* Recent Reports Table */}
          <div className="panel p-0 overflow-hidden">
            <div className="p-6 border-b border-navyBlue-100 dark:border-navyBlue-800 flex items-center justify-between">
              <h3 className="font-bold text-navyBlue-900 dark:text-white">Document History</h3>
              <div className="flex gap-2">
                {["All", "Lab Result", "Imaging"].map(f => (
                  <button 
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                      filter === f 
                        ? 'text-royalBlue bg-royalBlue/10' 
                        : 'text-navyBlue-600 hover:bg-navyBlue-50 dark:text-navyBlue-300 dark:hover:bg-navyBlue-800'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-navyBlue-50/50 dark:bg-navyBlue-800/20 text-xs uppercase tracking-widest text-navyBlue-500 border-b border-navyBlue-100 dark:border-navyBlue-800">
                    <th className="p-4 font-bold">Document</th>
                    <th className="p-4 font-bold">Patient</th>
                    <th className="p-4 font-bold">Date</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="5" className="p-8 text-center text-navyBlue-500">Loading reports...</td></tr>
                  ) : filteredReports.length === 0 ? (
                    <tr><td colSpan="5" className="p-8 text-center text-navyBlue-500">No documents found.</td></tr>
                  ) : (
                    filteredReports.map((report) => (
                      <tr key={report._id} className="border-b border-navyBlue-50 dark:border-navyBlue-800/50 hover:bg-navyBlue-50/30 dark:hover:bg-navyBlue-800/20 transition-colors group">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-navyBlue-50 dark:bg-navyBlue-800 flex items-center justify-center text-royalBlue shrink-0">
                              <FileText size={18} />
                            </div>
                            <div>
                              <p className="font-bold text-navyBlue-900 dark:text-white text-sm truncate max-w-[150px]">{report.title}</p>
                              <p className="text-xs text-navyBlue-500">{report.type} {report.size ? `• ${report.size}` : ''}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-navyBlue-900 dark:text-white text-sm">{report.patientName || "Unknown"}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-navyBlue-600 dark:text-navyBlue-300">
                            {new Date(report.createdAt).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="p-4">
                          <button 
                            onClick={() => toggleStatus(report)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-colors hover:opacity-80 ${
                              report.status === 'Reviewed' 
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800'
                                : 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800'
                            }`}
                          >
                            {report.status}
                          </button>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleView(report)} className="p-2 text-navyBlue-400 hover:text-royalBlue bg-white dark:bg-navyBlue-900 shadow-sm border border-navyBlue-100 dark:border-navyBlue-700 rounded-lg transition-colors">
                              <Eye size={16} />
                            </button>
                            <button onClick={() => handleDownload(report)} className="p-2 text-navyBlue-400 hover:text-royalBlue bg-white dark:bg-navyBlue-900 shadow-sm border border-navyBlue-100 dark:border-navyBlue-700 rounded-lg transition-colors">
                              <Download size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 bg-navyBlue-50/50 dark:bg-navyBlue-800/20 text-center border-t border-navyBlue-100 dark:border-navyBlue-800">
              <button onClick={() => setFilter("All")} className="text-sm font-bold text-royalBlue hover:text-royalBlue-700 transition-colors">View All Documents</button>
            </div>
          </div>
          
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-1 space-y-6">
          <div className="panel p-6 bg-navyBlue text-white border-transparent relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <FileBadge size={100} />
            </div>
            <h3 className="font-bold mb-2 relative z-10">Pending Reviews</h3>
            <p className="text-4xl font-black mb-1 relative z-10">{pendingCount}</p>
            <p className="text-sm text-navyBlue-300 relative z-10">Requires your signature</p>
            <button 
              onClick={() => setFilter("Pending")}
              className="mt-6 w-full py-2.5 bg-white text-navyBlue font-bold rounded-xl shadow-lg hover:bg-navyBlue-50 transition-colors relative z-10"
            >
              Review Now
            </button>
          </div>
          
          <div className="panel p-6">
            <h3 className="font-bold text-navyBlue-900 dark:text-white mb-4">Document Categories</h3>
            <div className="space-y-3">
              {categories.length === 0 && <p className="text-sm text-navyBlue-500">No documents yet.</p>}
              {categories.map(cat => (
                <div 
                  key={cat.name} 
                  onClick={() => setFilter(cat.name)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-navyBlue-50 dark:hover:bg-navyBlue-800 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cat.bg} ${cat.color}`}>
                      <FileText size={14} />
                    </div>
                    <span className="text-sm font-bold text-navyBlue-700 dark:text-navyBlue-200 group-hover:text-royalBlue transition-colors">{cat.name}</span>
                  </div>
                  <span className="text-xs font-bold text-navyBlue-400 bg-navyBlue-50 dark:bg-navyBlue-800 px-2 py-1 rounded-md">
                    {cat.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Note Preview Modal */}
      <AnimatePresence>
        {selectedNote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navyBlue-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-navyBlue-900 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-between items-center p-6 border-b border-navyBlue-100 dark:border-navyBlue-800">
                <div>
                  <h3 className="text-xl font-bold text-navyBlue-900 dark:text-white">{selectedNote.title}</h3>
                  <p className="text-sm text-navyBlue-500 mt-1">Patient: {selectedNote.patientName || 'Unknown'} • {new Date(selectedNote.createdAt).toLocaleString()}</p>
                </div>
                <button onClick={() => setSelectedNote(null)} className="p-2 text-navyBlue-400 hover:bg-navyBlue-50 dark:hover:bg-navyBlue-800 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto">
                <div className="bg-navyBlue-50 dark:bg-navyBlue-950 p-6 rounded-xl border border-navyBlue-100 dark:border-navyBlue-800 whitespace-pre-wrap text-navyBlue-800 dark:text-navyBlue-200">
                  {selectedNote.content || "No content provided."}
                </div>
              </div>
              <div className="p-6 border-t border-navyBlue-100 dark:border-navyBlue-800 flex justify-end gap-3 bg-gray-50/50 dark:bg-navyBlue-900/50">
                <button onClick={() => setSelectedNote(null)} className="btn-secondary">Close</button>
                <button 
                  onClick={() => {
                    toggleStatus(selectedNote);
                    setSelectedNote(null);
                  }} 
                  className="btn-primary"
                >
                  Mark as {selectedNote.status === 'Reviewed' ? 'Pending' : 'Reviewed'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
