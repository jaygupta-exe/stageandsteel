"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles, Copy, Check, Zap, Tag, ArrowRight, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { soundFX } from "@/lib/sound";

export default function LaunchCouponModal() {
  const { applyCoupon, appliedCoupon } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    // Check if user already saw or dismissed the popup in this session
    const hasSeen = sessionStorage.getItem("stage_steel_launch_modal_seen");
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1200); // Trigger after 1.2s on first site visit

      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-launch-promo", handleOpen);
    return () => window.removeEventListener("open-launch-promo", handleOpen);
  }, []);

  const handleClose = () => {
    soundFX.playClick();
    setIsOpen(false);
    sessionStorage.setItem("stage_steel_launch_modal_seen", "true");
  };

  const handleCopy = () => {
    soundFX.playClick();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("LAUNCH10");
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleApplyAndShop = () => {
    soundFX.playAddToCart();
    applyCoupon("LAUNCH10");
    setApplied(true);
    setTimeout(() => {
      handleClose();
      const productSection = document.getElementById("products");
      if (productSection) {
        productSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 600);
  };

  if (!isOpen) {
    return (
      <aside
        aria-label="Special Discount Promotion"
        className="fixed bottom-20 left-4 sm:left-6 z-40 animate-in fade-in slide-in-from-bottom-3 duration-300"
      >
        <button
          type="button"
          onClick={() => {
            soundFX.playClick();
            setIsOpen(true);
          }}
          className="group relative flex items-center gap-2.5 px-3.5 py-2 bg-[#141413]/95 backdrop-blur-md border-2 border-[#8FA355] text-[#F4F4F1] rounded-full shadow-[0_0_20px_rgba(143,163,85,0.5)] hover:shadow-[0_0_35px_rgba(143,163,85,0.85)] transition-all duration-300 cursor-pointer hover:scale-105 animate-pulse"
        >
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9DB25E] opacity-80" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#8FA355]" />
          </span>
          <Zap className="w-3.5 h-3.5 text-[#9DB25E] fill-current" />
          <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-[#9DB25E] uppercase flex items-center gap-1.5">
            <span>FLASH CODE:</span>
            <span className="text-white bg-[#596238] px-1.5 py-0.2 rounded text-[10px]">LAUNCH10</span>
            <span className="hidden sm:inline text-[#D4D3CD]">10% OFF</span>
          </span>
        </button>
      </aside>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-300 select-none">
      
      {/* Background Animated Flash Rays & Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(157,178,94,0.15)_0%,rgba(0,0,0,0.85)_70%)] pointer-events-none" />

      {/* Main Flash Modal Card */}
      <div className="relative w-full max-w-[540px] bg-[#141413] border-2 border-[#8FA355] text-[#F4F4F1] rounded-2xl shadow-[0_0_50px_rgba(143,163,85,0.35)] overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Animated Neon Laser Flash Bar at Top */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-[#9DB25E] to-transparent animate-pulse" />
        
        {/* Corner Tactical Brackets */}
        <span className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#9DB25E] pointer-events-none" />
        <span className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#9DB25E] pointer-events-none" />
        <span className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#9DB25E] pointer-events-none" />
        <span className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#9DB25E] pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close discount popup"
          className="absolute top-4 right-4 z-20 p-2 bg-[#222220] hover:bg-[#596238] text-[#F4F4F1] border border-white/10 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Inner Content */}
        <div className="p-6 sm:p-8 flex flex-col items-center text-center relative z-10">
          
          {/* Pulsing Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#596238]/30 border border-[#8FA355] text-[#9DB25E] text-[11px] font-mono font-bold tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(157,178,94,0.3)]">
            <Sparkles className="w-3.5 h-3.5 text-[#9DB25E] animate-spin" style={{ animationDuration: "6s" }} />
            <span>OFFICIAL LAUNCH SPECIAL</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#9DB25E] animate-ping" />
          </div>

          {/* Bold Explosive Title */}
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-[#F5F5F2] tracking-tight leading-none mb-2">
            UNLOCK <span className="text-[#9DB25E] underline decoration-[#596238] decoration-4">10% OFF</span>
          </h2>
          
          <p className="text-xs sm:text-sm font-mono text-[#A8A7A3] uppercase tracking-wider mb-6 max-w-sm">
            STAGE PROTOCOL ACTIVATION // CLAIM 10% DISCOUNT ON ALL PURE WHEY, CREATINE &amp; EAA AMINOS.
          </p>

          {/* Flash Promo Box with Coupon Code */}
          <div className="w-full bg-[#0D0D0C] border-2 border-dashed border-[#8FA355]/70 rounded-xl p-4 sm:p-5 mb-6 relative group">
            <div className="text-[10px] font-mono text-[#8E8D88] uppercase tracking-widest mb-1.5">
              YOUR EXCLUSIVE LAUNCH CODE:
            </div>

            <div className="flex items-center justify-between gap-3 bg-[#1A1A18] border border-white/10 rounded-lg p-2.5 sm:p-3">
              <div className="flex items-center gap-2 pl-2">
                <Tag className="w-4 h-4 text-[#9DB25E]" />
                <span className="font-display text-2xl sm:text-3xl font-black tracking-widest text-[#F5F5F2]">
                  LAUNCH10
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#596238] hover:bg-[#48502B] text-[#F4F4F1] font-mono text-xs font-bold tracking-wider uppercase rounded-md transition-all cursor-pointer border border-[#7C8B4C]/40 shadow-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#9DB25E]" />
                    <span className="text-[#9DB25E]">COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>COPY</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-2.5 flex items-center justify-center gap-4 text-[10px] font-mono text-[#777773] uppercase">
              <span>NO MINIMUM ORDER</span>
              <span>•</span>
              <span>INSTANT CHECKOUT DISCOUNT</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="w-full flex flex-col gap-2.5">
            <button
              type="button"
              onClick={handleApplyAndShop}
              className="w-full py-3.5 sm:py-4 bg-[#596238] hover:bg-[#48502B] text-[#F4F4F1] font-editorial text-xs sm:text-sm font-bold tracking-widest uppercase rounded-xl transition-all duration-200 cursor-pointer border border-[#8FA355] shadow-[0_4px_25px_rgba(89,98,56,0.5)] hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
            >
              {applied ? (
                <>
                  <Check className="w-4 h-4 text-[#9DB25E]" />
                  <span>COUPON APPLIED // REDIRECTING...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current text-[#9DB25E]" />
                  <span>CLAIM DISCOUNT &amp; SHOP PROTOCOLS</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="text-[11px] font-mono text-[#777773] hover:text-[#D4D3CD] uppercase tracking-wider py-1.5 transition-colors cursor-pointer"
            >
              NO THANKS, I PREFER PAYING FULL PRICE
            </button>
          </div>

          {/* Security & Verification Guarantee footer */}
          <div className="mt-4 pt-3 border-t border-white/5 w-full flex items-center justify-center gap-2 text-[10px] font-mono text-[#8E8D88] uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-[#9DB25E]" />
            <span>100% HPLC LAB VERIFIED • ZERO DOPING • FREE PAN-INDIA DISPATCH</span>
          </div>

        </div>

      </div>

    </div>
  );
}
