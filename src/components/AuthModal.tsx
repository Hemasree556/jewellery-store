import React, { useState } from "react";
import { X, Lock, Mail, User, ShieldCheck, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

export default function AuthModal({ isOpen, onClose, isDark }: AuthModalProps) {
  const { login, signup, loginWithGoogle, resetPassword, error, setError } = useAuth();
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === "login") {
        await login(email, password);
        onClose();
      } else if (mode === "signup") {
        if (!name.trim()) {
          setError("Please enter your name.");
          setLoading(false);
          return;
        }
        await signup(email, password, name);
        onClose();
      } else {
        await resetPassword(email);
        setSuccessMsg("We sent a password recovery link to your inbox.");
      }
    } catch (err) {
      // Handled inside auth context already
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      onClose();
    } catch (err) {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ type: "spring", duration: 0.5 }}
        className={`relative w-full max-w-md overflow-hidden border border-[#D4AF37]/30 p-8 md:p-10 z-10 rounded-none shadow-2xl ${
          isDark ? "bg-[#0F0F0F] text-[#FAF9F6]" : "bg-[#FAF9F6] text-[#0F0F0F]"
        }`}
      >
        {/* Glow decoration */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-1.5 border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 hover:text-[#D4AF37] text-neutral-400 transition-all rounded-none cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <span className="uppercase text-[10px] tracking-[0.4em] text-[#D4AF37] font-semibold mb-2 block">
            Haara Concierge Services
          </span>
          <h2 className="text-3xl font-serif tracking-wider font-light">
            {mode === "login" && "Atelier Portal"}
            {mode === "signup" && "Create Signature Account"}
            {mode === "forgot" && "Reset Password"}
          </h2>
          <p className="text-xs text-neutral-400 mt-2 font-sans max-w-[280px] mx-auto leading-relaxed">
            {mode === "login" && "Access your private consultations, historical commission files, and bespoke designs curation."}
            {mode === "signup" && "Unlock personal portfolios, bespoke jewelry sketching boards, and prioritized secure delivery."}
            {mode === "forgot" && "Enter your registered email to reclaim your exclusive bespoke access."}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5 font-sans">
          {/* Email / Password Alerts */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 border border-red-500/25 bg-red-950/20 text-red-400 text-xs text-center"
            >
              {error}
            </motion.div>
          )}

          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] text-xs text-center"
            >
              {successMsg}
            </motion.div>
          )}

          {/* Name Field (Sign up only) */}
          {mode === "signup" && (
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-medium block">
                Your Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Varada Hemasree"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  className={`w-full pl-10 pr-4 py-3 text-xs transition-all tracking-wide focus:outline-none rounded-none border ${
                    isDark
                      ? "bg-[#1A1A1A] border-[#D4AF37]/20 text-[#FAF9F6] focus:border-[#D4AF37]"
                      : "bg-white border-[#D4AF37]/35 text-[#0F0F0F] focus:border-[#D4AF37]"
                  }`}
                />
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-medium block">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="e.g. sreeh5671@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className={`w-full pl-10 pr-4 py-3 text-xs transition-all tracking-wide focus:outline-none rounded-none border ${
                  isDark
                    ? "bg-[#1A1A1A] border-[#D4AF37]/20 text-[#FAF9F6] focus:border-[#D4AF37]"
                    : "bg-white border-[#D4AF37]/35 text-[#0F0F0F] focus:border-[#D4AF37]"
                }`}
              />
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
            </div>
          </div>

          {/* Password Field */}
          {mode !== "forgot" && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-medium block">
                  Password
                </label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgot");
                      setError(null);
                      setSuccessMsg(null);
                    }}
                    className="text-[10px] uppercase tracking-wider text-neutral-500 hover:text-[#D4AF37] transition-colors cursor-pointer"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className={`w-full pl-10 pr-4 py-3 text-xs transition-all tracking-wide focus:outline-none rounded-none border ${
                    isDark
                      ? "bg-[#1A1A1A] border-[#D4AF37]/20 text-[#FAF9F6] focus:border-[#D4AF37]"
                      : "bg-white border-[#D4AF37]/35 text-[#0F0F0F] focus:border-[#D4AF37]"
                  }`}
                />
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D4AF37] hover:bg-[#FAF9F6] hover:text-[#0F0F0F] text-[#0F0F0F] py-3.5 border border-[#D4AF37] rounded-none text-xs uppercase tracking-[0.2em] font-bold transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-[#0F0F0F] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>
                  {mode === "login" && "Sign In"}
                  {mode === "signup" && "Create Account"}
                  {mode === "forgot" && "Send Reset Link"}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Third-Party Login Options */}
        {mode !== "forgot" && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between text-[10px] text-neutral-500 uppercase tracking-widest">
              <span className="w-1/4 h-[1px] bg-neutral-800"></span>
              <span>Or Authenticate Via</span>
              <span className="w-1/4 h-[1px] bg-neutral-800"></span>
            </div>

            {/* Google Popup Login */}
            <button
              onClick={handleGoogleSignIn}
              type="button"
              disabled={loading}
              className={`w-full border py-3.5 rounded-none text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-2.5 cursor-pointer hover:bg-[#D4AF37]/10 ${
                isDark
                  ? "bg-[#1A1A1A] border-[#D4AF37]/20 text-neutral-300 hover:text-white"
                  : "bg-white border-[#D4AF37]/30 text-neutral-700 hover:text-black"
              }`}
            >
              {/* Google Classic Vector Mini */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61c-.29 1.5-.1.35.85 1.5l.02.02v2.54h3.1c1.8-1.66 2.83-4.11 2.83-6.91z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.1-2.54c-.86.58-1.97.94-3.1 1.05-1.12.11-2.22-.16-3.18-.77s-1.68-1.57-2.03-2.69H.83v2.62a11.967 11.967 0 0 0 11.17 7.37z"
                />
                <path
                  fill="#FBBC05"
                  d="M6.55 14.14c-.18-.54-.28-1.11-.28-1.7s.1-1.16.28-1.7V8.12H.83a11.96 11.96 0 0 0 0 10.76l5.72-4.74z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.22 0 12 0 7.24 0 3.14 2.76.83 6.78l5.72 4.74c.48-1.45 1.35-2.61 2.58-3.39a6.836 6.836 0 0 1 2.87-1.38z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
        )}

        {/* Footer Link Navigation */}
        <div className="mt-8 text-center text-xs font-sans text-neutral-400">
          {mode === "login" && (
            <p>
              New to HAARA?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError(null);
                  setSuccessMsg(null);
                }}
                className="text-[#D4AF37] hover:underline hover:text-[#FAF9F6] transition-colors font-medium cursor-pointer"
              >
                Create basic account
              </button>
            </p>
          )}

          {mode === "signup" && (
            <p>
              Already registered?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                  setSuccessMsg(null);
                }}
                className="text-[#D4AF37] hover:underline hover:text-[#FAF9F6] transition-colors font-medium cursor-pointer"
              >
                Sign into Atelier
              </button>
            </p>
          )}

          {mode === "forgot" && (
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
                setSuccessMsg(null);
              }}
              className="text-[#D4AF37] hover:underline hover:text-[#FAF9F6] transition-colors font-medium cursor-pointer flex items-center justify-center mx-auto space-x-1"
            >
              <span>Back to Portal login</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
