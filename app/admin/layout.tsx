"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminGuard from "@/components/admin/AdminGuard";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  TicketPercent,
  Sliders,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Zap,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Live Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Coupons", href: "/admin/coupons", icon: TicketPercent },
  { label: "Site Content", href: "/admin/content", icon: Sliders },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If on login page, render without sidebar shell
  if (pathname === "/admin/login") {
    return <AdminGuard>{children}</AdminGuard>;
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#070907] text-white flex flex-col md:flex-row antialiased selection:bg-emerald-500 selection:text-black">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-[#0d120e] border-b border-neutral-800 sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm tracking-wider uppercase">STAGE & STEEL CMS</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <aside
          className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-[#0a0f0b] border-r border-emerald-950/40 flex flex-col justify-between transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <div>
            {/* Brand / Logo */}
            <div className="p-6 border-b border-neutral-800/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-700/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-black text-sm tracking-widest uppercase text-white font-sans">
                    STAGE & STEEL
                  </h2>
                  <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
                    Core Admin CMS
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="p-4 space-y-1">
              <p className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                Management Modules
              </p>
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all ${
                      isActive
                        ? "bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                        : "text-neutral-400 hover:text-white hover:bg-neutral-900/60"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-neutral-400"}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User info & Quick Actions bottom */}
          <div className="p-4 border-t border-neutral-800/80 space-y-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-xs font-mono text-neutral-300 hover:text-white transition-all"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-neutral-400" /> View Storefront
              </span>
              <span className="text-[10px] text-emerald-400">Live</span>
            </Link>

            <div className="p-3 rounded-xl bg-[#111712] border border-neutral-800/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase text-neutral-400">Logged in as</span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  MASTER
                </span>
              </div>
              <p className="text-xs font-mono text-neutral-200 truncate font-semibold">
                {user?.email}
              </p>
            </div>

            <button
              onClick={() => logout()}
              className="w-full py-2.5 px-3 rounded-xl bg-red-950/30 hover:bg-red-950/50 border border-red-900/40 text-red-300 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout CMS
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
