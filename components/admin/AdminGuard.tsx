"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { isAdminUser } from "@/lib/adminAuth";
import { ShieldAlert, LogOut, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, logout, isFirebaseReady } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Allow login page to render without guard blocking
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-[#0a0c0a] text-white flex flex-col items-center justify-center p-6">
        <div className="relative flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
          <Sparkles className="w-6 h-6 text-emerald-400 absolute" />
        </div>
        <p className="text-sm font-mono tracking-widest text-emerald-400 uppercase animate-pulse">
          Authenticating Master Clearance...
        </p>
      </div>
    );
  }

  // Not logged in at all
  if (!user) {
    if (typeof window !== "undefined") {
      router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
    }
    return (
      <div className="min-h-screen bg-[#0a0c0a] text-white flex flex-col items-center justify-center p-6">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-4" />
        <p className="text-sm text-neutral-400">Redirecting to Stage & Steel Admin Portal...</p>
      </div>
    );
  }

  // Logged in, but not in admin whitelist
  if (!isAdminUser(user)) {
    return (
      <div className="min-h-screen bg-[#0a0c0a] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#111612] border border-red-900/50 rounded-2xl p-8 shadow-2xl backdrop-blur-xl text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-950/60 border border-red-500/30 flex items-center justify-center mb-6">
            <ShieldAlert className="w-8 h-8 text-red-400" />
          </div>

          <h2 className="text-2xl font-black tracking-wider uppercase mb-2 text-white">
            Access Denied
          </h2>
          <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
            The account <span className="text-red-300 font-mono font-semibold">{user.email}</span> does not have Administrator privileges for Stage & Steel CMS.
          </p>

          <div className="p-4 bg-neutral-900/80 rounded-xl border border-neutral-800 text-xs text-neutral-400 font-mono text-left mb-6">
            <p className="text-neutral-300 font-semibold mb-1">Required Master Email:</p>
            <p className="text-emerald-400">jaynirala82@gmail.com</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => logout()}
              className="flex-1 py-3 px-4 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Switch Account
            </button>
            <Link
              href="/"
              className="flex-1 py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Access Granted!
  return <>{children}</>;
}
