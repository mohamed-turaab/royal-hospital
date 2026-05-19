import React, { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, AlertCircle, ArrowRight, Activity, Building2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { rolePath } from "../config/roles";
import BrandLogo from "../components/BrandLogo";

export default function Signup() {
  const navigate = useNavigate();
  const { register, user, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect them
  if (user && !loading) {
    return <Navigate to={rolePath(user.role)} replace />;
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError(""); // clear error when typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required.");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setIsSubmitting(true);
      const newUser = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      navigate(rolePath(newUser.role));
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#020617] p-4 text-white overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] h-[50vh] w-[50vw] rounded-full bg-royalBlue/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[50vh] w-[50vw] rounded-full bg-royalBlue/10 blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side: Brand & Messaging */}
        <div className="hidden lg:flex flex-col justify-center space-y-10 p-8">
          <Link to="/" className="inline-block outline-none focus-visible:ring-4 focus-visible:ring-royalBlue/20 rounded-xl">
            <BrandLogo showText />
          </Link>
          <div className="space-y-4">
            <h1 className="text-4xl font-black leading-tight text-white xl:text-5xl tracking-tight">
              Join the Unified <span className="text-transparent bg-clip-text bg-gradient-to-r from-royalBlue to-royalBlue-400">Clinical Network</span>
            </h1>
            <p className="text-lg text-royalBlue-300 leading-relaxed max-w-md">
              Create an account to securely book appointments, access your medical records, and track your vital health history.
            </p>
          </div>
          
          <div className="space-y-6 pt-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
                <Activity className="text-royalBlue-300" size={20} />
              </div>
              <div>
                <p className="text-sm font-black text-white">Real-time Vitals</p>
                <p className="text-xs text-royalBlue-400 font-bold">Track your health metrics seamlessly.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
                <Building2 className="text-royalBlue-300" size={20} />
              </div>
              <div>
                <p className="text-sm font-black text-white">Direct Booking</p>
                <p className="text-xs text-royalBlue-400 font-bold">Schedule visits with senior specialists.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Signup Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="rounded-[32px] border border-white/10 bg-navyBlue-950/60 p-8 shadow-[0_30px_100px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:p-10">
            <div className="mb-8">
              <Link to="/" className="lg:hidden mb-8 inline-block">
                <BrandLogo showText />
              </Link>
              <h2 className="text-2xl font-black text-white">Create Account</h2>
              <p className="mt-2 text-sm text-royalBlue-300">Enter your details to register as a patient.</p>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 overflow-hidden rounded-2xl bg-red-500/10 border border-red-500/20"
                >
                  <div className="flex items-center gap-3 p-4 text-sm font-bold text-red-400">
                    <AlertCircle size={18} className="shrink-0" />
                    <p>{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-royalBlue-300 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-royalBlue-400" size={18} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-sm text-white placeholder-royalBlue-500 transition-colors focus:border-royalBlue focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-royalBlue/20"
                    placeholder="E.g. Ali Hassan"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-royalBlue-300 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-royalBlue-400" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-sm text-white placeholder-royalBlue-500 transition-colors focus:border-royalBlue focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-royalBlue/20"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-royalBlue-300 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-royalBlue-400" size={18} />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-sm text-white placeholder-royalBlue-500 transition-colors focus:border-royalBlue focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-royalBlue/20"
                    placeholder="Create a strong password"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-royalBlue-300 ml-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-royalBlue-400" size={18} />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-sm text-white placeholder-royalBlue-500 transition-colors focus:border-royalBlue focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-royalBlue/20"
                    placeholder="Repeat your password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex w-full items-center justify-center gap-2 py-4 mt-2 font-black shadow-[0_12px_30px_rgba(27,117,187,0.25)] focus-visible:ring-4 focus-visible:ring-royalBlue/20 outline-none disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Registering...
                  </span>
                ) : (
                  <>
                    Sign Up <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="text-center pt-4 border-t border-white/5 mt-6">
                <p className="text-sm text-royalBlue-300 font-bold">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-white hover:text-royalBlue transition-colors outline-none focus-visible:text-royalBlue focus-visible:underline"
                  >
                    Sign In here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
