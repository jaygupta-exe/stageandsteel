"use client";

import React from "react";
import { Dumbbell, ShieldCheck, Sparkles, CheckCircle2, Zap } from "lucide-react";

interface FeatureStripProps {
  featureStripRef?: React.RefObject<HTMLDivElement | null>;
}

export default function FeatureStrip({ featureStripRef }: FeatureStripProps) {
  const tickerItems = [
    "🔥 USE CODE 'LAUNCH10' FOR 10% OFF AT CHECKOUT",
    "100% MICROFILTERED WHEY CONCENTRATE",
    "25G PROTEIN PER SCOOP",
    "85 SERVINGS MICRONIZED CREATINE",
    "6.45G ESSENTIAL AMINO ACIDS (EAA) + ELECTROLYTES",
    "ZERO PROPRIETARY BLENDS",
    "HPLC INDEPENDENT LAB CERTIFIED",
    "FREE EXPRESS DISPATCH PAN-INDIA",
    "ZERO AMINO SPIKING GUARANTEE",
  ];

  const features = [
    {
      icon: Dumbbell,
      badge: "16+",
      title: "YEARS OF TRAINING",
      description: "FIELD-TESTED RIGOR",
    },
    {
      icon: ShieldCheck,
      badge: "PRECISION",
      title: "FORMULATED",
      description: "PURPOSE-DRIVEN DOSING",
    },
    {
      icon: Sparkles,
      badge: "QUALITY",
      title: "INGREDIENTS",
      description: "100% TRANSPARENT LABELS",
    },
    {
      icon: CheckCircle2,
      badge: "ZERO",
      title: "COMPROMISES",
      description: "UNCOMPROMISED PURITY",
    },
  ];

  return (
    <div
      ref={featureStripRef}
      className="w-full border-t border-[#151515]/15 bg-[#A8A7A3]/95 relative z-20 shrink-0 opacity-0 overflow-hidden"
    >
      {/* 1. Continuous Infinite Marquee Telemetry Bar - Slowed down for effortless reading */}
      <div className="w-full bg-[#151515] text-[#F4F4F1] py-2 overflow-hidden flex items-center border-b border-[#151515]/20 select-none group">
        <div className="flex whitespace-nowrap animate-[marquee_55s_linear_infinite] group-hover:[animation-play-state:paused] will-change-transform">
          {[...tickerItems, ...tickerItems].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 mx-6 text-xs sm:text-sm font-mono tracking-widest uppercase">
              <span className="text-[#9DB25E]">⚡</span>
              <span className="font-semibold text-[#F4F4F1]">{item}</span>
              <span className="text-[#9DB25E]/70 font-bold">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Main 4-Feature Cards Console - Clean, Modern & Ultra-Readable Typography */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-16">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#151515]/15 py-4 sm:py-5">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`group relative flex items-center gap-3.5 sm:gap-4 p-2.5 sm:p-3.5 transition-all duration-200 hover:bg-[#151515]/5 ${
                  index % 2 === 0 ? "pr-2 sm:pr-4" : "pl-2 sm:pl-4 md:pl-6"
                } ${index >= 2 ? "md:pl-6" : ""}`}
              >
                {/* Minimal Icon Box */}
                <div className="shrink-0 w-10 h-10 border border-[#151515]/20 bg-[#151515]/5 flex items-center justify-center text-[#151515] transition-all duration-200 group-hover:border-[#596238] group-hover:bg-[#596238] group-hover:text-[#F4F4F1] rounded-lg">
                  <Icon className="w-5 h-5 stroke-[1.8] transition-transform duration-200 group-hover:scale-110" />
                </div>

                {/* Text Hierarchy - Clean Sans-Serif Font */}
                <div className="flex flex-col justify-center min-w-0">
                  <span className="font-sans text-base sm:text-lg font-bold tracking-tight text-[#151515] leading-tight uppercase">
                    {item.badge}
                  </span>
                  <span className="font-sans text-xs sm:text-sm font-semibold tracking-wide text-[#2B2B28] leading-tight mt-0.5 uppercase truncate">
                    {item.title}
                  </span>
                  <span className="font-mono text-[10px] sm:text-[11px] font-medium tracking-wider text-[#5A5A55] uppercase mt-0.5 truncate">
                    {item.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
