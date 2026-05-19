import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { rolePath } from "../config/roles";
import BrandLogo from "../components/BrandLogo";
import Avatar from "../components/Avatar";
import {
  ArrowRight,
  Sparkles,
  Stethoscope,
  Activity,
  Calendar,
  Pill,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Users,
  ShieldCheck,
  Star,
  ChevronLeft,
  ChevronRight,
  Ambulance,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  UserCheck,
  Building2,
  LogOut,
  ScanLine
} from "lucide-react";

// Fade-in animation variants for layout components
const fadeInUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 }
  }
};

const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Statistics data
  const stats = [
    { label: "Total Patients Care", value: "142k+", icon: Users, accent: "text-royalBlue bg-royalBlue/10" },
    { label: "Active Doctors", value: "80+", icon: UserCheck, accent: "text-green-500 bg-green-500/10" },
    { label: "Patient Satisfaction", value: "98.7%", icon: ShieldCheck, accent: "text-blue-500 bg-blue-500/10" },
    { label: "Response Time", value: "12 min", icon: AlertCircle, accent: "text-red-500 bg-red-500/10" },
  ];

  // Features data
  const features = [
    {
      title: "Patient Care System",
      description: "Comprehensive patient care plans, personalized health tracking, and continuous medical updates.",
      icon: Users,
    },
    {
      title: "Specialist Doctors",
      description: "Highly qualified specialists across all medical fields dedicated to your well-being.",
      icon: Stethoscope,
    },
    {
      title: "Seamless Booking",
      description: "Easy appointment scheduling, minimal waiting times, and prompt medical consultations.",
      icon: Calendar,
    },
    {
      title: "Advanced Pharmacy",
      description: "Fully stocked hospital pharmacy providing accurate prescriptions, dosage advice, and safe medications.",
      icon: Pill,
    },
    {
      title: "Transparent Billing",
      description: "Hassle-free billing processes, clear invoicing, and support for major insurance providers.",
      icon: DollarSign,
    },
    {
      title: "24/7 Emergency Care",
      description: "Immediate, round-the-clock emergency medical response and critical care services.",
      icon: AlertCircle,
    },
    {
      title: "Modern Facilities",
      description: "State-of-the-art diagnostic equipment, modern patient wards, and comfortable recovery spaces.",
      icon: TrendingUp,
    },
  ];

  // Services data
  const services = [
    { title: "Emergency Care", desc: "24/7 immediate trauma and critical medical response.", icon: Ambulance },
    { title: "Laboratory", desc: "Advanced diagnostic laboratory for fast and accurate test results.", icon: ScanLine },
    { title: "ICU & Triage", desc: "Intensive Care Unit with continuous patient monitoring and advanced support.", icon: Activity },
    { title: "Surgical Center", desc: "Modern operating theatres equipped for advanced surgical procedures.", icon: Building2 },
    { title: "Dispensing Pharmacy", desc: "Safe, certified dispensing pharmacy with expert pharmacists.", icon: Pill },
    { title: "General Consultation", desc: "Comprehensive family medicine, health checkups, and consultations.", icon: Stethoscope },
  ];

  // Doctors showcase
  const doctors = [
    {
      name: "Dr. Amina Warsame",
      specialization: "Chief Cardiologist",
      experience: "12 Years Experience",
      avatar: "https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=300"
    },
    {
      name: "Dr. Ibrahim Farah",
      specialization: "Senior Neurologist",
      experience: "10 Years Experience",
      avatar: "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=300"
    },
    {
      name: "Dr. Halima Osman",
      specialization: "Pediatric Specialist",
      experience: "8 Years Experience",
      avatar: "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=300"
    }
  ];

  // Testimonials
  const testimonials = [
    {
      quote: "The care and attention I received at Royal Hospital was exceptional. The doctors and nurses went above and beyond to ensure my quick recovery.",
      author: "Farhan Ali",
      role: "Recovered Patient",
      rating: 5,
      avatar: "https://images.pexels.com/photos/6129049/pexels-photo-6129049.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      quote: "Royal Hospital has the most professional medical team I have ever encountered. The modern facilities and warm care made all the difference.",
      author: "Hassan Omar",
      role: "Patient Family Member",
      rating: 5,
      avatar: "https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      quote: "I am extremely grateful for the prompt emergency care my father received. The response time was incredibly fast, and the treatment was excellent.",
      author: "Leyla Warsame",
      role: "Patient Daughter",
      rating: 5,
      avatar: "https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=150"
    }
  ];

  // Carousel timer
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,_#173155_0%,_#07111f_44%,_#020617_100%)] text-white font-sans selection:bg-royalBlue selection:text-white">
      
      {/* Background grids and blur orbs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 left-[-10rem] h-[40rem] w-[40rem] rounded-full bg-royalBlue/15 blur-[120px]" />
        <div className="absolute top-[30%] right-[-10rem] h-[35rem] w-[35rem] rounded-full bg-royalBlue/10 blur-[120px]" />
        <div className="absolute bottom-[-10rem] left-[20%] h-[30rem] w-[30rem] rounded-full bg-royalBlue/8 blur-[120px]" />
        
        {/* Futuristic grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] opacity-30" />
      </div>

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-navyBlue-950/40 border-b border-white/5 transition-all">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10" aria-label="Global Navigation">
          <Link to="/" className="group flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-royalBlue rounded-lg px-2">
            <BrandLogo showText className="transition-transform duration-300 group-hover:scale-[1.02]" />
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden items-center gap-8 text-sm font-bold text-royalBlue-300 md:flex">
            <a href="#features" className="transition-colors hover:text-white outline-none focus-visible:text-white">Features</a>
            <a href="#doctors" className="transition-colors hover:text-white outline-none focus-visible:text-white">Doctors</a>
            <a href="#services" className="transition-colors hover:text-white outline-none focus-visible:text-white">Services</a>
            <a href="#testimonials" className="transition-colors hover:text-white outline-none focus-visible:text-white">Testimonials</a>
            <a href="#contact" className="transition-colors hover:text-white outline-none focus-visible:text-white">Contact</a>
          </div>

          {/* Auth Button / Profile Dropdown */}
          <div className="hidden items-center gap-4 md:flex">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to={rolePath(user.role)}
                  className="flex items-center gap-3 rounded-full bg-navyBlue-800/80 border border-white/10 pl-2 pr-4 py-1.5 text-sm font-bold text-white hover:bg-navyBlue-700/80 transition-all focus-visible:ring-4 focus-visible:ring-royalBlue/20 outline-none shadow-lg"
                  aria-label="Go to Dashboard"
                >
                  <Avatar name={user.name} size="h-9 w-9 ring-2 ring-royalBlue/50" />
                  <div className="flex flex-col items-start text-left">
                    <span className="max-w-[120px] truncate text-sm font-black">{user.name.split(' ')[0]}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-royalBlue-400">{user.role}</span>
                  </div>
                </Link>

                <button
                  onClick={logout}
                  title="Logout"
                  aria-label="Logout"
                  className="flex items-center justify-center h-12 w-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all focus-visible:ring-4 focus-visible:ring-red-500/20 outline-none shadow-lg"
                >
                  <LogOut size={20} className="ml-1" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-black text-white backdrop-blur transition-all hover:bg-white/10 focus-visible:ring-4 focus-visible:ring-royalBlue/20 outline-none"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 rounded-full bg-royalBlue px-6 py-2.5 text-sm font-black text-white shadow-[0_12px_30px_rgba(27,117,187,0.25)] backdrop-blur transition-all hover:bg-royalBlue-400 focus-visible:ring-4 focus-visible:ring-royalBlue/30 outline-none"
                >
                  Sign Up <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-royalBlue-300 rounded-xl hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-royalBlue outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-navyBlue-950 border-t border-white/5 md:hidden"
            >
              <div className="flex flex-col gap-5 px-6 py-8">
                <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-base font-bold text-royalBlue-300 hover:text-white transition-colors">Features</a>
                <a href="#doctors" onClick={() => setMobileMenuOpen(false)} className="text-base font-bold text-royalBlue-300 hover:text-white transition-colors">Doctors</a>
                <a href="#services" onClick={() => setMobileMenuOpen(false)} className="text-base font-bold text-royalBlue-300 hover:text-white transition-colors">Services</a>
                <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="text-base font-bold text-royalBlue-300 hover:text-white transition-colors">Testimonials</a>
                <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-base font-bold text-royalBlue-300 hover:text-white transition-colors">Contact</a>

                <div className="pt-6 border-t border-white/5">
                  {user ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={user.name} size="h-10 w-10" />
                        <div>
                          <p className="text-sm font-black text-white">{user.name}</p>
                          <p className="text-xs text-royalBlue-300 font-bold capitalize">{user.role}</p>
                        </div>
                      </div>
                      <Link
                        to={rolePath(user.role)}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex w-full items-center justify-center gap-2 py-3.5 bg-royalBlue text-white rounded-2xl text-sm font-bold shadow-md shadow-royalBlue/20"
                      >
                        Go to Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full py-3.5 border border-red-500/30 text-red-400 bg-red-500/5 rounded-2xl text-sm font-bold hover:bg-red-500/10 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex w-full items-center justify-center py-4 bg-white/5 border border-white/10 text-white rounded-2xl text-sm font-bold"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex w-full items-center justify-center gap-2 py-4 bg-royalBlue text-white rounded-2xl text-sm font-bold shadow-lg shadow-royalBlue/20"
                      >
                        Sign Up <ArrowRight size={16} />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-12 md:px-10 lg:pt-20">
        <div className="grid gap-16 lg:grid-cols-12 lg:items-center">
          
          {/* Left Hero Text Column */}
          <div className="lg:col-span-6 space-y-8 max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl font-black leading-[0.9] tracking-[-0.05em] text-white md:text-7xl lg:text-[5.4rem] text-balance"
            >
              Royal Hospital <span className="text-transparent bg-clip-text bg-gradient-to-r from-royalBlue to-royalBlue-400 drop-shadow-[0_4px_30px_rgba(27,117,187,0.15)]">Your Health, Our Priority</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg leading-relaxed text-royalBlue-300 md:text-xl max-w-xl"
            >
              Providing world-class medical care with compassionate experts, advanced technology, and modern facilities dedicated to your health and recovery.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col gap-4 sm:flex-row pt-4"
            >
              {user ? (
                <Link
                  to={rolePath(user.role)}
                  className="btn-primary inline-flex items-center justify-center gap-3 px-8 py-4.5 text-base font-black shadow-[0_24px_60px_rgba(27,117,187,0.25)] focus-visible:ring-4 focus-visible:ring-royalBlue/20 outline-none rounded-full"
                >
                  Enter Portal <ArrowRight size={18} />
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="btn-primary inline-flex items-center justify-center gap-3 px-8 py-4.5 text-base font-black shadow-[0_24px_60px_rgba(27,117,187,0.25)] focus-visible:ring-4 focus-visible:ring-royalBlue/20 outline-none rounded-full"
                >
                  Enter Portal <ArrowRight size={18} />
                </Link>
              )}
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-white/10 bg-white/5 px-8 py-4.5 text-base font-black text-white backdrop-blur transition-all hover:bg-white/10 hover:border-royalBlue/50 focus-visible:ring-4 focus-visible:ring-royalBlue/20 outline-none shadow-lg active:scale-95"
              >
                View Features <ArrowRight size={18} />
              </a>
            </motion.div>
          </div>

          {/* Right Column: Live Interactive ECG vital dashboard mockup */}
          <div className="lg:col-span-6 relative">
            
            {/* Ambient decorative orbs inside mockup wrapper */}
            <div className="absolute -left-10 top-20 h-28 w-28 rounded-full bg-royalBlue/10 blur-xl" />
            <div className="absolute -right-5 bottom-12 h-36 w-36 rounded-full bg-green-500/5 blur-xl animate-pulse" />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, rotateY: -8 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ type: "spring", stiffness: 80, damping: 15 }}
              className="relative overflow-hidden rounded-[40px] border border-white/10 bg-navyBlue-950/70 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
            >
              
              {/* Mockup Header Controls */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-green-500 animate-ping" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-green-400">Live Patient Care Center</span>
                </div>
                <div className="flex gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
                </div>
              </div>

              {/* Main dashboard widgets grid */}
              <div className="space-y-6">
                
                {/* ECG Real-Time Vital EKG Chart Widget */}
                <div className="rounded-3xl border border-white/10 bg-black/40 p-5 shadow-inner">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <Activity size={16} className="text-green-400" />
                      <span className="text-xs font-black text-royalBlue-200">Patient Vital Monitoring</span>
                    </div>
                    <span className="text-xs font-black text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.3)]">72 BPM • STABLE</span>
                  </div>

                  {/* Animated Wave Path */}
                  <div className="w-full bg-navyBlue-950/80 rounded-2xl overflow-hidden p-2">
                    <svg viewBox="0 0 300 100" className="w-full h-24 text-green-400">
                      <defs>
                        <pattern id="ekgMesh" width="12" height="12" patternUnits="userSpaceOnUse">
                          <path d="M 12 0 L 0 0 0 12" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="0.5" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#ekgMesh)" />
                      <motion.path
                        d="M 0 50 L 50 50 L 58 35 L 63 65 L 68 15 L 73 85 L 78 45 L 83 55 L 90 50 L 150 50 L 158 35 L 163 65 L 168 15 L 173 85 L 178 45 L 183 55 L 190 50 L 250 50 L 258 35 L 263 65 L 268 15 L 273 85 L 278 45 L 283 55 L 290 50 L 300 50"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    </svg>
                  </div>
                </div>

                {/* Sub widgets row */}
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Queue state widget */}
                  <div className="rounded-3xl border border-white/5 bg-white/5 p-4 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-wider text-royalBlue-400">Active Consultations</div>
                      <div className="text-3xl font-black text-white mt-1">18</div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-4 text-[10px] font-bold text-green-400">
                      <span className="h-2 w-2 rounded-full bg-green-400 animate-ping" />
                      <span>Optimal Capacity</span>
                    </div>
                  </div>

                  {/* Active code override indicator */}
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-wider text-royalBlue-400">Emergency Status</div>
                      <div className="text-3xl font-black text-white mt-1">READY</div>
                    </div>
                    <div className="text-[10px] font-bold text-green-400 flex items-center gap-1.5 mt-4">
                      <AlertCircle size={12} className="animate-bounce text-green-400" />
                      <span>24/7 Service</span>
                    </div>
                  </div>

                </div>

                {/* Patient check-in entry list mockup */}
                <div className="rounded-3xl border border-white/5 bg-white/5 p-4.5 space-y-3">
                  <div className="text-[10px] font-black uppercase tracking-widest text-royalBlue-400">Ongoing Consultations</div>
                  {[
                    { name: "Ali Hassan", room: "Room 302-A", dept: "Cardiology", status: "Stable", dot: "bg-green-400" },
                    { name: "Faduma Omar", room: "ICU-04", dept: "Neurology", status: "Stable", dot: "bg-green-400" },
                  ].map((pat, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-2 border-b border-white/5 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2.5">
                        <div className={`h-2 w-2 rounded-full ${pat.dot}`} />
                        <div>
                          <p className="font-black text-white">{pat.name}</p>
                          <p className="text-[10px] text-royalBlue-300 font-bold">{pat.room} • {pat.dept}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-royalBlue bg-royalBlue-500/20 px-2 py-0.5 rounded-full">{pat.status}</span>
                    </div>
                  ))}
                </div>

              </div>

            </motion.div>
          </div>

        </div>
      </section>

      {/* STATISTICS SECTION */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-12 md:px-10">
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={fadeInUpVariants}
              whileHover={{ y: -5 }}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all shadow-[0_8px_30px_rgba(0,0,0,0.02)]"
            >
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br from-royalBlue/10 to-transparent blur-xl" />
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3.5 rounded-2xl ${stat.accent}`}>
                  <stat.icon size={22} />
                </div>
              </div>
              <div className="text-3xl font-black text-white tracking-tight md:text-4xl mb-1">{stat.value}</div>
              <div className="text-[11px] font-black uppercase tracking-wider text-royalBlue-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:px-10">
        <div className="max-w-3xl mb-16 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-royalBlue">Our Features</p>
          <h2 className="text-4xl font-black tracking-[-0.04em] text-white md:text-5xl lg:text-6xl text-balance">
            World-Class Healthcare Services & Medical Excellence
          </h2>
          <p className="text-base text-royalBlue-300 max-w-2xl leading-relaxed">
            At Royal Hospital, we bring together leading specialists, cutting-edge treatment facilities, and a patient-first approach to deliver unparalleled medical care.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:border-royalBlue/50"
            >
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-royalBlue/5 blur-xl transition-all group-hover:bg-royalBlue/15" />
              <div className="inline-flex rounded-2xl bg-royalBlue/10 p-4 text-royalBlue-300 shadow-lg transition-transform group-hover:scale-110">
                <feat.icon size={24} />
              </div>
              <h3 className="mt-6 text-xl font-black text-white tracking-tight">{feat.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-royalBlue-300">{feat.description}</p>
              
              <div className="mt-8 h-0.5 w-full bg-gradient-to-r from-royalBlue/30 to-transparent transition-all group-hover:from-royalBlue" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* DOCTORS SHOWCASE */}
      <section id="doctors" className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:px-10">
        <div className="max-w-3xl mb-16 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-royalBlue">Clinical Leaders</p>
          <h2 className="text-4xl font-black tracking-[-0.04em] text-white md:text-5xl lg:text-6xl">
            Meet Our Senior Physicians
          </h2>
          <p className="text-base text-royalBlue-300 max-w-2xl leading-relaxed">
            Our medical staff combines years of experience with state-of-the-art technological clinical workflows to deliver premium care.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doc, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-[36px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-royalBlue/40 hover:shadow-[0_20px_50px_rgba(27,117,187,0.15)]"
            >
              {/* Doctor Avatar Wrap */}
              <div className="relative overflow-hidden rounded-3xl h-64 bg-navyBlue-900 border border-white/5 mb-6">
                <img
                  src={doc.avatar}
                  alt={doc.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div>
                <span className="text-[10px] font-black text-royalBlue uppercase tracking-widest">{doc.specialization}</span>
                <h3 className="text-2xl font-black text-white mt-1 group-hover:text-royalBlue transition-colors">{doc.name}</h3>
                <p className="text-xs font-bold text-royalBlue-300 mt-1">{doc.experience}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-black text-royalBlue-400">
                <span>View Availability</span>
                <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:px-10">
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-4 max-w-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-royalBlue">Clinical Care Areas</p>
            <h2 className="text-4xl font-black tracking-[-0.04em] text-white md:text-5xl lg:text-6xl">
              Specialized Departments
            </h2>
          </div>
          <p className="max-w-xl text-base text-royalBlue-300 leading-relaxed">
            Highly optimized service units equipped with advanced cardiac monitoring, triage workflows, and round-the-clock intensive clinical support.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="group flex gap-5 items-start p-6 rounded-[28px] border border-white/5 bg-white/5 hover:bg-white/[0.08] hover:border-royalBlue/30 transition-all duration-300"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-royalBlue/10 text-royalBlue-300 shadow-md transition-transform group-hover:scale-110">
                <service.icon size={24} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-black text-white">{service.title}</h3>
                <p className="text-sm leading-relaxed text-royalBlue-300">{service.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section id="testimonials" className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:px-10">
        <div className="rounded-[48px] border border-white/10 bg-navyBlue-950/50 p-8 shadow-2xl backdrop-blur-2xl md:p-16">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            
            {/* Left Header info */}
            <div className="lg:col-span-4 space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-royalBlue">Testimonials</p>
              <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl lg:text-5xl">
                What Our Patients Say
              </h2>
              <p className="text-sm text-royalBlue-300 leading-relaxed max-w-sm">
                We are proud of the trust our patients place in us. Here is what they say about their experience at Royal Hospital.
              </p>

              {/* Slider Dots */}
              <div className="flex gap-2.5 pt-4">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${activeTestimonial === index ? 'w-8 bg-royalBlue' : 'w-2.5 bg-white/20'}`}
                    aria-label={`Show slide number ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Right Testimonial Card */}
            <div className="lg:col-span-8 relative">
              <div className="absolute -left-10 -top-10 text-white/5 font-serif text-[12rem] select-none pointer-events-none">“</div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Active stars */}
                  <div className="flex gap-1">
                    {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                      <Star key={i} size={16} className="fill-royalYellow text-royalYellow" />
                    ))}
                  </div>

                  <blockquote className="text-xl md:text-2xl font-semibold leading-relaxed text-white">
                    "{testimonials[activeTestimonial].quote}"
                  </blockquote>

                  <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                    <Avatar src={testimonials[activeTestimonial].avatar} name={testimonials[activeTestimonial].author} size="h-12 w-12 border-2 border-royalBlue shadow-sm" />
                    <div>
                      <p className="font-black text-white text-base">{testimonials[activeTestimonial].author}</p>
                      <p className="text-xs text-royalBlue-300 font-bold">{testimonials[activeTestimonial].role}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation arrows */}
              <div className="absolute -bottom-16 right-0 flex gap-3">
                <button
                  onClick={() => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                  className="p-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all active:scale-95 focus-visible:ring-4 focus-visible:ring-royalBlue/20 outline-none"
                  aria-label="Previous Testimonial"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
                  className="p-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all active:scale-95 focus-visible:ring-4 focus-visible:ring-royalBlue/20 outline-none"
                  aria-label="Next Testimonial"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section id="contact" className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:px-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[48px] bg-gradient-to-br from-navyBlue-900 to-navyBlue-800 p-10 shadow-2xl md:p-16 text-center"
        >
          {/* Grid canvas texture layer */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay" />
          {/* Glowing gradient orbs */}
          <div className="absolute -left-20 -top-20 h-48 w-48 rounded-full bg-royalBlue/20 blur-3xl animate-pulse" />
          <div className="absolute -right-20 -bottom-20 h-48 w-48 rounded-full bg-royalBlue-500/25 blur-3xl" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl font-black leading-tight tracking-[-0.04em] text-white md:text-6xl text-balance">
              Your Journey to Good Health Begins Here
            </h2>
            <p className="text-lg text-royalBlue-200/80 leading-relaxed max-w-xl mx-auto">
              Whether you need an emergency consultation, routine checkup, or specialized treatment, Royal Hospital is here for you 24/7.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row justify-center pt-4">
              {user ? (
                <Link
                  to={rolePath(user.role)}
                  className="btn-primary px-8 py-4.5 text-base font-black shadow-[0_24px_60px_rgba(27,117,187,0.25)] focus-visible:ring-4 focus-visible:ring-royalBlue/20 outline-none"
                >
                  Enter Portal
                </Link>
              ) : (
                <div className="flex flex-col gap-4 sm:flex-row justify-center">
                  <Link
                    to="/login"
                    className="btn-primary px-8 py-4.5 text-base font-black shadow-[0_24px_60px_rgba(27,117,187,0.25)] focus-visible:ring-4 focus-visible:ring-royalBlue/20 outline-none"
                  >
                    Enter Portal <ArrowRight size={18} />
                  </Link>
                </div>
              )}
              <a
                href="tel:+252615001234"
                className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/20 bg-white/5 px-8 py-4.5 text-base font-black text-white backdrop-blur hover:bg-white/10 transition-all focus-visible:ring-4 focus-visible:ring-royalBlue/30 outline-none active:scale-95"
              >
                Call Us Now <Phone size={18} />
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/5 bg-navyBlue-950/80 px-6 py-16 md:px-10">
        <div className="mx-auto max-w-7xl grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Logo brand & tagline */}
          <div className="space-y-6">
            <BrandLogo showText />
            <p className="text-xs leading-relaxed text-royalBlue-400">
              Royal Hospital is dedicated to providing high-quality, compassionate, and advanced medical care to our community.
            </p>
            <div className="flex gap-4">
              <a href="#" className="h-9 w-9 rounded-xl border border-white/5 bg-white/5 flex items-center justify-center text-royalBlue-300 hover:bg-royalBlue hover:text-white transition-colors" aria-label="Hospital Twitter Profile">
                <Sparkles size={16} />
              </a>
              <a href="#" className="h-9 w-9 rounded-xl border border-white/5 bg-white/5 flex items-center justify-center text-royalBlue-300 hover:bg-royalBlue hover:text-white transition-colors" aria-label="Hospital LinkedIn Profile">
                <Activity size={16} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h4 className="text-sm font-black uppercase tracking-widest text-white">Navigation</h4>
            <ul className="space-y-2.5 text-xs font-bold text-royalBlue-400">
              <li><a href="#features" className="hover:text-white transition-colors">Our Features</a></li>
              <li><a href="#doctors" className="hover:text-white transition-colors">Our Doctors</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Our Departments</a></li>
              <li><a href="#testimonials" className="hover:text-white transition-colors">Patient Testimonials</a></li>
            </ul>
          </div>

          {/* Direct Services */}
          <div className="space-y-4">
            <h4 className="text-sm font-black uppercase tracking-widest text-white">Direct Access</h4>
            <ul className="space-y-2.5 text-xs font-bold text-royalBlue-400">
              <li><Link to="/login" className="hover:text-white transition-colors">Portal Access</Link></li>
              <li><a href="mailto:info@royalhospital.com" className="hover:text-white transition-colors">Contact Support</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact info */}
          <div className="space-y-4">
            <h4 className="text-sm font-black uppercase tracking-widest text-white">Contact Royal Hospital</h4>
            <ul className="space-y-3 text-xs font-bold text-royalBlue-400">
              <li className="flex items-center gap-2.5">
                <MapPin size={14} className="text-royalBlue" />
                <span>32 Royal Hospital Road, Mogadishu</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={14} className="text-royalBlue" />
                <span>+252 (61) 500-1234</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={14} className="text-royalBlue" />
                <span>info@royalhospital.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mx-auto max-w-7xl mt-12 pt-8 border-t border-white/5 text-center text-xs font-bold text-royalBlue-500">
          &copy; 2026 Royal Hospital &amp; Research Center. All rights reserved.
        </div>
      </footer>

    </div>
  );
}
