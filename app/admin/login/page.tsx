"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { isAdminUser } from "@/lib/adminAuth";
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2, Sparkles, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/admin";
  const { user, signInWithEmail, signInWithGoogle, isFirebaseReady } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in as admin, redirect immediately
  useEffect(() => {
    if (user && isAdminUser(user)) {
      router.replace(redirectUrl);
    }
  }, [user, redirectUrl, router]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please provide both email and password.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await signInWithEmail(email.trim(), password);
      // Auth state change will handle redirect if email is in admin list
    } catch (err: any) {
      setError(err?.message || "Failed to authenticate. Please check your credentials.");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      // Auth state change will handle redirect
    } catch (err: any) {
      setError(err?.message || "Google authentication failed.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070907] text-white flex flex-col justify-between relative overflow-hidden selection:bg-emerald-500 selection:text-black">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="p-6 md:p-8 flex items-center justify-between relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Storefront
        </Link>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/80 border border-neutral-800 text-[11px] font-mono text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          STAGE & STEEL CMS v2.0
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md bg-[#0e120f]/90 border border-emerald-500/20 rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-2xl relative">
          {/* Decorative Corner accents */}
          <div className="absolute top-0 left-8 w-16 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
          <div className="absolute bottom-0 right-8 w-16 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />

          {/* Logo & Headline */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-4 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black tracking-wider uppercase text-white font-sans">
              Admin Command
            </h1>
            <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest mt-1">
              Stage & Steel Core Management System
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Admin Email Info Notice */}
          <div className="mb-6 p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 text-[11px] font-mono text-neutral-400 flex items-center justify-between">
            <span>Configured Master Email:</span>
            <span className="text-emerald-400 font-semibold">jaynirala82@gmail.com</span>
          </div>

          {/* Google One-Click Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className="w-full mb-6 py-3.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white font-medium text-xs uppercase tracking-wider flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-50"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
                />
              </svg>
            )}
            <span>Sign in with Google Master Account</span>
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-neutral-800" />
            <span className="text-[10px] font-mono uppercase text-neutral-400">or sign in with password</span>
            <div className="flex-1 h-px bg-neutral-800" />
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jaynirala82@gmail.com"
                  className="w-full bg-[#141a15] border border-neutral-800 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-neutral-400 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                Master Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#141a15] border border-neutral-800 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-neutral-400 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full mt-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Enter CMS Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs font-mono text-neutral-400 relative z-10">
        Stage & Steel Nutrition © 2026 • Encrypted Administrator Clearance Required
      </footer>
    </div>
  );
}
