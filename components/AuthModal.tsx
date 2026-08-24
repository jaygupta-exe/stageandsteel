"use client";

import React, { useState } from "react";
import { X, Mail, Lock, User as UserIcon, AlertCircle, CheckCircle2, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authMode,
    setAuthMode,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
    isFirebaseReady,
  } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const resetFormState = () => {
    setError(null);
    setSuccess(null);
  };

  const handleModeChange = (mode: "signin" | "signup" | "forgot") => {
    resetFormState();
    setAuthMode(mode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();
    setIsSubmitting(true);

    try {
      if (authMode === "signin") {
        await signInWithEmail(email, password);
        closeAuthModal();
      } else if (authMode === "signup") {
        if (!name.trim()) {
          throw new Error("Please enter your name.");
        }
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters.");
        }
        await signUpWithEmail(name, email, password);
        closeAuthModal();
      } else if (authMode === "forgot") {
        await resetPassword(email);
        setSuccess("Password reset email sent! Check your inbox.");
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      let message = err?.message || "An unexpected error occurred.";
      if (message.includes("auth/user-not-found") || message.includes("auth/wrong-password") || message.includes("auth/invalid-credential")) {
        message = "Invalid email or password.";
      } else if (message.includes("auth/email-already-in-use")) {
        message = "An account with this email already exists.";
      } else if (message.includes("auth/invalid-email")) {
        message = "Please enter a valid email address.";
      } else if (message.includes("auth/weak-password")) {
        message = "Password should be at least 6 characters.";
      } else if (message.includes("auth/network-request-failed")) {
        message = "Network error. Please check your internet connection.";
      }
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    resetFormState();
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      closeAuthModal();
    } catch (err: any) {
      console.error("Google Auth error:", err);
      if (err?.code !== "auth/popup-closed-by-user") {
        setError(err?.message || "Google sign-in failed.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0c0d0c]/85 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={closeAuthModal}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-[#181917] border border-[#333530] text-[#F4F4F1] shadow-2xl overflow-hidden z-10">
        
        {/* Top Military Accent Bar */}
        <div className="h-1 bg-gradient-to-r from-[#596238] via-[#75804c] to-[#596238]" />

        {/* Header Header */}
        <div className="p-6 sm:p-7 pb-4 flex items-start justify-between border-b border-[#292a26]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#75804c] uppercase">
                STAGE & STEEL LAB // AUTH
              </span>
            </div>
            <h2 className="text-2xl font-editorial font-bold tracking-wide uppercase text-white">
              {authMode === "signin" && "ACCESS TERMINAL"}
              {authMode === "signup" && "CREATE MEMBER ACCOUNT"}
              {authMode === "forgot" && "RECOVER CREDENTIALS"}
            </h2>
            <p className="text-xs text-[#9c9e99] mt-0.5">
              {authMode === "signin" && "Sign in to manage your orders and nutrition stack."}
              {authMode === "signup" && "Join Stage & Steel for priority drops & tracking."}
              {authMode === "forgot" && "Enter your email to receive recovery instructions."}
            </p>
          </div>

          <button
            onClick={closeAuthModal}
            className="p-1.5 text-[#9c9e99] hover:text-white hover:bg-[#252723] transition-colors rounded-xs focus:outline-hidden cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isFirebaseReady && (
          <div className="mx-6 mt-4 p-3 bg-[#596238]/15 border border-[#596238]/40 text-xs text-[#d8dbd2] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-[#75804c] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Firebase Config Notice:</span>
              Add your Firebase credentials to <code className="bg-[#121312] px-1 py-0.5 text-[#75804c]">.env.local</code> to activate live authentication.
            </div>
          </div>
        )}

        {/* Tab Switcher */}
        {authMode !== "forgot" && (
          <div className="grid grid-cols-2 border-b border-[#292a26] text-xs font-mono tracking-wider font-semibold">
            <button
              type="button"
              onClick={() => handleModeChange("signin")}
              className={`py-3 text-center transition-colors uppercase cursor-pointer ${
                authMode === "signin"
                  ? "bg-[#252723] text-white border-b-2 border-[#75804c]"
                  : "text-[#888a84] hover:text-white hover:bg-[#1f201d]"
              }`}
            >
              01. SIGN IN
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("signup")}
              className={`py-3 text-center transition-colors uppercase cursor-pointer ${
                authMode === "signup"
                  ? "bg-[#252723] text-white border-b-2 border-[#75804c]"
                  : "text-[#888a84] hover:text-white hover:bg-[#1f201d]"
              }`}
            >
              02. SIGN UP
            </button>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 sm:p-7 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-3 bg-[#596238]/30 border border-[#75804c] text-[#e0e8d3] text-xs flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-[#75804c] shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Google Sign-in Button */}
          {authMode !== "forgot" && (
            <>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-[#232521] hover:bg-[#2c2f2a] border border-[#3a3d36] hover:border-[#596238] text-xs font-mono uppercase tracking-wider text-white transition-all disabled:opacity-50 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.5 0 2.8.5 3.9 1.4l2.9-2.9C17 1.8 14.7 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.2 2.8-2.5 3.7l3.7 2.9c2.2-2 3.8-5 3.8-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-[#292a26] w-full" />
                <span className="bg-[#181917] px-3 text-[10px] font-mono text-[#777873] uppercase tracking-widest">
                  OR EMAIL
                </span>
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {authMode === "signup" && (
              <div>
                <label className="block text-[10px] font-mono tracking-widest text-[#9c9e99] uppercase mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#777873]" />
                  <input
                    type="text"
                    required
                    placeholder="Alex Mercer"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#111211] border border-[#333530] focus:border-[#75804c] text-white text-xs pl-9 pr-3 py-2.5 placeholder:text-[#555652] focus:outline-hidden transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-mono tracking-widest text-[#9c9e99] uppercase mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#777873]" />
                <input
                  type="email"
                  required
                  placeholder="athlete@stageandsteel.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#111211] border border-[#333530] focus:border-[#75804c] text-white text-xs pl-9 pr-3 py-2.5 placeholder:text-[#555652] focus:outline-hidden transition-colors"
                />
              </div>
            </div>

            {authMode !== "forgot" && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[10px] font-mono tracking-widest text-[#9c9e99] uppercase">
                    Password
                  </label>
                  {authMode === "signin" && (
                    <button
                      type="button"
                      onClick={() => handleModeChange("forgot")}
                      className="text-[10px] font-mono text-[#75804c] hover:underline cursor-pointer"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#777873]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#111211] border border-[#333530] focus:border-[#75804c] text-white text-xs pl-9 pr-9 py-2.5 placeholder:text-[#555652] focus:outline-hidden transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777873] hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 bg-[#596238] hover:bg-[#687342] text-white font-editorial font-bold tracking-widest text-sm uppercase transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer shadow-md shadow-[#596238]/20"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {authMode === "signin" && "AUTHORIZE & SIGN IN"}
                    {authMode === "signup" && "CREATE ACCOUNT"}
                    {authMode === "forgot" && "SEND RECOVERY LINK"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {authMode === "forgot" && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => handleModeChange("signin")}
                className="text-xs font-mono text-[#75804c] hover:underline uppercase tracking-wider cursor-pointer"
              >
                &larr; Back to Sign In
              </button>
            </div>
          )}
        </div>

        {/* Footer Security Stamp */}
        <div className="bg-[#121312] px-6 py-3 border-t border-[#292a26] flex items-center justify-between text-[10px] font-mono text-[#777873]">
          <span>ENCRYPTION // TLS 1.3</span>
          <span>STAGE & STEEL LAB</span>
        </div>

      </div>
    </div>
  );
}
