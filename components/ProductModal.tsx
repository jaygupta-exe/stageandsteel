"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, ShieldCheck, Award, Check, ArrowRight } from "lucide-react";

export interface ProductData {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  price: string;
  servings: string;
  netWeight: string;
  image: string;
  accentColor: string;
  batchCode: string;
  flavors: { name: string; color: string; inStock: boolean }[];
  specs: { label: string; value: string; unit?: string }[];
  description: string;
  nutritionFacts: { name: string; amount: string; dailyValue?: string }[];
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductData | null;
}

export default function ProductModal({
  isOpen,
  onClose,
  product,
}: ProductModalProps) {
  const [selectedFlavor, setSelectedFlavor] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"SPECS" | "NUTRITION" | "SCIENCE">("SPECS");

  useEffect(() => {
    if (product && product.flavors.length > 0) {
      setSelectedFlavor(product.flavors[0].name);
    }
  }, [product]);

  // Lock body scroll and handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d0d0c]/90 backdrop-blur-2xl p-4 sm:p-6 lg:p-10 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-[1280px] max-h-[92vh] bg-[#141413] border border-[#596238]/40 shadow-[0_25px_80px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden">
        
        {/* Top Tactical Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F4F4F1]/10 bg-[#111110] shrink-0">
          
          {/* Left: Product Code & Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#A8B778] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#596238] animate-pulse" />
              <span>FORMULA SPEC SHEET // {product.batchCode}</span>
            </div>
            <span className="hidden sm:inline-block px-2 py-0.5 bg-[#596238]/20 border border-[#596238]/40 text-[9px] font-mono text-[#A8B778]">
              HPLC 3RD-PARTY VERIFIED
            </span>
          </div>

          {/* Right: Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 bg-[#181817] hover:bg-[#596238] border border-[#F4F4F1]/20 text-[#F4F4F1] hover:text-[#111110] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Content Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
          
          {/* Left: High-Res Product Image Stage (5 cols) */}
          <div className="lg:col-span-5 relative min-h-[340px] sm:min-h-[420px] lg:min-h-full bg-gradient-to-b from-[#181817] via-[#131312] to-[#0f0f0e] border-b lg:border-b-0 lg:border-r border-[#F4F4F1]/10 flex flex-col items-center justify-center p-8 overflow-hidden">
            
            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-radial from-[#596238]/20 via-transparent to-transparent opacity-60 pointer-events-none" />

            <div className="relative w-64 sm:w-80 h-72 sm:h-96">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                unoptimized
                className="object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)]"
              />
            </div>

            {/* Bottom Spec Badge */}
            <div className="mt-4 flex items-center gap-3 text-[10px] font-mono text-[#777773] uppercase">
              <span>{product.netWeight}</span>
              <span>•</span>
              <span className="text-[#A8B778] font-bold">{product.servings}</span>
            </div>
          </div>

          {/* Right: Specs & Nutritional Matrix (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 lg:p-10 bg-[#141413]">
            
            <div>
              {/* Category & Weight */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-[#A8B778] tracking-widest uppercase">
                  {product.category}
                </span>
                <span className="text-[10px] font-mono text-[#777773] tracking-widest uppercase">
                  BATCH CODE: {product.batchCode}
                </span>
              </div>

              {/* Title */}
              <h2 className="font-display text-3xl sm:text-4xl font-black uppercase text-[#F4F4F1] tracking-tight mb-1">
                {product.name}
              </h2>
              <p className="text-xs font-mono text-[#596238] uppercase font-bold tracking-wider mb-5">
                {product.subtitle}
              </p>

              {/* Quick Specs Highlight Box */}
              <div className="grid grid-cols-3 gap-2.5 p-3.5 bg-[#181817] border border-[#596238]/30 mb-6">
                {product.specs.map((s, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-[9px] font-mono text-[#777773] uppercase tracking-wider">
                      {s.label}
                    </span>
                    <span className="text-base sm:text-lg font-display font-black text-[#F4F4F1]">
                      {s.value} <span className="text-[10px] font-mono text-[#A8B778]">{s.unit}</span>
                    </span>
                  </div>
                ))}
              </div>

              {/* Tabs: Specs | Nutrition Facts | Science */}
              <div className="flex border-b border-[#F4F4F1]/10 mb-5">
                {(["SPECS", "NUTRITION", "SCIENCE"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-xs font-mono font-bold tracking-widest uppercase transition-all duration-150 cursor-pointer ${
                      activeTab === tab
                        ? "text-[#A8B778] border-b-2 border-[#A8B778] bg-[#181817]/60"
                        : "text-[#777773] hover:text-[#C4C3BE]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === "SPECS" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <p className="text-xs sm:text-sm text-[#C4C3BE] leading-relaxed font-body">
                    {product.description}
                  </p>

                  {/* Flavor Switcher */}
                  {product.flavors.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[10px] font-mono text-[#777773] uppercase tracking-widest block mb-2">
                        AVAILABLE FLAVORS: <span className="text-[#F4F4F1] font-bold">{selectedFlavor}</span>
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {product.flavors.map((f) => (
                          <button
                            key={f.name}
                            type="button"
                            onClick={() => setSelectedFlavor(f.name)}
                            className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider border transition-all duration-150 flex items-center gap-2 cursor-pointer ${
                              selectedFlavor === f.name
                                ? "bg-[#596238]/30 border-[#A8B778] text-[#F4F4F1] font-bold"
                                : "bg-[#181817] border-[#F4F4F1]/10 text-[#777773] hover:border-[#596238]"
                            }`}
                          >
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: f.color }}
                            />
                            <span>{f.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "NUTRITION" && (
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2 animate-in fade-in duration-200">
                  <div className="text-[10px] font-mono text-[#A8B778] tracking-wider mb-2 flex justify-between border-b border-[#F4F4F1]/10 pb-1">
                    <span>COMPOUND / AMINO</span>
                    <span>AMOUNT PER SERVING</span>
                  </div>
                  {product.nutritionFacts.map((n, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b border-[#F4F4F1]/5">
                      <span className="text-[#C4C3BE] font-body">{n.name}</span>
                      <span className="font-mono font-bold text-[#F4F4F1]">{n.amount}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "SCIENCE" && (
                <div className="space-y-3 text-xs text-[#C4C3BE] leading-relaxed animate-in fade-in duration-200">
                  <div className="flex items-start gap-3 p-3 bg-[#181817] border border-[#596238]/20">
                    <ShieldCheck className="w-4 h-4 text-[#A8B778] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#F4F4F1] block mb-0.5">HPLC 3rd-Party Verified</span>
                      <span className="text-[11px] text-[#777773]">Every batch undergoes rigorous high-performance liquid chromatography testing for maximum compound purity and bio-availability.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-[#181817] border border-[#596238]/20">
                    <Award className="w-4 h-4 text-[#A8B778] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#F4F4F1] block mb-0.5">100% Transparent Formula</span>
                      <span className="text-[11px] text-[#777773]">Zero proprietary blends, zero amino-spiking, zero banned substances. Certified CGMP &amp; WADA compliant.</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions & Price */}
            <div className="pt-6 mt-6 border-t border-[#F4F4F1]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[9px] font-mono text-[#777773] tracking-widest uppercase block">
                  PRICE // TAX INCLUDED
                </span>
                <span className="font-display text-3xl sm:text-4xl font-black text-[#F4F4F1]">
                  {product.price}
                </span>
              </div>

              <div className="w-full sm:w-auto relative">
                <button
                  type="button"
                  onClick={() => alert(`Added ${product.name} (${selectedFlavor}) to protocol shaker!`)}
                  className="w-full sm:w-auto relative inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-[#A8B778] hover:bg-[#8E9A5E] text-[#151515] font-mono text-xs font-black tracking-widest uppercase transition-all duration-200 cursor-pointer group"
                >
                  <span className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-[#F4F4F1]" />
                  <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-[#F4F4F1]" />
                  <span>ADD TO PROTOCOL</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
