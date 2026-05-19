import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/Avatar";
import { 
  Mail, 
  ShieldCheck, 
  ArrowLeft, 
  BadgeCheck, 
  Camera, 
  Settings, 
  Bell, 
  Lock, 
  User, 
  Globe, 
  Trash2,
  CheckCircle2,
  ChevronRight,
  LogOut,
  Check,
  History,
  Award,
  Users,
  Database,
  Laptop,
  Smartphone,
  Tablet,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  UserCheck,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  QrCode,
  HardDrive,
  Cpu,
  Compass,
  LayoutGrid,
  Type,
  Palette,
  Activity,
  Info
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { rolePath } from "../config/roles";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 22 }
  }
};

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role = user?.role || "Admin";

  // Tab State
  const [activeTab, setActiveTab] = useState("general");
  const [toastMessage, setToastMessage] = useState(null);

  // Profile Form States
  const [name, setName] = useState(user?.name || "Admin ahmed");
  const [email, setEmail] = useState(user?.email || "admin@hospital.com");
  const [phone, setPhone] = useState("+252 61 777 9999");
  const [department, setDepartment] = useState("Hospital Operations & IT");
  const [employeeId, setEmployeeId] = useState("EMP-2026-8947");
  const [joinDate, setJoinDate] = useState("March 14, 2023");
  const [hospitalBranch, setHospitalBranch] = useState("Mogadishu Central Hospital");
  const [bio, setBio] = useState("Chief Operations Administrator oversighted with managing clinical infrastructure, database nodes, system access clearance, and ward operations scaling.");

  // Password / Security States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showTwoFactorWizard, setShowTwoFactorWizard] = useState(false);

  // Connected Devices state
  const [devicesList, setDevicesList] = useState([
    { id: 1, name: "Windows 11 PC (Chrome Browser)", details: "Mogadishu Network Access Point • IP: 197.82.110.15", time: "Active Session", icon: Laptop, status: "Active", isCurrent: true },
    { id: 2, name: "iPhone 15 Pro Max (Safari Mobile)", details: "Hormuud Cellular Node • IP: 102.24.8.44", time: "Active 2 hours ago", icon: Smartphone, status: "Idle", isCurrent: false },
    { id: 3, name: "iPad Pro 12.9 (Apple Chrome)", details: "Hospital Staff Wi-Fi • IP: 192.168.1.18", time: "Active 5 days ago", icon: Tablet, status: "Offline", isCurrent: false }
  ]);

  // Notifications Toggles
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushAlerts: true,
    appointmentReminders: true,
    billingAlerts: true,
    emergencyAlerts: true,
    smsAlerts: false,
    soundAlerts: true
  });

  // Preference Settings States
  const [selectedTheme, setSelectedTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [layoutDensity, setLayoutDensity] = useState(() => localStorage.getItem("layoutDensity") || "Comfortable");
  const [selectedLanguage, setSelectedLanguage] = useState(() => localStorage.getItem("selectedLanguage") || "English");
  const [fontSize, setFontSize] = useState(() => localStorage.getItem("fontSize") || "Medium");
  const [accentColor, setAccentColor] = useState(() => localStorage.getItem("accentColor") || "royalBlue");
  const [sidebarBehavior, setSidebarBehavior] = useState(() => localStorage.getItem("sidebarBehavior") || "Expanded");
  const [animationsEnabled, setAnimationsEnabled] = useState(() => (localStorage.getItem("animationsEnabled") || "true") === "true");

  // Temporary UI simulation states
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Dynamic styling and persistence effects
  useEffect(() => {
    if (selectedTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    window.dispatchEvent(new Event("storage"));
  }, [selectedTheme]);

  useEffect(() => {
    localStorage.setItem("layoutDensity", layoutDensity);
    window.dispatchEvent(new Event("storage"));
  }, [layoutDensity]);

  useEffect(() => {
    localStorage.setItem("selectedLanguage", selectedLanguage);
    window.dispatchEvent(new Event("storage"));
  }, [selectedLanguage]);

  useEffect(() => {
    localStorage.setItem("fontSize", fontSize);
    window.dispatchEvent(new Event("storage"));
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem("accentColor", accentColor);
    window.dispatchEvent(new Event("storage"));
  }, [accentColor]);

  useEffect(() => {
    localStorage.setItem("sidebarBehavior", sidebarBehavior);
    window.dispatchEvent(new Event("sidebarToggle"));
    window.dispatchEvent(new Event("storage"));
  }, [sidebarBehavior]);

  useEffect(() => {
    localStorage.setItem("animationsEnabled", animationsEnabled ? "true" : "false");
    window.dispatchEvent(new Event("storage"));
  }, [animationsEnabled]);

  const translations = {
    English: {
      title: "Aesthetic & System Preferences",
      subtitle: "Personalize display themes, grid scaling densities, typography vectors, and sidebar actions.",
      contrastTheme: "Contrast Styling Theme",
      darkNavy: "Dark Royal Navy",
      clinicalLight: "Clinical Light",
      vocabLocalization: "Interface Vocabulary & Localization",
      defaultLanguage: "Default Language",
      layoutDensity: "Layout Density Scale",
      textScaleAccent: "Text Scale & Accent Color",
      globalTextScale: "Global Text Scale",
      activeAccent: "Active Theme Accent",
      sidebarAnimation: "Sidebar & Animation Node",
      sidebarMode: "Default Sidebar Mode",
      sidebarDesc: "Keep side navigation panels fully expanded on boot.",
      transitions: "Dynamic Transition Animations",
      transitionsDesc: "Enable micro-animations, slide lists, and hover scales.",
      generalRegistry: "General Registry",
      generalRegistryDesc: "Personal identity & hospital division",
      securityCredentials: "Security & Credentials",
      securityCredentialsDesc: "Master passkeys, 2FA & active logs",
      alertsNotifications: "Alerts & Notifications",
      alertsNotificationsDesc: "Interactive real-time routing nodes",
      aestheticSettings: "Aesthetic Settings",
      aestheticSettingsDesc: "Themes, layouts & localization",
      authorizedNodes: "Authorized Nodes",
      authorizedNodesDesc: "Manage connected hardware & sessions",
      signOut: "Sign Out Session",
      personalRegistryTitle: "Personal Profile Registry",
      personalRegistrySubtitle: "Manage administrative credentials, contact endpoints, and department operations clearance.",
      saveChanges: "Save Registry Changes",
      fullName: "Full Legal Name",
      adminEmail: "Administrative Email",
      phoneEndpoint: "Phone Endpoint",
      departmentDivision: "Active Department Division",
      employeeId: "Employee Registry ID",
      joinDate: "Commission Join Date",
      primaryBranch: "Primary Hospital Branch",
      adminBio: "Administrative Bio / Mission Objective",
      deviceTitle: "Authorized Hardware Nodes",
      deviceSubtitle: "Review computer terminals currently holding valid system access tokens.",
      backToCommand: "Back to Command",
      clearanceWarning: "Clearance Status: Root System Administrator",
      clearanceDesc: "Your administrative node holds Level 5 clearance. Editing these profiles affects system-wide clinical signatures, system logs, and security stamps. Ensure contact emails remain verified.",
      logoutOther: "Logout Other Devices",
      currentTerminal: "Current Terminal",
      activeSession: "Active Session",
      dangerActions: "Danger Actions",
      dangerDesc: "Permanent deletion of this master node breaks authorization databases, patient chart keys, and emergency triggers.",
      deleteNode: "Delete Administrative Node",
      passphraseTitle: "Rotate Passphrase",
      currentPass: "Current Administrative Password",
      newPass: "New Secure Password",
      confirmPass: "Confirm New Secure Password",
      updatePass: "Update Passkey Crypt",
      tfaTitle: "Biometric 2FA Shield",
      tfaDesc: "Secure logins with mobile code generators and biometric validators. Scanning required.",
      securityCenterTitle: "Security & Credentials Center",
      securityCenterSubtitle: "Rotate credential keys, setup biometric 2FA shields, and audit login security metrics.",
      alertsCenterTitle: "Alert & Notification Channels",
      alertsCenterSubtitle: "Configure real-time event triggers, SMS gateway routes, and urgent calendar alerts.",
      masterEmailTitle: "Master Email Reports",
      masterEmailDesc: "Send daily system health audits, ward occupancy metrics, and department breakdowns.",
      pushTitle: "Push Notification Node",
      pushDesc: "Enable local terminal push popups for urgent nurse shifts and billing audits.",
      calendarTitle: "Calendar Shift Alerts",
      calendarDesc: "Notify when doctor scheduling conflicts arise or active room allocations fail.",
      billingTitle: "Accounting Invoice Triggers",
      billingDesc: "Send instant billing invoice reports and pending billing approvals to finance.",
      emergencyTitle: "Urgent ICU emergency Alerts",
      emergencyDesc: "Immediate sirens and emergency logs for rapid-response cardiac alerts.",
      smsTitle: "Cellular SMS Gateway",
      smsDesc: "Route backup text alerts directly to registered mobile devices via gateway.",
      soundTitle: "Sound Indicators FX",
      soundDesc: "Play local audio feedback during important data updates or form saving."
    }
  };

  const t = (key) => {
    return translations["English"][key] || key;
  };

  const getAccentColorClass = (type = "bg") => {
    if (type === "bg") {
      switch (accentColor) {
        case "emerald": return "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/25";
        case "purple": return "bg-purple-600 hover:bg-purple-700 shadow-purple-600/25";
        case "coral": return "bg-orange-500 hover:bg-orange-600 shadow-orange-500/25";
        default: return "bg-royalBlue hover:bg-royalBlue-700 shadow-royalBlue/25";
      }
    }
    if (type === "text") {
      switch (accentColor) {
        case "emerald": return "text-emerald-500";
        case "purple": return "text-purple-600";
        case "coral": return "text-orange-500";
        default: return "text-royalBlue";
      }
    }
    if (type === "border") {
      switch (accentColor) {
        case "emerald": return "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/15";
        case "purple": return "border-purple-600 focus:border-purple-600 focus:ring-purple-600/15";
        case "coral": return "border-orange-500 focus:border-orange-500 focus:ring-orange-500/15";
        default: return "border-royalBlue focus:border-royalBlue focus:ring-royalBlue/15";
      }
    }
    if (type === "ring") {
      switch (accentColor) {
        case "emerald": return "ring-emerald-500";
        case "purple": return "ring-purple-600";
        case "coral": return "ring-orange-500";
        default: return "ring-royalBlue";
      }
    }
  };

  const getDensityClass = () => {
    switch (layoutDensity) {
      case "Compact": return "p-4 space-y-4 text-xs";
      case "Cozy": return "p-6 space-y-6 text-sm";
      default: return "p-8 space-y-8 text-base"; // Comfortable
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case "Small": return "text-xs";
      case "Large": return "text-base md:text-lg";
      default: return "text-sm"; // Medium
    }
  };

  // Dynamic Password Strength Meter
  const getPasswordStrength = () => {
    if (!newPassword) return { score: 0, label: "None", color: "bg-white/10" };
    let score = 0;
    if (newPassword.length >= 8) score += 1;
    if (/[A-Z]/.test(newPassword)) score += 1;
    if (/[0-9]/.test(newPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 1;
    
    switch (score) {
      case 1: return { score: 25, label: "Weak", color: "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" };
      case 2: return { score: 50, label: "Fair", color: "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" };
      case 3: return { score: 75, label: "Good", color: "bg-royalYellow shadow-[0_0_10px_rgba(245,166,35,0.5)]" };
      case 4: return { score: 100, label: "Strong & Encrypted", color: "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" };
      default: return { score: 0, label: "None", color: "bg-white/10" };
    }
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast("General profile registry successfully synchronized!");
    }, 1200);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast("Verification Error: Password confirmations do not match.");
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast("Credential security keys successfully rotated!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 1200);
  };

  const toggleTwoFactor = () => {
    if (!twoFactorEnabled) {
      setShowTwoFactorWizard(true);
    } else {
      setTwoFactorEnabled(false);
      showToast("Two-Factor Cryptographic Shield deactivated.");
    }
  };

  const handleDeauthorizeAll = () => {
    setDevicesList(prev => prev.filter(d => d.isCurrent));
    showToast("Revoked active authentication tokens from all external nodes.");
  };

  const revokeDevice = (id, name) => {
    setDevicesList(prev => prev.filter(d => d.id !== id));
    showToast(`Token for node [${name}] has been permanently blocked.`);
  };

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    showToast(`Operational alert preferences modified.`);
  };

  const tabs = [
    { id: "general", label: t("generalRegistry"), icon: User, desc: t("generalRegistryDesc") },
    { id: "security", label: t("securityCredentials"), icon: Lock, desc: t("securityCredentialsDesc") },
    { id: "notifications", label: t("alertsNotifications"), icon: Bell, desc: t("alertsNotificationsDesc") },
    { id: "preferences", label: t("aestheticSettings"), icon: Settings, desc: t("aestheticSettingsDesc") },
    { id: "devices", label: t("authorizedNodes"), icon: Laptop, desc: t("authorizedNodesDesc") },
  ];


  // Map legacy bindings for custom JSX components compatibility
  const tfaEnabled = twoFactorEnabled;
  const setTfaEnabled = setTwoFactorEnabled;

  return (
    <div className="max-w-7xl mx-auto space-y-10 relative pb-16 px-4 md:px-0">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          style={{ animation: 'fadeInDown 0.3s ease-out' }}
          className={`fixed top-6 right-6 z-[100] flex items-center gap-4 rounded-2xl border border-white/10 bg-navyBlue-950/95 px-6 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md`}
        >
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr ${getAccentColorClass("bg")} text-white shadow-lg animate-pulse`}>
            <Check size={18} />
          </div>
          <div className="text-sm font-black text-white tracking-wide">
            {toastMessage}
          </div>
        </div>
      )}

      {/* Premium Hero Section */}
      <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-navyBlue-950 via-navyBlue-900 to-royalBlue/20 p-8 md:p-12 shadow-2xl border border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-royalBlue/20 via-transparent to-transparent opacity-75 pointer-events-none" />
        <div className="absolute -bottom-36 -left-36 w-80 h-80 bg-royalYellow/5 rounded-full blur-[100px] pointer-events-none animate-pulse-soft" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-end justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-royalBlue to-royalYellow opacity-70 blur-md group-hover:opacity-100 transition duration-500 animate-pulse" />
              <div className="relative rounded-full p-1 bg-navyBlue-950">
                <Avatar 
                  src={user?.profileImage} 
                  name={name} 
                  size="h-28 w-28 md:h-36 md:w-36 rounded-full ring-4 ring-white/10 shadow-2xl" 
                />
              </div>
              <button 
                onClick={() => showToast("Avatar picture upload protocol initiated.")}
                className={`absolute bottom-1 right-1 p-2.5 rounded-full ${getAccentColorClass("bg")} text-white shadow-xl hover:scale-110 transition-all border-4 border-navyBlue-950`}
              >
                <Camera size={16} />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-black uppercase tracking-widest shadow-inner">
                <BadgeCheck size={12} className="text-royalYellow animate-spin-slow" /> {role} Account
              </div>
              
              <div className="space-y-1">
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none">
                  {name}
                </h1>
                <p className="text-royalBlue-200 font-bold text-xs tracking-wide flex items-center justify-center md:justify-start gap-2">
                  <Globe size={13} className="text-royalYellow" /> Mogadishu Command Node • <span className="text-white font-mono">{email}</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            <button 
              onClick={() => setActiveTab("preferences")}
              className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white font-black text-[10px] tracking-wider uppercase transition-all shadow-lg active:scale-95 flex items-center gap-2"
            >
              <Settings size={14} className={getAccentColorClass("text")} /> {t("aestheticSettings")}
            </button>
            <Link
              to={rolePath(role)}
              className={`px-6 py-3 rounded-xl bg-gradient-to-r ${getAccentColorClass("bg")} text-white font-black text-[10px] tracking-wider uppercase flex items-center gap-2 shadow-lg active:scale-95 transition-all`}
            >
              <ArrowLeft size={14} /> {t("backToCommand")}
            </Link>
          </div>
        </div>
      </section>

      {/* Configuration Center Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="space-y-4">
          <div className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 mb-2">
            Profile Settings Center
          </div>
          
          <div className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex flex-col items-start gap-1 px-4 py-3 rounded-2xl text-left transition-all ${
                  activeTab === tab.id 
                  ? `${getAccentColorClass("bg")} text-white shadow-xl border border-transparent` 
                  : `text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/80 hover:${getAccentColorClass("text")} hover:shadow-sm`
                }`}
              >
                <div className="flex items-center gap-3 w-full">
                  <tab.icon size={18} className={activeTab === tab.id ? "text-royalYellow" : getAccentColorClass("text")} />
                  <div className="flex-1 font-bold text-sm tracking-wide">{tab.label}</div>
                  <ChevronRight size={14} className={activeTab === tab.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"} />
                </div>
                <div className={`text-xs leading-tight pl-7 pt-0.5 ${activeTab === tab.id ? "text-white/80 font-medium" : "text-slate-500 font-medium"}`}>
                  {tab.desc}
                </div>
              </button>
            ))}
          </div>
          
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <button 
              onClick={() => { logout(); navigate("/login"); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl text-red-650 hover:text-red-700 font-bold text-sm tracking-wider uppercase bg-red-50 hover:bg-red-100 border border-red-200 transition-all shadow-sm"
            >
              <LogOut size={16} /> {t("signOut")}
            </button>
          </div>
        </aside>

        {/* Content Configuration Panels */}
        <main className="relative rounded-3xl bg-white border border-slate-200 shadow-xl p-6 md:p-8 min-h-[500px]">
          
          {/* Glass sphere highlight */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-royalBlue/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 space-y-8">
              
              {/* ================================== GENERAL REGISTRY ================================== */}
              {activeTab === "general" && (
                <div className={`space-y-6 ${getFontSizeClass()}`}>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-1 tracking-tight flex items-center gap-2">
                      <User className={getAccentColorClass("text")} size={24} /> {t("personalRegistryTitle")}
                    </h2>
                    <p className="text-sm font-medium text-slate-500">{t("personalRegistrySubtitle")}</p>
                  </div>

                  <form onSubmit={handleSaveChanges} className={`space-y-6 ${getDensityClass()}`}>
                    {/* Access Clearance Warning */}
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 shadow-sm">
                      <Info size={18} className="text-amber-600 shrink-0 mt-0.5 animate-bounce" />
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold uppercase text-amber-900 tracking-wider">{t("clearanceWarning")}</div>
                        <p className="text-xs font-medium text-amber-700 leading-relaxed">
                          {t("clearanceDesc")}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 ml-1 block">{t("fullName")}</label>
                        <input 
                          type="text" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border bg-white outline-none font-bold text-slate-800 text-sm transition-all shadow-sm ${getAccentColorClass("border")}`}
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 ml-1 block">{t("adminEmail")}</label>
                        <input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border bg-white outline-none font-bold text-slate-800 text-sm transition-all shadow-sm ${getAccentColorClass("border")}`}
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 ml-1 block">{t("phoneEndpoint")}</label>
                        <input 
                          type="text" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border bg-white outline-none font-bold text-slate-800 text-sm transition-all shadow-sm ${getAccentColorClass("border")}`}
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 ml-1 block">{t("departmentDivision")}</label>
                        <select 
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border bg-white outline-none font-bold text-slate-800 text-sm transition-all shadow-sm ${getAccentColorClass("border")}`}
                        >
                          <option value="Hospital Operations & IT">Hospital Operations & IT</option>
                          <option value="Clinical Administration">Clinical Administration</option>
                          <option value="Executive Management Office">Executive Management Office</option>
                          <option value="Financial & Revenue Auditing">Financial & Revenue Auditing</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1 block">{t("employeeId")}</label>
                        <input 
                          type="text" 
                          value={employeeId}
                          disabled
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 outline-none font-bold text-slate-500 text-sm cursor-not-allowed"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1 block">{t("joinDate")}</label>
                        <input 
                          type="text" 
                          value={joinDate}
                          disabled
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 outline-none font-bold text-slate-500 text-sm cursor-not-allowed"
                        />
                      </div>

                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 ml-1 block">{t("primaryBranch")}</label>
                        <input 
                          type="text" 
                          value={hospitalBranch}
                          onChange={(e) => setHospitalBranch(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border bg-white outline-none font-bold text-slate-800 text-sm transition-all shadow-sm ${getAccentColorClass("border")}`}
                          required
                        />
                      </div>

                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 ml-1 block">{t("adminBio")}</label>
                        <textarea 
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          rows={3}
                          className={`w-full px-4 py-3 rounded-xl border bg-white outline-none font-medium text-slate-800 text-sm transition-all resize-none shadow-sm ${getAccentColorClass("border")}`}
                          required
                        />
                      </div>

                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                      <button 
                        type="button" 
                        onClick={() => { setName(user?.name || "Admin ahmed"); setEmail(user?.email || "admin@hospital.com"); }} 
                        className="px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider text-slate-600 border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all"
                      >
                        Reset Form
                      </button>
                      <button 
                        type="submit" 
                        disabled={isSaving}
                        className={`px-8 py-3 rounded-xl bg-gradient-to-r ${getAccentColorClass("bg")} text-white font-bold text-sm uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all active:scale-95`}
                      >
                        {isSaving ? "Saving..." : t("saveChanges")}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ================================== SECURITY & LOGIN ================================== */}
              {activeTab === "security" && (
                <div className={`space-y-6 ${getFontSizeClass()}`}>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-1 tracking-tight flex items-center gap-2">
                      <Lock className={getAccentColorClass("text")} size={24} /> {t("securityCenterTitle")}
                    </h2>
                    <p className="text-sm font-medium text-slate-500">{t("securityCenterSubtitle")}</p>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
                    
                    {/* Change Password Form */}
                    <form onSubmit={handlePasswordChange} className={`space-y-5 p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm ${getDensityClass()}`}>
                      <div className="text-xs font-bold uppercase text-slate-800 tracking-widest border-b border-slate-200 pb-2">
                        {t("passphraseTitle")}
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 ml-1 block">{t("currentPass")}</label>
                          <div className="relative">
                            <input 
                              type={showCurrentPassword ? "text" : "password"} 
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              className={`w-full px-4 py-3 pr-10 rounded-xl border bg-white outline-none font-bold text-slate-850 text-sm transition-all shadow-sm ${getAccentColorClass("border")}`}
                              required
                            />
                            <button 
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className={`absolute right-3 top-3 text-slate-400 hover:${getAccentColorClass("text")} transition-colors`}
                            >
                              {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 ml-1 block">{t("newPass")}</label>
                          <div className="relative">
                            <input 
                              type={showNewPassword ? "text" : "password"} 
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className={`w-full px-4 py-3 pr-10 rounded-xl border bg-white outline-none font-bold text-slate-850 text-sm transition-all shadow-sm ${getAccentColorClass("border")}`}
                              required
                            />
                            <button 
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className={`absolute right-3 top-3 text-slate-400 hover:${getAccentColorClass("text")} transition-colors`}
                            >
                              {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                          
                          {/* Strength Meter */}
                          {newPassword && (
                            <div className="pt-2 space-y-1">
                              <div className="flex justify-between text-xs font-bold text-slate-650">
                                <span>Strength Key:</span>
                                <span>{getPasswordStrength().label}</span>
                              </div>
                              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full transition-all duration-300 ${getPasswordStrength().color}`} 
                                  style={{ width: `${getPasswordStrength().score}%` }} 
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 ml-1 block">{t("confirmPass")}</label>
                          <div className="relative">
                            <input 
                              type={showConfirmPassword ? "text" : "password"} 
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className={`w-full px-4 py-3 pr-10 rounded-xl border bg-white outline-none font-bold text-slate-850 text-sm transition-all shadow-sm ${getAccentColorClass("border")}`}
                              required
                            />
                            <button 
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className={`absolute right-3 top-3 text-slate-400 hover:${getAccentColorClass("text")} transition-colors`}
                            >
                              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button 
                          type="submit" 
                          disabled={isSaving}
                          className={`px-6 py-3 rounded-xl bg-gradient-to-r ${getAccentColorClass("bg")} text-white font-bold text-sm uppercase tracking-wider shadow-lg transition-all active:scale-95`}
                        >
                          {t("updatePass")}
                        </button>
                      </div>
                    </form>

                    {/* Side Security Widgets */}
                    <div className="space-y-6">
                      
                      {/* 2FA Widget */}
                      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <QrCode size={20} className={getAccentColorClass("text")} />
                            <div className="text-xs font-bold uppercase text-slate-800 tracking-widest">{t("tfaTitle")}</div>
                          </div>
                          <span className={`h-2.5 w-2.5 rounded-full ${twoFactorEnabled ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} />
                        </div>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed">
                          {t("tfaDesc")}
                        </p>
                        <button
                          type="button"
                          onClick={toggleTwoFactor}
                          className={`w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all border ${
                            twoFactorEnabled 
                              ? "bg-red-50 hover:bg-red-100 text-red-650 border-red-200" 
                              : `bg-gradient-to-r ${getAccentColorClass("bg")} text-white border-transparent`
                          }`}
                        >
                          {twoFactorEnabled ? "Deactivate 2FA Shield" : "Activate 2FA Shield"}
                        </button>
                      </div>

                      {/* Security Warning Log */}
                      <div className="p-6 rounded-2xl bg-red-50 border border-red-150 space-y-3 shadow-sm">
                        <div className="flex items-center gap-2 text-red-700">
                          <AlertTriangle size={18} />
                          <div className="text-xs font-bold uppercase tracking-wider">{t("dangerActions")}</div>
                        </div>
                        <p className="text-xs font-medium text-red-600 leading-relaxed">
                          {t("dangerDesc")}
                        </p>
                        <button
                          type="button"
                          onClick={() => showToast("Root authentication protection prevents self-destruction of this operational node.")}
                          className="w-full py-3 rounded-xl bg-red-650 text-white font-bold text-xs uppercase tracking-wider hover:bg-red-750 shadow-md shadow-red-550/10 active:scale-95 transition-all"
                        >
                          {t("deleteNode")}
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {/* ================================== ALERTS & NOTIFICATIONS ================================== */}
              {activeTab === "notifications" && (
                <div className={`space-y-6 ${getFontSizeClass()}`}>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-1 tracking-tight flex items-center gap-2">
                      <Bell className={getAccentColorClass("text")} size={24} /> {t("alertsCenterTitle")}
                    </h2>
                    <p className="text-sm font-medium text-slate-500">{t("alertsCenterSubtitle")}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { id: "emailAlerts", title: t("masterEmailTitle"), desc: t("masterEmailDesc"), icon: Mail, cat: "Global Routing" },
                      { id: "pushAlerts", title: t("pushTitle"), desc: t("pushDesc"), icon: Laptop, cat: "Local Browser" },
                      { id: "appointmentReminders", title: t("calendarTitle"), desc: t("calendarDesc"), icon: History, cat: "Clinical Events" },
                      { id: "billingAlerts", title: t("billingTitle"), desc: t("billingDesc"), icon: Database, cat: "Finance & Accounting" },
                      { id: "emergencyAlerts", title: t("emergencyTitle"), desc: t("emergencyDesc"), icon: AlertTriangle, cat: "Critical ICU", danger: true },
                      { id: "smsAlerts", title: t("smsTitle"), desc: t("smsDesc"), icon: Smartphone, cat: "Mobile Systems" },
                      { id: "soundAlerts", title: t("soundTitle"), desc: t("soundDesc"), icon: Volume2, cat: "Acoustic Feedback" }
                    ].map((item) => (
                      <div 
                        key={item.id}
                        className={`p-5 rounded-2xl border transition-all duration-300 flex items-start justify-between gap-4 shadow-sm ${
                          item.danger 
                            ? "bg-red-50 border-red-200 hover:border-red-300" 
                            : `bg-slate-50 border-slate-200 hover:${getAccentColorClass("border")}`
                        }`}
                      >
                        <div className="space-y-2">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                            item.danger ? 'bg-red-100 text-red-700' : `bg-white/10 ${getAccentColorClass("text")}`
                          }`}>
                            {item.cat}
                          </span>
                          <div className="flex items-center gap-2">
                            <item.icon size={18} className={item.danger ? 'text-red-650' : getAccentColorClass("text")} />
                            <h4 className={`text-sm font-bold uppercase tracking-wider ${item.danger ? 'text-red-900' : 'text-slate-800'}`}>{item.title}</h4>
                          </div>
                          <p className={`text-xs font-medium ${item.danger ? 'text-red-700' : 'text-slate-500'} leading-normal`}>{item.desc}</p>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => toggleNotification(item.id)}
                          className="shrink-0 pt-1"
                        >
                          {notifications[item.id] ? (
                            <ToggleRight size={36} className={`${getAccentColorClass("text")} transition-transform hover:scale-105`} />
                          ) : (
                            <ToggleLeft size={36} className="text-slate-400 transition-transform hover:scale-105" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================================== AESTHETIC SETTINGS ================================== */}
              {activeTab === "preferences" && (
                <div className={`space-y-6 ${getFontSizeClass()}`}>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-1 tracking-tight flex items-center gap-2">
                      <Settings className={getAccentColorClass("text")} size={24} /> {t("title")}
                    </h2>
                    <p className="text-sm font-medium text-slate-500">{t("subtitle")}</p>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    
                    {/* Visual Preview Theme */}
                    <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm space-y-4">
                      <div className="text-xs font-bold uppercase text-slate-800 tracking-widest flex items-center gap-2">
                        <Palette size={16} className={getAccentColorClass("text")} /> {t("contrastTheme")}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <button 
                          type="button" 
                          onClick={() => { setSelectedTheme("dark"); showToast("Theme set to Dark Royal Navy!"); }}
                          className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 bg-slate-900 ${
                            selectedTheme === "dark" ? ("border-" + (accentColor === "royalBlue" ? "royalBlue" : accentColor + "-500") + " shadow-lg") : "border-slate-300 hover:border-slate-400"
                          }`}
                          style={{
                            borderColor: selectedTheme === "dark" ? (accentColor === "royalBlue" ? "#1b75bb" : accentColor === "emerald" ? "#10b981" : accentColor === "purple" ? "#9333ea" : "#f97316") : ""
                          }}
                        >
                          <span className={`h-4 w-4 rounded-full ${getAccentColorClass("bg")} ring-2 ring-white`} />
                          <span className="text-xs font-bold uppercase text-white tracking-wider">{t("darkNavy")}</span>
                        </button>
                        
                        <button 
                          type="button" 
                          onClick={() => { setSelectedTheme("light"); showToast("Light Mode requested. Theme locked to Royal Navy Contrast for maximum legibility."); }}
                          className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 bg-white ${
                            selectedTheme === "light" ? ("border-" + (accentColor === "royalBlue" ? "royalBlue" : accentColor + "-500") + " shadow-lg") : "border-slate-200 hover:border-slate-300"
                          }`}
                          style={{
                            borderColor: selectedTheme === "light" ? (accentColor === "royalBlue" ? "#1b75bb" : accentColor === "emerald" ? "#10b981" : accentColor === "purple" ? "#9333ea" : "#f97316") : ""
                          }}
                        >
                          <span className={`h-4 w-4 rounded-full ${getAccentColorClass("bg")} ring-2 ring-slate-100`} />
                          <span className="text-xs font-bold uppercase text-slate-800 tracking-wider">{t("clinicalLight")}</span>
                        </button>
                      </div>
                    </div>

                    {/* Language & Local Settings */}
                    <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm space-y-4">
                      <div className="text-xs font-bold uppercase text-slate-800 tracking-widest flex items-center gap-2">
                        <Globe size={16} className={getAccentColorClass("text")} /> {t("vocabLocalization")}
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block ml-1">{t("defaultLanguage")}</label>
                          <select 
                            value={selectedLanguage}
                            onChange={(e) => { setSelectedLanguage(e.target.value); showToast(`System localization routed to ${e.target.value}`); }}
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white outline-none text-slate-800 font-bold text-sm shadow-sm"
                          >
                            <option value="English">English (US)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block ml-1">{t("layoutDensity")}</label>
                          <div className="grid grid-cols-3 gap-2">
                            {["Compact", "Cozy", "Comfortable"].map(d => (
                              <button
                                key={d}
                                type="button"
                                onClick={() => { setLayoutDensity(d); showToast(`Display scaling density set to ${d}.`); }}
                                className={`py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                                  layoutDensity === d 
                                    ? `${getAccentColorClass("bg")} text-white border-transparent shadow-sm` 
                                    : "bg-white hover:bg-slate-100 text-slate-700 border-slate-300"
                                }`}
                              >
                                {d}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Font & Accent Controllers */}
                    <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm space-y-4">
                      <div className="text-xs font-bold uppercase text-slate-800 tracking-widest flex items-center gap-2">
                        <Type size={16} className={getAccentColorClass("text")} /> {t("textScaleAccent")}
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block ml-1">{t("globalTextScale")}</label>
                          <div className="grid grid-cols-3 gap-2">
                            {["Small", "Medium", "Large"].map(f => (
                              <button
                                key={f}
                                type="button"
                                onClick={() => { setFontSize(f); showToast(`System font scale set to ${f}.`); }}
                                className={`py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                                  fontSize === f 
                                    ? `${getAccentColorClass("bg")} text-white border-transparent shadow-sm` 
                                    : "bg-white hover:bg-slate-100 text-slate-700 border-slate-300"
                                }`}
                              >
                                {f}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block ml-1">{t("activeAccent")}</label>
                          <div className="flex items-center gap-3 pt-1">
                            {[
                              { id: "royalBlue", color: "bg-royalBlue shadow-[0_0_10px_rgba(27,117,187,0.4)]" },
                              { id: "emerald", color: "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" },
                              { id: "purple", color: "bg-purple-600 shadow-[0_0_10px_rgba(147,51,234,0.4)]" },
                              { id: "coral", color: "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]" }
                            ].map(accent => (
                              <button 
                                key={accent.id}
                                type="button"
                                onClick={() => { setAccentColor(accent.id); showToast(`Accent key aligned to ${accent.id}.`); }}
                                className={`h-8 w-8 rounded-full transition-all border-2 ${accent.color} ${
                                  accentColor === accent.id ? "ring-2 ring-white scale-110" : "hover:scale-105 border-transparent"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sidebar & Animation Options */}
                    <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm space-y-4">
                      <div className="text-xs font-bold uppercase text-slate-800 tracking-widest flex items-center gap-2">
                        <LayoutGrid size={16} className={getAccentColorClass("text")} /> {t("sidebarAnimation")}
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold uppercase text-slate-800 tracking-wider">{t("sidebarMode")}</span>
                            <p className="text-xs text-slate-500 font-medium">{t("sidebarDesc")}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const next = sidebarBehavior === "Expanded" ? "Collapsed" : "Expanded";
                              setSidebarBehavior(next);
                              showToast(`Sidebar preference cached: ${next}`);
                            }}
                          >
                            {sidebarBehavior === "Expanded" ? (
                              <ToggleRight size={32} className={`${getAccentColorClass("text")} hover:scale-105 transition-transform`} />
                            ) : (
                              <ToggleLeft size={32} className="text-slate-400 hover:scale-105 transition-transform" />
                            )}
                          </button>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold uppercase text-slate-800 tracking-wider">{t("transitions")}</span>
                            <p className="text-xs text-slate-500 font-medium">{t("transitionsDesc")}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setAnimationsEnabled(!animationsEnabled);
                              showToast(`Transitions and framer-motion status flipped.`);
                            }}
                          >
                            {animationsEnabled ? (
                              <ToggleRight size={32} className={`${getAccentColorClass("text")} hover:scale-105 transition-transform`} />
                            ) : (
                              <ToggleLeft size={32} className="text-slate-400 hover:scale-105 transition-transform" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* ================================== CONNECTED DEVICES ================================== */}
              {activeTab === "devices" && (
                <div className={`space-y-6 ${getFontSizeClass()}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800 mb-1 tracking-tight flex items-center gap-2">
                        <Laptop className={getAccentColorClass("text")} size={24} /> {t("devicesTitle")}
                      </h2>
                      <p className="text-sm font-medium text-slate-500">{t("devicesSubtitle")}</p>
                    </div>
                    
                    <button
                      type="button"
                      onClick={handleDeauthorizeAll}
                      disabled={devicesList.length <= 1}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border shrink-0 ${
                        devicesList.length <= 1
                          ? "bg-slate-100 text-slate-405 border-slate-200 cursor-not-allowed"
                          : "bg-red-50 hover:bg-red-105 text-red-650 hover:text-red-700 border-red-200 shadow-sm active:scale-95"
                      }`}
                    >
                      Logout other Devices
                    </button>
                  </div>

                  <div className="space-y-4">
                    {devicesList.map((device) => {
                      const Icon = device.icon;
                      return (
                        <div 
                          key={device.id}
                          className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all shadow-sm ${
                            device.isCurrent 
                              ? ("border-" + (accentColor === "royalBlue" ? "royalBlue" : accentColor + "-500") + "/40 bg-slate-50 shadow-sm") 
                              : "border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300"
                          }`}
                          style={{
                            borderColor: device.isCurrent ? (accentColor === "royalBlue" ? "rgba(27, 117, 187, 0.4)" : accentColor === "emerald" ? "rgba(16, 185, 129, 0.4)" : accentColor === "purple" ? "rgba(147, 51, 234, 0.4)" : "rgba(249, 115, 22, 0.4)") : ""
                          }}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${
                              device.isCurrent ? `${getAccentColorClass("bg")} text-white shadow-lg` : 'bg-slate-200 text-slate-655'
                            }`}>
                              <Icon size={20} />
                            </div>
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">{device.name}</h4>
                                {device.isCurrent && (
                                  <span className={`text-[10px] font-bold ${getAccentColorClass("bg")} text-white px-2.5 py-0.5 rounded-full uppercase tracking-widest shadow-md`}>Current Terminal</span>
                                )}
                              </div>
                              <p className="text-xs font-medium text-slate-500 leading-normal">{device.details}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 self-end sm:self-center">
                            <div className="flex items-center gap-1.5">
                              <span className={`h-2 w-2 rounded-full ${
                                device.status === "Active" ? "bg-green-500 animate-pulse" : device.status === "Idle" ? "bg-amber-550 animate-pulse" : "bg-slate-400"
                              }`} />
                              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{device.status}</span>
                            </div>
                            
                            {!device.isCurrent && (
                              <button 
                                type="button" 
                                onClick={() => revokeDevice(device.id, device.name)}
                                className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-650 hover:text-red-700 font-bold text-xs uppercase tracking-wider transition-all"
                              >
                                Revoke
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          </main>
        </div>

        {showTwoFactorWizard && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <div
              onClick={() => setShowTwoFactorWizard(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <div className="relative w-full max-w-md p-6 rounded-3xl bg-white border border-slate-200 shadow-2xl text-center space-y-5">
              <div className="flex justify-center">
                <div className={`p-3 rounded-full bg-slate-100 text-slate-800 shadow-lg animate-bounce`}>
                  <QrCode size={36} className={getAccentColorClass("text")} />
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-850 uppercase tracking-wider">Configure Two-Factor Shield</h3>
                <p className="text-sm font-medium text-slate-500">Scan this QR cryptogram with Google Authenticator or registered node keys.</p>
              </div>
              
              <div className="flex justify-center p-4 bg-white rounded-2xl max-w-[180px] mx-auto shadow-inner ring-4 ring-slate-100 border border-slate-200">
                <svg width="140" height="140" viewBox="0 0 24 24" fill="none" stroke={accentColor === "royalBlue" ? "#1b75bb" : accentColor === "emerald" ? "#10b981" : accentColor === "purple" ? "#9333ea" : "#f97316"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <rect x="7" y="7" width="3" height="3"></rect>
                  <rect x="14" y="7" width="3" height="3"></rect>
                  <rect x="7" y="14" width="3" height="3"></rect>
                  <rect x="14" y="14" width="3" height="3"></rect>
                  <line x1="10" y1="10" x2="10.01" y2="10"></line>
                  <line x1="10" y1="14" x2="10.01" y2="14"></line>
                  <line x1="14" y1="10" x2="14.01" y2="10"></line>
                </svg>
              </div>
              
              <div className="space-y-1 text-xs font-mono text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Secret Seed Key</div>
                <div className="text-sm font-semibold tracking-wider">H0SP-1TAL-R00T-2FA-SECR-3T26</div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowTwoFactorWizard(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Cancel Scan
                </button>
                <button 
                  type="button" 
                  onClick={() => { setShowTwoFactorWizard(false); setTwoFactorEnabled(true); showToast("Two-Factor Shield activated successfully!"); }}
                  className={`flex-1 py-3 rounded-xl bg-gradient-to-r ${getAccentColorClass("bg")} text-white font-bold text-xs uppercase tracking-wider transition-all border border-transparent shadow-lg active:scale-95`}
                >
                  Verify &amp; Activate
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
