import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BrandLogo from "../components/BrandLogo";
import { rolePath } from "../config/roles";
import {
  Mail,
  Lock,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(form);
      navigate(rolePath(user.role));
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        (err?.response?.status === 404
          ? "Login API not found. Check the backend URL."
          : err?.code === "ERR_NETWORK"
            ? "Cannot reach the server. Check backend deployment."
            : "Login failed. Please try again.");
      alert(message);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans">
      
      {/* Left Side: Premium Branding */}
      <div className="lg:w-1/2 bg-royalBlue-950 relative overflow-hidden flex flex-col justify-between p-12">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-royalBlue/30 rounded-full blur-[140px]"></div>
          <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-royalYellow/15 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center text-white mb-20 group">
            <BrandLogo
              compact
              showText
              className="group-hover:scale-110 transition-transform"
            />
          </Link>
          <div className="max-w-md">
            <h1 className="text-5xl font-black text-white leading-tight mb-6">
              Modern Care <br />
              <span className="text-royalYellow text-6xl">
                Excellence.
              </span>
              <br /> Starting Here.
            </h1>
            <p className="text-lg text-royalBlue-400">
              Access the hospital management system. Our platform intelligently
              detects your role and provides the relevant dashboard.
            </p>
          </div>
        </div>
        
        {/* Placeholder to keep alignment */}
        <div className="h-6" />
      </div>

      {/* Right Side: Simple & Secure Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 bg-royalBlue-50">
        <div className="w-full max-w-md animate-fade-in-up">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-royalBlue-500 hover:text-royalBlue transition-colors mb-12 font-bold text-sm uppercase tracking-widest"
          >
            <ArrowLeft size={16} /> Back to Home
          </Link>

          <div className="mb-10">
            <h2 className="text-4xl font-black text-royalBlue-900 mb-2">
              Sign In
            </h2>
            <p className="text-royalBlue-500 font-medium text-lg">
              Access your secure workspace
            </p>
          </div>

          <form onSubmit={submit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-royalBlue-400 group-focus-within:text-royalBlue transition-colors"
                  size={20}
                />
                <input
                  className="w-full bg-white rounded-2xl border border-royalBlue-200 p-5 pl-12 text-royalBlue-900 font-medium placeholder:text-royalBlue-300 focus:outline-none focus:ring-4 focus:ring-royalBlue/10 focus:border-royalBlue transition-all"
                  placeholder="Email Address"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-royalBlue-400 group-focus-within:text-royalBlue transition-colors"
                  size={20}
                />
                <input
                  className="w-full bg-white rounded-2xl border border-royalBlue-200 p-5 pl-12 text-royalBlue-900 font-medium placeholder:text-royalBlue-300 focus:outline-none focus:ring-4 focus:ring-royalBlue/10 focus:border-royalBlue transition-all"
                  placeholder="Password"
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <button className="btn-primary w-full py-5 rounded-[24px] text-lg font-bold flex items-center justify-center gap-3 group">
              Login
              <ChevronRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
