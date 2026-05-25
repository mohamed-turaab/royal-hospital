import React, { useEffect, useState, useRef } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import Avatar from "./Avatar";
import BrandLogo from "./BrandLogo";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  MoonStar,
  Search,
  SunMedium,
  X,
  Settings,
  AlertTriangle,
  Check,
  Volume2,
  VolumeX,
  ShieldAlert,
  Flame,
  Activity,
  HeartCrack,
  Home,
  Compass
} from "lucide-react";
import { rolePath, roleProfilePath, sidebarNav } from "../config/roles";

export default function Layout() {
  const { user, logout, theme, toggleTheme } = useAuth();
  const { 
    isConnected, 
    notifications, 
    activeEmergency, 
    resolveEmergency, 
    triggerEmergencyMock,
    markAllRead,
    markOneRead,
    clearNotifications
  } = useSocket();
  
  const navigate = useNavigate();
  const location = useLocation();
  const mainRef = useRef(null);

  // Scroll main container to top on route change
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  const role = user?.role || "Admin";
  const dashboardPath = rolePath(role);
  const navItems = sidebarNav.filter((item) => item.roles.includes(role));
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    try {
      const saved = localStorage.getItem("sidebarBehavior");
      return saved !== null ? saved === "Expanded" : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    const handleSidebarToggle = () => {
      try {
        const saved = localStorage.getItem("sidebarBehavior");
        if (saved !== null) {
          setSidebarOpen(saved === "Expanded");
        }
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener("sidebarToggle", handleSidebarToggle);
    window.addEventListener("storage", handleSidebarToggle);
    return () => {
      window.removeEventListener("sidebarToggle", handleSidebarToggle);
      window.removeEventListener("storage", handleSidebarToggle);
    };
  }, []);

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const searchablePages = [
    { name: "Patients Registry", path: "/admin/patients", category: "Patients", keywords: ["patient", "intake", "care", "sick"] },
    { name: "Doctors Registry", path: "/admin/doctors", category: "Doctors", keywords: ["doctor", "specialist", "medical", "physician"] },
    { name: "Nurses Registry", path: "/admin/nurses", category: "Nurses", keywords: ["nurse", "ward", "shift", "bedside"] },
    { name: "Appointments Calendar", path: "/admin/appointments", category: "Appointments", keywords: ["appointment", "booking", "schedule", "visit"] },
    { name: "Rooms Allocation", path: "/admin/rooms", category: "Rooms", keywords: ["room", "ward", "bed", "occupancy"] },
    { name: "Pharmacy Dispensary", path: "/admin/pharmacy", category: "Pharmacy", keywords: ["pharmacy", "medicine", "pill", "drug", "prescription"] },
    { name: "Billing & Finance", path: "/admin/billing", category: "Billing", keywords: ["billing", "invoice", "payment", "revenue", "accountant"] },
    { name: "Clinical Reports", path: "/admin/reports", category: "Reports", keywords: ["report", "analytics", "growth", "performance"] },
    { name: "System Settings", path: "/admin/settings", category: "Settings", keywords: ["settings", "profile", "access", "security", "theme"] },
  ];

  const searchResults = globalSearch.trim() === "" ? [] : searchablePages.filter(p => 
    p.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(globalSearch.toLowerCase()) ||
    p.keywords.some(k => k.includes(globalSearch.toLowerCase()))
  );
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem("hospital_sound_enabled");
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("hospital_sound_enabled", JSON.stringify(soundEnabled));
    } catch (e) {
      console.error(e);
    }
  }, [soundEnabled]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 1024) setSidebarOpen(false);
      else setMobileSidebarOpen(false);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const closeMobileSidebar = () => setMobileSidebarOpen(false);

  const resolveTo = (item) =>
    item.to === "dashboard" ? dashboardPath : `/${role.toLowerCase()}/${item.to}`;

  const isActive = (item) => {
    const itemPath = resolveTo(item);
    if (item.to === "dashboard") {
      return location.pathname === dashboardPath;
    }
    return location.pathname === itemPath;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="app-shell flex h-screen overflow-hidden bg-navyBlue-50 dark:bg-navyBlue-950 transition-colors duration-500">
      
      {/* 🚨 Emergency Code Red Overlay System */}
      <AnimatePresence>
        {activeEmergency && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-red-950/95 p-6 backdrop-blur-2xl"
          >
            {/* Flashing border indicators */}
            <div className="absolute inset-0 border-[16px] border-red-600 animate-pulse pointer-events-none" />
            
            {/* Ambient sound ripples visualizer */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
              <div className="h-[400px] w-[400px] rounded-full border-4 border-red-500/20 animate-ping" />
              <div className="h-[600px] w-[600px] rounded-full border-4 border-red-500/10 animate-ping delay-300" />
            </div>

            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }}
              exit={{ scale: 0.9, y: 30 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-[28px] sm:rounded-[40px] border border-red-500/30 bg-red-950/80 p-5 sm:p-10 text-center text-white shadow-[0_0_80px_rgba(239,68,68,0.4)] backdrop-blur-3xl"
            >
              <div className="absolute top-6 right-6">
                <button 
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  aria-label={soundEnabled ? "Silence Alarm Siren" : "Enable Alarm Siren"}
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white focus-visible:ring-4 focus-visible:ring-red-500/50 outline-none"
                >
                  {soundEnabled ? <Volume2 size={20} className="animate-bounce" /> : <VolumeX size={20} />}
                </button>
              </div>

              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-600 shadow-[0_0_30px_rgba(239,68,68,0.5)] animate-bounce">
                <ShieldAlert size={48} className="text-white" />
              </div>

              <h2 className="mb-2 text-2xl sm:text-3xl font-black uppercase tracking-[0.12em] sm:tracking-[0.2em] text-red-500">
                Code Red Emergency
              </h2>
              <p className="mb-8 text-xs font-bold uppercase tracking-widest text-red-400">
                Real-Time Hospital Broadcast Alert
              </p>

              <div className="mb-8 sm:mb-10 rounded-3xl border border-red-500/20 bg-red-900/40 p-4 sm:p-6 text-left">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <HeartCrack size={32} className="text-red-500 shrink-0 mt-1" />
                  <div>
                    <div className="text-lg font-black tracking-tight text-white mb-1">
                      {activeEmergency.message}
                    </div>
                    <div className="text-xs font-bold text-red-300/80 uppercase tracking-wider">
                      Location: {activeEmergency.location}
                    </div>
                    <div className="text-[10px] text-red-400 font-extrabold uppercase mt-2">
                      Reported At: {activeEmergency.timestamp}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={resolveEmergency}
                  className="flex items-center justify-center gap-2.5 rounded-2xl bg-red-600 px-8 py-4 font-black text-sm uppercase tracking-widest text-white shadow-xl shadow-red-600/30 transition-all hover:bg-red-500 hover:scale-105 active:scale-95"
                >
                  <Check size={18} /> Respond & Acknowledge
                </button>
                <button
                  onClick={resolveEmergency}
                  className="rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-sm font-black uppercase tracking-widest text-white backdrop-blur-md transition-all hover:bg-white/10 hover:scale-105 active:scale-95"
                >
                  Silence Alert
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-navyBlue/60 backdrop-blur-sm lg:hidden"
            onClick={closeMobileSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 300 : 96 }}
        className={`sidebar-glass fixed bottom-0 left-0 top-0 z-50 flex max-w-[86vw] flex-col p-5 sm:p-6 transition-all duration-500 lg:static lg:max-w-none lg:translate-x-0 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-10 flex items-center justify-between gap-4">
          <Link
            to="/"
            className={`flex items-center text-white ${!sidebarOpen ? "w-full justify-center" : ""}`}
          >
            <BrandLogo compact={!sidebarOpen} showText={sidebarOpen} />
          </Link>

          <button
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close Mobile Navigation"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:ring-4 focus-visible:ring-royalBlue/50 outline-none lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <motion.div
          animate={{ padding: sidebarOpen ? "1rem" : "0.75rem" }}
          className="mb-8 rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-md"
        >
          <Link
            to={roleProfilePath(role)}
            className={`flex items-center gap-4 rounded-2xl transition-all hover:bg-white/5 ${
              !sidebarOpen ? "flex-col text-center" : ""
            }`}
          >
            <div className="relative">
              <Avatar
                src={user?.profileImage}
                name={user?.name}
                size={sidebarOpen ? "h-12 w-12" : "h-10 w-10"}
                className="ring-2 ring-royalBlue/50"
              />
              <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-navyBlue-900 bg-green-500" />
            </div>
            {sidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-w-0 flex-1">
                <div className="truncate text-sm font-black text-white">{user?.name}</div>
                <div className="truncate text-[10px] font-black uppercase tracking-widest text-royalBlue-400">
                  {role}
                </div>
              </motion.div>
            )}
          </Link>
        </motion.div>

        <button
          onClick={() => setSidebarOpen((open) => !open)}
          aria-label={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          className={`absolute -right-5 top-12 hidden h-10 w-10 items-center justify-center rounded-full border border-white/5 bg-navyBlue-900 text-white shadow-2xl transition-all duration-300 hover:scale-110 focus-visible:ring-4 focus-visible:ring-royalBlue/50 outline-none lg:flex ${
            !sidebarOpen ? "rotate-180" : ""
          }`}
        >
          <ChevronLeft size={18} />
        </button>

        <nav className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar">
          {sidebarOpen && (
            <div className="mb-4 px-4 text-[10px] font-black uppercase tracking-[0.25em] text-navyBlue-400">
              Navigation
            </div>
          )}

          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.label}
                to={resolveTo(item)}
                onClick={closeMobileSidebar}
                title={!sidebarOpen ? item.label : undefined}
                className={`group relative flex items-center rounded-[20px] transition-all duration-300 ${
                  active
                    ? "bg-royalBlue text-white shadow-xl shadow-royalBlue/30"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                } ${
                  sidebarOpen ? "gap-4 px-4 py-3.5" : "justify-center py-3"
                }`}
              >
                {/* Active indicator in collapsed mode */}
                {active && !sidebarOpen && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-royalYellow rounded-r-full" />
                )}

                {sidebarOpen ? (
                  /* Expanded: normal icon + label layout */
                  <>
                    {active && (
                      <motion.div
                        layoutId="active-nav"
                        className="absolute inset-0 rounded-[20px] bg-gradient-to-r from-royalBlue to-royalBlue-600 shadow-inner"
                        style={{ zIndex: -1 }}
                      />
                    )}
                    <item.icon
                      size={20}
                      className={`shrink-0 transition-all duration-300 group-hover:scale-110 ${
                        active ? "text-white" : "text-white/60 group-hover:text-white"
                      }`}
                    />
                    <span className="text-[13px] font-bold tracking-wide">{item.label}</span>
                  </>
                ) : (
                  /* Collapsed: fixed-size icon only + hover tooltip */
                  <>
                    <div
                      className="flex items-center justify-center"
                      style={{ width: 40, height: 40, flexShrink: 0 }}
                    >
                      <item.icon
                        size={22}
                        className={`transition-all duration-300 group-hover:scale-110 ${
                          active ? "text-white" : "text-white/60 group-hover:text-white"
                        }`}
                      />
                    </div>
                    {/* Tooltip */}
                    <span className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-xl bg-navyBlue-900 px-3 py-1.5 text-xs font-bold text-white shadow-xl border border-white/10 group-hover:block z-[100]">
                      {item.label}
                    </span>
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 border-t border-white/10 pt-6 space-y-2.5">
          {sidebarOpen ? (
            <Link
              to="/"
              className="group relative block overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-4 transition-all duration-300 hover:border-royalYellow/30 hover:bg-white/10 shadow-lg"
            >
              {/* Soft glowing ambient backgrounds */}
              <div className="absolute -right-10 -top-10 h-20 w-20 rounded-full bg-royalYellow/5 blur-lg transition-all duration-500 group-hover:bg-royalYellow/15" />
              <div className="absolute -bottom-10 -left-10 h-20 w-20 rounded-full bg-royalBlue/5 blur-lg transition-all duration-500 group-hover:bg-royalBlue/15" />

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-royalYellow/10 border border-royalYellow/20 text-royalYellow transition-transform duration-500 group-hover:rotate-12">
                    <Home size={18} className="animate-pulse" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-black text-white tracking-wide">Home page</div>
                    <div className="text-[10px] font-bold text-white/40 tracking-wider">Public Gateway</div>
                  </div>
                </div>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-white/30 transition-all duration-300 group-hover:bg-royalYellow/20 group-hover:text-royalYellow">
                  <Compass size={14} style={{ animation: 'spin 8s linear infinite' }} />
                </div>
              </div>
            </Link>
          ) : (
            <Link
              to="/"
              className="group relative flex h-12 w-12 items-center justify-center rounded-[20px] border border-white/10 bg-white/5 text-white/60 transition-all duration-300 hover:border-royalYellow/30 hover:bg-white/15 hover:text-white"
            >
              <div className="absolute inset-0 rounded-[20px] bg-royalYellow/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 animate-pulse" />
              <Home size={20} className="transition-transform group-hover:scale-110 text-royalYellow" />
              <span className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-xl bg-navyBlue-900 px-3 py-1.5 text-xs font-bold text-white shadow-xl border border-white/10 group-hover:block z-[100]">
                Return to Home page
              </span>
            </Link>
          )}

          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className={`group relative flex w-full items-center gap-4 rounded-[20px] px-4 py-3 text-navyBlue-300 transition-all hover:bg-red-500/10 hover:text-red-400 ${
              !sidebarOpen ? "justify-center px-0" : ""
            }`}
          >
            <div
              className="flex items-center justify-center shrink-0"
              style={{ width: !sidebarOpen ? 40 : "auto", height: !sidebarOpen ? 40 : "auto" }}
            >
              <LogOut size={20} className="transition-transform group-hover:-translate-x-1" />
            </div>
            {sidebarOpen && <span className="text-[13px] font-bold">Sign Out</span>}
            {!sidebarOpen && (
              <span className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-xl bg-navyBlue-900 px-3 py-1.5 text-xs font-bold text-white shadow-xl border border-white/10 group-hover:block z-[100]">
                Sign Out
              </span>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Top Navbar */}
        <header className="navbar-glass sticky top-0 z-30 flex min-w-0 items-center justify-between gap-3 px-3 py-3 sm:px-6 sm:py-4 lg:px-10">
          <div className="flex min-w-0 items-center gap-3 sm:gap-6">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open Navigation Menu"
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-navyBlue-50 text-navyBlue-700 transition-colors hover:bg-navyBlue-100 focus-visible:ring-4 focus-visible:ring-royalBlue/20 outline-none lg:hidden dark:bg-navyBlue-900/50 dark:text-navyBlue-200"
            >
              <Menu size={20} />
            </button>

            <div className="hidden items-center gap-3 rounded-2xl border border-navyBlue-100 bg-white px-5 py-2.5 shadow-sm transition-all focus-within:ring-4 focus-within:ring-royalBlue/10 dark:border-navyBlue-800 dark:bg-navyBlue-900/40 lg:flex w-[400px] relative">
              <Search size={18} className="text-navyBlue-400" />
              <input
                type="text"
                placeholder="Search anything..."
                value={globalSearch}
                onChange={(e) => {
                  setGlobalSearch(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                className="w-full bg-transparent text-sm font-bold text-navyBlue-900 outline-none placeholder:text-navyBlue-300 dark:text-white dark:placeholder:text-navyBlue-600"
              />

              {showSearchDropdown && globalSearch.trim() !== "" && (
                <>
                  <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setShowSearchDropdown(false)} />
                  <div className="absolute left-0 right-0 top-14 z-50 overflow-hidden rounded-[24px] border border-royalBlue-100/10 bg-white dark:bg-navyBlue-900 shadow-2xl p-4 backdrop-blur-2xl">
                    <div className="px-3 py-1.5 text-[10px] font-black text-royalBlue-400 uppercase tracking-widest border-b border-royalBlue-100/10 mb-2">
                      Global Search Results
                    </div>
                    <div className="space-y-1">
                      {searchResults.length === 0 ? (
                        <div className="text-center py-4 text-xs font-semibold text-royalBlue-400">
                          No matching modules found
                        </div>
                      ) : (
                        searchResults.map(result => (
                          <button
                            key={result.path}
                            onClick={() => {
                              navigate(result.path);
                              setGlobalSearch("");
                              setShowSearchDropdown(false);
                            }}
                            className="w-full text-left rounded-xl px-4 py-3 text-xs font-bold text-navyBlue-900 dark:text-white hover:bg-navyBlue-50 dark:hover:bg-white/10 transition-all flex justify-between items-center"
                          >
                            <span>{result.name}</span>
                            <span className="text-[10px] uppercase tracking-widest text-royalBlue-400 dark:text-royalBlue-300 font-extrabold">{result.category}</span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-2 sm:gap-4 lg:gap-6 relative">
            {/* Real-time socket online status pill removed per user request */}

            <button
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-navyBlue-50 text-navyBlue-600 transition-all hover:scale-110 hover:bg-navyBlue-100 focus-visible:ring-4 focus-visible:ring-royalBlue/20 outline-none dark:bg-navyBlue-900/50 dark:text-royalBlue-400 dark:hover:bg-navyBlue-800"
            >
              {theme === "dark" ? <SunMedium size={20} /> : <MoonStar size={20} />}
            </button>
            
            {/* Bell Icon Notification Button */}
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="View Clinical Notifications"
              aria-expanded={showNotifications}
              aria-haspopup="true"
              className="relative flex h-11 w-11 items-center justify-center rounded-full bg-navyBlue-50 text-navyBlue-600 transition-all hover:scale-110 hover:bg-navyBlue-100 focus-visible:ring-4 focus-visible:ring-royalBlue/20 outline-none dark:bg-navyBlue-900/50 dark:text-navyBlue-200 dark:hover:bg-navyBlue-800"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute right-2 top-2 h-4 w-4 rounded-full bg-red-500 text-[9px] font-black text-white flex items-center justify-center border-2 border-white dark:border-navyBlue-950">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* 🔔 Glassmorphism Notifications Dropdown */}
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <div
                  className="fixed left-3 right-3 top-20 z-50 max-h-[calc(100dvh-6rem)] overflow-hidden rounded-[24px] border border-royalBlue-100/10 bg-white p-4 shadow-2xl backdrop-blur-2xl animate-fade-in-up dark:bg-navyBlue-900 sm:absolute sm:left-auto sm:right-0 sm:top-16 sm:w-[380px] sm:rounded-[32px] sm:p-6"
                >
                    <div className="flex justify-between items-center pb-4 border-b border-royalBlue-100/10 mb-4">
                      <div>
                        <h4 className="font-black text-base text-royalBlue-950 dark:text-white">Notifications</h4>
                        <span className="text-[10px] font-black text-royalBlue-400 uppercase tracking-widest">Clinical updates</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={clearNotifications}
                          disabled={notifications.length === 0}
                          className="text-[10px] font-black uppercase tracking-widest text-red-400 transition hover:text-red-500 hover:underline disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:no-underline"
                        >
                          {notifications.length > 1 ? "Clear All" : "Clear"}
                        </button>
                        <button 
                          onClick={markAllRead} 
                          disabled={notifications.length === 0}
                          className="text-[10px] font-black text-royalBlue uppercase tracking-widest hover:underline disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:no-underline"
                        >
                          Read All
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3.5 max-h-[50dvh] overflow-y-auto custom-scrollbar sm:max-h-[300px]">
                      {notifications.length === 0 ? (
                        <div className="text-center py-8 text-xs font-semibold text-royalBlue-400">
                          No notifications at the moment.
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            onClick={() => {
                              if (!notif.read) markOneRead(notif.id);
                              if (notif.link) {
                                navigate(notif.link);
                              }
                              setShowNotifications(false);
                            }}
                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                              notif.read 
                                ? 'bg-royalBlue-50/10 border-royalBlue-100/5' 
                                : 'bg-royalBlue-50/50 border-royalBlue-100/20 dark:bg-royalBlue-900/10 dark:border-royalBlue-800'
                            }`}
                          >
                            <div className="flex justify-between items-start gap-2 mb-1">
                              <span className={`text-xs font-black truncate ${
                                notif.type === 'warning' ? 'text-orange-500' : 
                                notif.type === 'success' ? 'text-green-500' : 'text-royalBlue'
                              }`}>
                                {notif.title}
                              </span>
                              <span className="text-[9px] font-bold text-royalBlue-300/80 shrink-0">{notif.time}</span>
                            </div>
                            <p className="text-[11px] font-bold text-royalBlue-900/80 dark:text-royalBlue-200/80 leading-relaxed">
                              {notif.body}
                            </p>
                            {notif.link && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!notif.read) markOneRead(notif.id);
                                  navigate(notif.link);
                                  setShowNotifications(false);
                                }}
                                className="mt-3 rounded-xl bg-royalBlue px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white transition hover:bg-royalBlue-600"
                              >
                                View
                              </button>
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    {/* Emergency Alert Button */}
                    <div className="mt-6 pt-4 border-t border-royalBlue-100/10 flex flex-col gap-2">
                      <button
                        onClick={() => {
                          triggerEmergencyMock("XAALADDA DEGDEGA AH: Wadnaha waa joogsaday qolka 301 (VIP Suite)", "VIP Suite, Qolka 301");
                          setShowNotifications(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-red-500/10 border border-red-500/20 py-3 text-[11px] font-black uppercase tracking-widest text-red-500 transition-all hover:bg-red-500 hover:text-white"
                      >
                        <ShieldAlert size={14} /> 🚨 Send Emergency Alert
                      </button>
                    </div>
                </div>
              </>
            )}

            <div className="hidden h-8 w-px bg-royalBlue-100 dark:bg-royalBlue-800 sm:block" />

            <div className="flex items-center gap-4 sm:ml-2">
              <div className="hidden text-right lg:block">
                <div className="text-[13px] font-black text-navyBlue-900 dark:text-white">
                  {user?.name}
                </div>
                <div className="text-[11px] font-black uppercase tracking-widest text-navyBlue-500 dark:text-navyBlue-400">
                  {role}
                </div>
              </div>
              <Link to={roleProfilePath(role)} aria-label="Go to User Profile" className="group relative shrink-0 focus-visible:ring-4 focus-visible:ring-royalBlue/50 outline-none rounded-full">
                <Avatar
                  src={user?.profileImage}
                  name={user?.name}
                  size="h-11 w-11 ring-2 ring-navyBlue-100 transition-all group-hover:ring-royalBlue dark:ring-navyBlue-800 dark:group-hover:ring-royalBlue-400"
                />
                <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500 dark:border-navyBlue-950" />
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main ref={mainRef} className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 custom-scrollbar">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, cubicBezier: [0.16, 1, 0.3, 1] }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
