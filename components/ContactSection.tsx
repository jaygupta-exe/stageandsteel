"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Check,
  Copy,
  Clock,
  Send,
  Sparkles,
} from "lucide-react";
import { soundFX } from "@/lib/sound";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

import PolicyModal, { PolicyType } from "./PolicyModal";

export default function ContactSection() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [activePolicy, setActivePolicy] = useState<PolicyType>("refund");

  const openPolicy = (policy: PolicyType) => {
    setActivePolicy(policy);
    setIsPolicyOpen(true);
  };

  const handleCopy = (text: string, type: "email" | "divesh" | "ashish") => {
    navigator.clipboard.writeText(text);
    if (type === "email") {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPhone(type);
      setTimeout(() => setCopiedPhone(null), 2000);
    }
  };

  const founders = [
    {
      name: "Ashish Yadav",
      role: "Co-Founder // Holistic Health & 5 AM Discipline",
      phone: "+91 99991 93383",
      cleanPhone: "919999193383",
      type: "ashish" as const,
      avatar: "/founders/ashish/ashish-1.jpg",
      note: "Mindset, Lifestyle & Customer Support Desk",
    },
    {
      name: "Divesh Mehan",
      role: "Co-Founder // Champion Bodybuilder & Formulation Architect",
      phone: "+91 97791 59169",
      cleanPhone: "919779159169",
      type: "divesh" as const,
      avatar: "/founders/divesh/divesh-1.jpg",
      note: "Product Formulations & Direct Guidance",
    },
  ];

  return (
    <footer id="contact" className="relative w-full bg-[#0B0B0A] text-[#F4F4F1] border-t border-white/10 pt-20 sm:pt-28 pb-12 overflow-hidden">
      {/* Background Ambient Glow & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(89,98,56,0.15)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-16 relative z-10">
        
        {/* Top Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-12 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-2.5 h-2.5 bg-[#596238] flex items-center justify-center">
                <span className="w-1 h-1 bg-[#F4F4F1]" />
              </span>
              <p className="font-mono text-xs sm:text-sm font-bold text-[#9DB25E] tracking-widest uppercase">
                DIRECT CHANNELS // STAGE &amp; STEEL SUPPORT DESK
              </p>
            </div>

            <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase text-[#F5F5F2] tracking-tight leading-[0.92]">
              CONTACT US <br />
              <span className="text-[#9DB25E] relative inline-block">
                DIRECT ACCESS TO FOUNDERS
                <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-[#596238]" />
              </span>
            </h2>
          </div>

          <div className="flex flex-col gap-3 max-w-md">
            <p className="text-xs sm:text-sm font-sans text-[#C4C3BE] leading-relaxed">
              Have questions about formulations, your order dispatch, wholesale inquiries, or personalized product stack guidance? Reach out directly to our founders.
            </p>
            <div className="flex items-center gap-4 text-[10px] font-mono text-[#8E8D88] uppercase tracking-wider">
              <span className="flex items-center gap-1.5 font-bold text-[#9DB25E]">
                <Clock className="w-3.5 h-3.5" /> 24/7 CUSTOMER DESK
              </span>
              <span>•</span>
              <span>DIRECT WHATSAPP &amp; CALL</span>
            </div>
          </div>
        </div>

        {/* 1. Direct Founders Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 pt-12">
          {founders.map((f) => (
            <div
              key={f.name}
              className="relative p-6 sm:p-8 bg-[#151514] border border-white/10 rounded-2xl shadow-2xl flex flex-col justify-between group hover:border-[#596238]/50 transition-all duration-300 overflow-hidden"
            >
              {/* Accent Edge */}
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#596238] to-transparent" />

              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#596238]/20 border border-[#596238]/40 rounded text-[10px] font-mono font-bold tracking-widest text-[#9DB25E] uppercase">
                    DIRECT CONTACT LINE
                  </span>
                  <span className="text-[10px] font-mono text-[#8E8D88] uppercase">FOUNDER DESK</span>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-black uppercase text-[#F5F5F2] mb-1">
                  {f.name}
                </h3>
                <p className="text-xs font-mono text-[#A8B778] uppercase mb-4 font-semibold">
                  {f.role}
                </p>

                <div className="p-4 bg-[#0D0D0C] border border-white/10 rounded-xl mb-6">
                  <span className="text-[9px] font-mono text-[#777773] uppercase tracking-widest block mb-1">
                    PRIMARY MOBILE / WHATSAPP:
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xl sm:text-2xl font-black tracking-wider text-[#F5F5F2]">
                      {f.phone}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(f.phone, f.type)}
                      className="flex items-center gap-1 text-[10px] font-mono text-[#9DB25E] hover:text-white px-2 py-1 bg-white/5 hover:bg-white/10 rounded border border-white/10 transition-colors cursor-pointer"
                      title="Copy Number"
                    >
                      {copiedPhone === f.type ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>COPIED</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>COPY</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href={`tel:${f.cleanPhone}`}
                  className="py-3 px-4 bg-[#222220] hover:bg-[#2C2C29] border border-white/10 hover:border-white/20 text-[#F5F5F2] rounded-xl text-xs font-editorial font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Phone className="w-3.5 h-3.5 text-[#9DB25E]" />
                  <span>CALL DIRECT</span>
                </a>

                <a
                  href={`https://wa.me/${f.cleanPhone}?text=Hi%20${encodeURIComponent(f.name)},%20I%20have%20an%20inquiry%20regarding%20Stage%20%26%20Steel.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 bg-[#596238] hover:bg-[#48502B] border border-[#7C8B4C]/40 text-[#F4F4F1] rounded-xl text-xs font-editorial font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_4px_15px_rgba(89,98,56,0.3)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WHATSAPP</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* 2. Official Channels Bar (Email, Instagram, HQ Address) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          
          {/* Email Channel Card */}
          <div className="p-6 bg-[#151514] border border-white/10 rounded-2xl flex flex-col justify-between group hover:border-[#596238]/40 transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#596238]/20 border border-[#596238]/40 flex items-center justify-center text-[#9DB25E] mb-4">
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-[#8E8D88] uppercase tracking-widest block mb-1">
                OFFICIAL INBOX
              </span>
              <h4 className="font-display text-lg font-black text-[#F5F5F2] mb-1 break-all">
                Stageandsteel26@gmail.com
              </h4>
              <p className="text-xs text-[#8E8D88] font-sans mb-6">
                For order tracking, wholesale distribution &amp; sponsorship inquiries.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <a
                href="mailto:Stageandsteel26@gmail.com"
                className="flex-1 py-2.5 px-3 bg-[#596238] hover:bg-[#48502B] text-[#F4F4F1] rounded-lg text-xs font-editorial font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>SEND EMAIL</span>
              </a>
              <button
                type="button"
                onClick={() => handleCopy("Stageandsteel26@gmail.com", "email")}
                className="p-2.5 bg-[#222220] hover:bg-[#2C2C29] border border-white/10 text-white rounded-lg transition-colors cursor-pointer"
                title="Copy Email Address"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Instagram Channel Card */}
          <div className="p-6 bg-[#151514] border border-white/10 rounded-2xl flex flex-col justify-between group hover:border-[#E1306C]/40 transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#E1306C]/15 border border-[#E1306C]/30 flex items-center justify-center text-[#E1306C] mb-4">
                <InstagramIcon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-[#8E8D88] uppercase tracking-widest block mb-1">
                OFFICIAL INSTAGRAM
              </span>
              <h4 className="font-display text-lg font-black text-[#F5F5F2] mb-1">
                @stageandsteel.in
              </h4>
              <p className="text-xs text-[#8E8D88] font-sans mb-6">
                Follow our athletes, daily training routines, lab updates &amp; exclusive giveaways.
              </p>
            </div>

            <a
              href="https://www.instagram.com/stageandsteel.in?igsi=Z2M3bzlseXliNm50"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white rounded-lg text-xs font-editorial font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>FOLLOW ON INSTAGRAM</span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </a>
          </div>

          {/* Headquarters / Stock Pickup Card */}
          <div className="p-6 bg-[#151514] border border-white/10 rounded-2xl flex flex-col justify-between group hover:border-[#596238]/40 transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#596238]/20 border border-[#596238]/40 flex items-center justify-center text-[#9DB25E] mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-[#8E8D88] uppercase tracking-widest block mb-1">
                HQ &amp; STOCK PICKUP
              </span>
              <h4 className="font-display text-base sm:text-lg font-black text-[#F5F5F2] mb-1">
                Paschim Vihar, New Delhi
              </h4>
              <p className="text-xs text-[#C4C3BE] font-mono leading-relaxed mb-6">
                D-74 Shubham Enclave, Paschim Vihar, New Delhi - 110063
              </p>
            </div>

            <div className="p-2.5 bg-[#0D0D0C] border border-white/10 rounded-lg flex items-center justify-between text-[10px] font-mono text-[#8E8D88]">
              <button
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  window.dispatchEvent(new CustomEvent("open-lab-reports", { detail: "fssai-license" }));
                }}
                className="flex items-center gap-1.5 text-[#9DB25E] hover:text-[#B8D16D] font-bold transition-colors cursor-pointer"
                title="View Official FSSAI Certificate"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> FSSAI REGISTERED (VIEW LIC)
              </button>
              <span>DELHIVERY DISPATCH HUB</span>
            </div>
          </div>

        </div>

        {/* 3. Bottom Minimal Luxury Footer Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col lg:flex-row items-center justify-between gap-6 text-xs font-mono text-[#777773]">
          
          <div className="flex flex-wrap items-center gap-2 text-center sm:text-left">
            <span className="font-display text-sm font-black text-[#F5F5F2] tracking-wide">
              STAGE &amp; STEEL LABS
            </span>
            <span>© {new Date().getFullYear()}</span>
            <span>•</span>
            <span>S AND S NUTRITION PARTNERS</span>
          </div>

          {/* Legal & Policy Modals Bar */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[11px]">
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                window.dispatchEvent(new CustomEvent("open-lab-reports", { detail: "fssai-license" }));
              }}
              className="text-[#9DB25E] hover:text-white transition-colors uppercase cursor-pointer font-bold flex items-center gap-1"
            >
              <ShieldCheck className="w-3 h-3" /> FSSAI CERTIFICATE
            </button>
            <button
              type="button"
              onClick={() => openPolicy("refund")}
              className="hover:text-[#9DB25E] transition-colors uppercase cursor-pointer"
            >
              REFUND POLICY
            </button>
            <button
              type="button"
              onClick={() => openPolicy("shipping")}
              className="hover:text-[#9DB25E] transition-colors uppercase cursor-pointer"
            >
              SHIPPING POLICY
            </button>
            <button
              type="button"
              onClick={() => openPolicy("privacy")}
              className="hover:text-[#9DB25E] transition-colors uppercase cursor-pointer"
            >
              PRIVACY POLICY
            </button>
            <button
              type="button"
              onClick={() => openPolicy("terms")}
              className="hover:text-[#9DB25E] transition-colors uppercase cursor-pointer"
            >
              TERMS &amp; CONDITIONS
            </button>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="hover:text-white transition-colors uppercase cursor-pointer font-bold text-[#9DB25E] pl-2 border-l border-white/10"
            >
              TOP ↑
            </button>
          </div>

        </div>

      </div>

      {/* Interactive Compliance Policy Modal */}
      <PolicyModal
        isOpen={isPolicyOpen}
        onClose={() => setIsPolicyOpen(false)}
        initialPolicy={activePolicy}
      />
    </footer>
  );
}
