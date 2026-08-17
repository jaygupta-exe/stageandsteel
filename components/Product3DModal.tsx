"use client";

import React, { useState, useEffect } from "react";
import { X, RotateCcw, Play, Pause, ShieldCheck, Award, Sparkles, Check, ArrowRight } from "lucide-react";
import ThreeDSupplementCanvas from "./ThreeDSupplementCanvas";

export interface Product3DData {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  price: string;
  servings: string;
  netWeight: string;
  tubType: "whey" | "creatine";
  views: { angle: number; label: string; image: string }[];
  accentColor: string;
  batchCode: string;
  flavors: { name: string; color: string; inStock: boolean }[];
  specs: { label: string; value: string; unit?: string }[];
  description: string;
  nutritionFacts: { name: string; amount: string; dailyValue?: string }[];
}

interface Product3DModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product3DData | null;
}

export default function Product3DModal({
  isOpen,
  onClose,
  product,
}: Product3DModalProps) {
  const [selectedFlavor, setSelectedFlavor] = useState<string>("");
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [currentAngle, setCurrentAngle] = useState<number>(0);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d0d0c]/90 backdrop-blur-2xl p-3 sm:p-6 lg:p-10 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-[1580px] h-[92vh] max-h-[960px] bg-[#141413] border border-[#596238]/40 shadow-[0_25px_80px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden">
        
        {/* Top Tactical Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F4F4F1]/10 bg-[#111110] shrink-0">
          
          {/* Left: Product Code & Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#A8B778] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#596238] animate-pulse" />
              <span>3D FORMULA INSPECTOR // {product.batchCode}</span>
            </div>
            <span className="hidden sm:inline-block px-2 py-0.5 bg-[#596238]/20 border border-[#596238]/40 text-[9px] font-mono text-[#A8B778]">
              HPLC TESTED: 100% PASS
            </span>
          </div>

          {/* Right: Controls & Close */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setAutoRotate((prev) => !prev)}
              aria-label={autoRotate ? "Pause rotation" : "Auto rotate"}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#181817] hover:bg-[#596238]/20 border border-[#F4F4F1]/10 hover:border-[#A8B778] text-[10px] font-mono tracking-widest text-[#C4C3BE] uppercase transition-colors cursor-pointer"
            >
              {autoRotate ? (
                <>
                  <Pause className="w-3 h-3 text-[#A8B778]" />
                  <span>PAUSE SPIN</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 text-[#A8B778]" />
                  <span>AUTO SPIN</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="p-1.5 bg-[#181817] hover:bg-[#596238] border border-[#F4F4F1]/20 text-[#F4F4F1] hover:text-[#111110] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Split Layout: 3D Canvas (Left/Center 7 cols) & Lab Telemetry Panel (Right 5 cols) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto lg:overflow-hidden">
          
          {/* LEFT: Real-time 3D WebGL Studio */}
          <div className="lg:col-span-7 relative h-[420px] sm:h-[480px] lg:h-full bg-gradient-to-b from-[#181817] via-[#121211] to-[#0d0d0c] border-b lg:border-b-0 lg:border-r border-[#F4F4F1]/10 overflow-hidden flex flex-col">
            
            {/* Compass / Angle Indicator HUD */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-[#141413]/80 border border-[#596238]/30 px-3 py-1 text-[10px] font-mono text-[#A8B778]">
              <span>ANGLE: {currentAngle}°</span>
              <span className="text-[#777773]">
                {currentAngle > 315 || currentAngle < 45
                  ? "[FRONT LOGO]"
                  : currentAngle >= 135 && currentAngle <= 225
                  ? "[BACK FACTS]"
                  : "[SIDE PANEL]"}
              </span>
            </div>

            {/* 3D Canvas */}
            <ThreeDSupplementCanvas
              views={product.views}
              accentColor={product.accentColor}
              autoRotate={autoRotate}
              onAngleChange={setCurrentAngle}
            />

            {/* Bottom 3D Specs Watermark */}
            <div className="absolute bottom-4 right-4 z-20 hidden sm:flex items-center gap-3 text-[9px] font-mono text-[#777773] uppercase pointer-events-none">
              <span>PHYSICALLY BASED RENDERING</span>
              <span>•</span>
              <span>100% ACCURATE PACKAGING REPLICA</span>
            </div>
          </div>

          {/* RIGHT: Product Specs & Ordering Telemetry */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 bg-[#141413] overflow-y-auto">
            
            <div>
              {/* Category & Badge */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-[#A8B778] tracking-widest uppercase">
                  {product.category}
                </span>
                <span className="text-[10px] font-mono text-[#777773] tracking-widest uppercase">
                  {product.netWeight} // {product.servings}
                </span>
              </div>

              {/* Title */}
              <h2 className="font-display text-3xl sm:text-4xl font-black uppercase text-[#F4F4F1] tracking-tight mb-1">
                {product.name}
              </h2>
              <p className="text-xs font-mono text-[#596238] uppercase font-bold tracking-wider mb-4">
                {product.subtitle}
              </p>

              {/* Quick Specs Strip */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-[#181817] border border-[#596238]/30 mb-5">
                {product.specs.map((s, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-[9px] font-mono text-[#777773] uppercase tracking-wider">
                      {s.label}
                    </span>
                    <span className="text-sm sm:text-base font-display font-extrabold text-[#F4F4F1]">
                      {s.value} <span className="text-[10px] font-mono text-[#A8B778]">{s.unit}</span>
                    </span>
                  </div>
                ))}
              </div>

              {/* Tabs: Specs | Nutrition Facts | Science */}
              <div className="flex border-b border-[#F4F4F1]/10 mb-4">
                {(["SPECS", "NUTRITION", "SCIENCE"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-xs font-mono font-bold tracking-widest uppercase transition-all duration-150 cursor-pointer ${
                      activeTab === tab
                        ? "text-[#A8B778] border-b-2 border-[#A8B778] bg-[#181817]/40"
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
                  <p className="text-xs text-[#C4C3BE] leading-relaxed font-body">
                    {product.description}
                  </p>

                  {/* Flavor Switcher */}
                  {product.flavors.length > 0 && (
                    <div>
                      <span className="text-[10px] font-mono text-[#777773] uppercase tracking-widest block mb-2">
                        SELECT FLAVOR: <span className="text-[#F4F4F1] font-bold">{selectedFlavor}</span>
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {product.flavors.map((f) => (
                          <button
                            key={f.name}
                            type="button"
                            onClick={() => setSelectedFlavor(f.name)}
                            className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider border transition-all duration-150 flex items-center gap-2 cursor-pointer ${
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
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 animate-in fade-in duration-200">
                  <div className="text-[10px] font-mono text-[#A8B778] tracking-wider mb-2 flex justify-between border-b border-[#F4F4F1]/10 pb-1">
                    <span>COMPOUND / AMINO</span>
                    <span>AMOUNT PER SERVING</span>
                  </div>
                  {product.nutritionFacts.map((n, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-[#F4F4F1]/5">
                      <span className="text-[#C4C3BE] font-body">{n.name}</span>
                      <span className="font-mono font-bold text-[#F4F4F1]">{n.amount}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "SCIENCE" && (
                <div className="space-y-3 text-xs text-[#C4C3BE] leading-relaxed animate-in fade-in duration-200">
                  <div className="flex items-start gap-2.5 p-2.5 bg-[#181817] border border-[#596238]/20">
                    <ShieldCheck className="w-4 h-4 text-[#A8B778] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#F4F4F1] block mb-0.5">HPLC 3rd-Party Verified</span>
                      <span className="text-[11px] text-[#777773]">Every batch undergoes rigorous high-performance liquid chromatography testing for maximum compound bio-availability.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 bg-[#181817] border border-[#596238]/20">
                    <Award className="w-4 h-4 text-[#A8B778] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#F4F4F1] block mb-0.5">100% Transparent Formula</span>
                      <span className="text-[11px] text-[#777773]">Zero proprietary blends, zero amino-spiking, zero banned substances. Certified WADA compliant.</span>
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
                <span className="font-display text-3xl font-extrabold text-[#F4F4F1]">
                  {product.price}
                </span>
              </div>

              <div className="w-full sm:w-auto relative">
                <button
                  type="button"
                  onClick={() => alert(`Added ${product.name} (${selectedFlavor}) to shaker!`)}
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
