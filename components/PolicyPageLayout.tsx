"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

interface PolicyPageLayoutProps {
  title: string;
  badge: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export default function PolicyPageLayout({
  title,
  badge,
  lastUpdated,
  children,
}: PolicyPageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0E0E0D] text-[#F4F4F1] py-16 sm:py-24 px-4 sm:px-8 lg:px-16 selection:bg-[#596238] selection:text-[#F4F4F1]">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation Back */}
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1C1C1A] hover:bg-[#252523] border border-white/10 text-xs font-mono font-bold text-[#9DB25E] hover:text-white rounded-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO STAGE &amp; STEEL STORE</span>
          </Link>
        </div>

        {/* Policy Header Card */}
        <div className="p-6 sm:p-10 bg-[#161615] border border-white/10 rounded-2xl mb-10 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#596238] to-transparent" />
          
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#596238]/20 border border-[#596238]/40 rounded text-[10px] font-mono font-bold tracking-widest text-[#9DB25E] uppercase mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            {badge}
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-black uppercase text-white tracking-tight leading-[0.95] mb-3">
            {title}
          </h1>

          <p className="text-xs font-mono text-[#8E8D88] uppercase tracking-wider">
            LAST UPDATED: {lastUpdated} // S AND S NUTRITION PARTNERS (STAGE &amp; STEEL)
          </p>
        </div>

        {/* Main Content Body */}
        <div className="p-6 sm:p-10 bg-[#141413] border border-white/10 rounded-2xl shadow-xl space-y-8 text-sm font-sans text-[#C4C3BE] leading-relaxed">
          {children}
        </div>

        {/* Footer Contact Reminder */}
        <div className="mt-10 p-6 bg-[#161615] border border-white/10 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#8E8D88]">
          <div>
            <span className="text-white font-bold block mb-0.5">HAVE QUESTIONS REGARDING THIS POLICY?</span>
            <span>Reach our founders desk at Stageandsteel26@gmail.com / +91 99991 93383</span>
          </div>
          <Link
            href="/#contact"
            className="px-5 py-2.5 bg-[#596238] hover:bg-[#48502B] text-white font-editorial font-bold uppercase tracking-wider rounded-lg transition-all"
          >
            CONTACT DESK
          </Link>
        </div>

      </div>
    </div>
  );
}
