"use client";

import React, { useState, useEffect } from "react";
import { X, ShieldCheck, Truck, RotateCcw, FileText, Lock, ChevronRight, Check } from "lucide-react";

export type PolicyType = "refund" | "shipping" | "privacy" | "terms";

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPolicy?: PolicyType;
}

export default function PolicyModal({
  isOpen,
  onClose,
  initialPolicy = "refund",
}: PolicyModalProps) {
  const [activeTab, setActiveTab] = useState<PolicyType>(initialPolicy);

  useEffect(() => {
    if (initialPolicy) {
      setActiveTab(initialPolicy);
    }
  }, [initialPolicy]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0A0A09]/90 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Window */}
      <div className="relative w-full max-w-4xl bg-[#141413] border border-white/15 text-[#F4F4F1] shadow-2xl rounded-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[90vh]">
        
        {/* Top Metallic Highlight Edge */}
        <div className="h-1 bg-gradient-to-r from-[#596238] via-[#8FA355] to-[#596238]" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4 flex items-center justify-between border-b border-white/10 bg-[#171716]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#596238]/20 border border-[#596238]/40 flex items-center justify-center text-[#9DB25E]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#9DB25E] uppercase block">
                STAGE & STEEL LABS // LEGAL & COMPLIANCE
              </span>
              <h2 className="text-lg sm:text-xl font-display font-black uppercase text-white tracking-wide">
                CUSTOMER COVENANT &amp; POLICIES
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#A3A29E] hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 bg-[#0F0F0E] border-b border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab("refund")}
            className={`p-3.5 sm:p-4 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer border-r border-white/5 ${
              activeTab === "refund"
                ? "bg-[#1C1C1A] text-[#9DB25E] border-b-2 border-b-[#9DB25E]"
                : "text-[#8E8D88] hover:text-[#F4F4F1] hover:bg-white/5"
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>REFUND & RETURN</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("shipping")}
            className={`p-3.5 sm:p-4 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer border-r border-white/5 ${
              activeTab === "shipping"
                ? "bg-[#1C1C1A] text-[#9DB25E] border-b-2 border-b-[#9DB25E]"
                : "text-[#8E8D88] hover:text-[#F4F4F1] hover:bg-white/5"
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>SHIPPING & DELIVERY</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("privacy")}
            className={`p-3.5 sm:p-4 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer border-r border-white/5 ${
              activeTab === "privacy"
                ? "bg-[#1C1C1A] text-[#9DB25E] border-b-2 border-b-[#9DB25E]"
                : "text-[#8E8D88] hover:text-[#F4F4F1] hover:bg-white/5"
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>PRIVACY POLICY</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("terms")}
            className={`p-3.5 sm:p-4 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "terms"
                ? "bg-[#1C1C1A] text-[#9DB25E] border-b-2 border-b-[#9DB25E]"
                : "text-[#8E8D88] hover:text-[#F4F4F1] hover:bg-white/5"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>TERMS OF USE</span>
          </button>
        </div>

        {/* Policy Content Scrollable Area */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6 text-xs sm:text-sm font-sans text-[#C4C3BE] leading-relaxed">
          
          {/* ========================================================================= */}
          {/* 1. REFUND & CANCELLATION POLICY */}
          {/* ========================================================================= */}
          {activeTab === "refund" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-4 bg-[#1B1B19] border border-[#596238]/40 rounded-xl">
                <h3 className="font-display text-lg sm:text-xl font-black uppercase text-[#F5F5F2] mb-1">
                  7-DAY REPLACEMENT &amp; REFUND POLICY
                </h3>
                <p className="text-xs font-mono text-[#9DB25E]">
                  LAST REVISED: AUGUST 2026 // S AND S NUTRITION PARTNERS
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  1. ELIGIBILITY FOR RETURN &amp; REPLACEMENT
                </h4>
                <p>
                  At <strong>Stage &amp; Steel</strong>, we uphold uncompromising quality standards. Given that our products are consumable dietary nutraceuticals (Whey Protein, Yeast Protein, Creatine Monohydrate, Essential Amino Acids), we offer a <strong>7-Day Free Replacement</strong> under the following conditions:
                </p>
                <ul className="space-y-2 list-disc pl-5 text-[#A3A29E]">
                  <li>The product received is physically damaged in transit or defective.</li>
                  <li>The inner safety induction seal is broken or tampered upon initial delivery.</li>
                  <li>The product received differs from the product/flavor ordered (e.g., incorrect flavor or batch dispatched).</li>
                  <li>The package is expired or past its best-before date upon arrival.</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  2. NON-RETURNABLE CONDITIONS
                </h4>
                <ul className="space-y-2 list-disc pl-5 text-[#A3A29E]">
                  <li>Products with safety seals opened or consumed after intact receipt (unless quality defect is verified by lab batch review).</li>
                  <li>Damages caused by improper storage after delivery (e.g., exposure to moisture, extreme heat, or direct sunlight).</li>
                  <li>Return requests initiated after 7 calendar days from the date of confirmed delivery.</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  3. HOW TO INITIATE A REPLACEMENT OR REFUND
                </h4>
                <p>
                  To request a return or replacement, contact our founders desk via WhatsApp or email with:
                </p>
                <div className="p-3 bg-[#0E0E0D] border border-white/10 rounded-lg space-y-1 font-mono text-xs text-[#9DB25E]">
                  <p>• Your Order ID (e.g. SS_1787236951013_986)</p>
                  <p>• Clear photos/unboxing video showing the outer label, seal, and defect</p>
                  <p>• WhatsApp Desk: +91 99991 93383 / +91 97791 59169</p>
                  <p>• Official Email: Stageandsteel26@gmail.com</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  4. REFUND TIMELINE &amp; METHOD
                </h4>
                <p>
                  Once approved, your replacement package will be dispatched within 24 hours. If a monetary refund is requested, the full amount will be credited back to your original payment method (UPI, Netbanking, Debit/Credit Card) via Cashfree PG within <strong>5 to 7 business days</strong>.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  5. ORDER CANCELLATION
                </h4>
                <p>
                  Orders can be cancelled free of charge prior to Delhivery manifest dispatch. Once the shipment has been picked up from our New Delhi warehouse and an active AWB is issued, cancellations cannot be processed; customers may instead refuse delivery or request a replacement upon arrival.
                </p>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. SHIPPING & DELIVERY POLICY */}
          {/* ========================================================================= */}
          {activeTab === "shipping" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-4 bg-[#1B1B19] border border-[#596238]/40 rounded-xl">
                <h3 className="font-display text-lg sm:text-xl font-black uppercase text-[#F5F5F2] mb-1">
                  EXPRESS SHIPPING &amp; DELIVERY POLICY
                </h3>
                <p className="text-xs font-mono text-[#9DB25E]">
                  LOGISTICS OPERATED BY DELHIVERY EXPRESS B2C
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  1. DISPATCH TIMELINES
                </h4>
                <p>
                  All confirmed orders placed on <strong>stageandsteel.in</strong> are packed in secure tamper-evident packaging and dispatched from our primary warehouse hub in <strong>Paschim Vihar, New Delhi - 110063</strong> within <strong>24 to 48 hours</strong> of payment confirmation.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  2. ESTIMATED DELIVERY TIMES PAN-INDIA
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                  <div className="p-3 bg-[#0D0D0C] border border-white/10 rounded-lg">
                    <span className="text-[#9DB25E] font-bold block mb-1">DELHI NCR</span>
                    <span className="text-white text-sm font-display font-bold">1–2 BUSINESS DAYS</span>
                  </div>
                  <div className="p-3 bg-[#0D0D0C] border border-white/10 rounded-lg">
                    <span className="text-[#9DB25E] font-bold block mb-1">METROS &amp; TIER 1</span>
                    <span className="text-white text-sm font-display font-bold">2–4 BUSINESS DAYS</span>
                  </div>
                  <div className="p-3 bg-[#0D0D0C] border border-white/10 rounded-lg">
                    <span className="text-[#9DB25E] font-bold block mb-1">REST OF INDIA</span>
                    <span className="text-white text-sm font-display font-bold">3–6 BUSINESS DAYS</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  3. SHIPPING CHARGES
                </h4>
                <p>
                  We provide <strong>FREE EXPRESS SHIPPING</strong> on all prepaid orders nationwide across all product lines (Stage Whey, Yeast Protein, Creatine, and EAA).
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  4. REAL-TIME SHIPMENT TRACKING
                </h4>
                <p>
                  As soon as your shipment is manifested, an official <strong>Delhivery Waybill / AWB Number</strong> is generated. You can track your package in real-time on our website by clicking <strong className="text-white">TRACK ORDER</strong> in the navigation or directly at <code className="text-[#9DB25E]">delhivery.com/track/package/&lt;AWB&gt;</code>.
                </p>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. PRIVACY POLICY */}
          {/* ========================================================================= */}
          {activeTab === "privacy" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-4 bg-[#1B1B19] border border-[#596238]/40 rounded-xl">
                <h3 className="font-display text-lg sm:text-xl font-black uppercase text-[#F5F5F2] mb-1">
                  PRIVACY POLICY &amp; DATA SECURITY
                </h3>
                <p className="text-xs font-mono text-[#9DB25E]">
                  COMPLIANT WITH DIGITAL PERSONAL DATA PROTECTION GUIDELINES
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  1. INFORMATION WE COLLECT
                </h4>
                <p>
                  When you visit or place an order on <strong>stageandsteel.in</strong>, we collect basic contact information (Name, Email Address, Contact Number, Shipping Address, Pincode) strictly necessary to process payments, generate shipping waybills, and deliver your athletic supplements.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  2. ZERO STORAGE OF FINANCIAL DATA
                </h4>
                <p>
                  All transactions are encrypted with 256-bit SSL technology. <strong>Stage &amp; Steel does NOT store, capture, or access your credit card numbers, CVVs, UPI PINs, or netbanking passwords.</strong> All payments are processed directly through <strong>Cashfree Payments India Pvt. Ltd.</strong>, a PCI-DSS certified Level 1 payment gateway regulated by the Reserve Bank of India.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  3. THIRD-PARTY LOGISTICS SHARING
                </h4>
                <p>
                  We share your delivery address and phone number exclusively with our verified logistics provider, <strong>Delhivery B2C Surface Express</strong>, solely for the purpose of doorstep transit, pincode routing, and delivery status SMS updates.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  4. NO SPAM &amp; NO THIRD-PARTY DATA SELLING
                </h4>
                <p>
                  We strictly respect athlete privacy. We will NEVER sell, lease, or distribute your personal contact information to any third-party marketing brokers.
                </p>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. TERMS & CONDITIONS */}
          {/* ========================================================================= */}
          {activeTab === "terms" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-4 bg-[#1B1B19] border border-[#596238]/40 rounded-xl">
                <h3 className="font-display text-lg sm:text-xl font-black uppercase text-[#F5F5F2] mb-1">
                  TERMS OF SERVICE &amp; CONDITIONS OF USE
                </h3>
                <p className="text-xs font-mono text-[#9DB25E]">
                  STAGE &amp; STEEL // S AND S NUTRITION PARTNERS
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  1. GENERAL AGREEMENT
                </h4>
                <p>
                  By accessing, browsing, or purchasing products from <strong>stageandsteel.in</strong>, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use this site.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  2. NUTRACEUTICAL &amp; DIETARY SUPPLEMENT USAGE
                </h4>
                <p>
                  Stage &amp; Steel products are formulated for healthy adult athletes and fitness enthusiasts. Our products are <strong>Nutraceuticals / Dietary Supplements</strong> and are not intended to diagnose, treat, cure, or prevent any medical condition or disease. Consult your certified healthcare physician prior to beginning any intensive supplementation program if you have pre-existing health conditions.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  3. PRICING &amp; PRODUCT AVAILABILITY
                </h4>
                <p>
                  All prices listed on stageandsteel.in are in Indian National Rupees (INR) and are inclusive of all applicable taxes (GST). We reserve the right to revise prices, product specifications, or promotional batches without prior notice.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  4. GOVERNING LAW &amp; JURISDICTION
                </h4>
                <p>
                  These terms and conditions shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes arising out of or in connection with this agreement shall be subject to the exclusive jurisdiction of the competent courts in <strong>New Delhi, India</strong>.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-[#171716] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#8E8D88]">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span>FSSAI LIC: 10724997000182 // NEW DELHI, INDIA</span>
            <button
              type="button"
              onClick={() => {
                onClose();
                window.dispatchEvent(new CustomEvent("open-lab-reports", { detail: "fssai-license" }));
              }}
              className="text-[10px] text-[#9DB25E] hover:text-[#B8D16D] font-bold underline uppercase cursor-pointer"
            >
              [VIEW CERTIFICATE]
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#596238] hover:bg-[#48502B] text-white rounded-lg font-editorial font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            I UNDERSTAND &amp; ACCEPT
          </button>
        </div>

      </div>
    </div>
  );
}
