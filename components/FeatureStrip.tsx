"use client";

import React from "react";
import { Dumbbell, ShieldCheck, Sparkles, CheckCircle2, Zap } from "lucide-react";

interface FeatureStripProps {
  featureStripRef?: React.RefObject<HTMLDivElement | null>;
}

export default function FeatureStrip({ featureStripRef }: FeatureStripProps) {
  const tickerItems = [
    "100% COLD-MICROFILTERED WHEY ISOLATE",
    "27G PROTEIN PER SERVING",
    "5G MICRONIZED CREAPURE® MONOHYDRATE",
    "ZERO PROPRIETARY BLENDS",
    "HPLC INDEPENDENT LAB CERTIFIED",
    "INFORMED-SPORT BATCH TESTED",
    "ZERO AMINO SPIKING GUARANTEE",
  ];

  const features = [
    {
      icon: Dumbbell,
      badge: "16+",
      title: "YEARS OF TRAINING",
      description: "FIELD-TESTED RIGOR",
      code: "SPEC // 01",
    },
    {
      icon: ShieldCheck,
      badge: "ATHLETE",
      title: "FORMULATED",
      description: "PURPOSE-DRIVEN DOSING",
      code: "SPEC // 02",
    },
    {
      icon: Sparkles,
      badge: "QUALITY",
      title: "INGREDIENTS",
      description: "100% TRANSPARENT LABELS",
      code: "SPEC // 03",
    },
    {
      icon: CheckCircle2,
      badge: "ZERO",
      title: "COMPROMISES",
      description: "UNCOMPROMISED PURITY",
      code: "SPEC // 04",
    },
  ];

  return (
    <div
      ref={featureStripRef}
      className="w-full border-t border-[#151515]/15 bg-[#A8A7A3]/95 relative z-20 shrink-0 opacity-0 overflow-hidden"
    >
      {/* 1. Continuous Infinite Marquee Telemetry Bar */}
      <div className="w-full bg-[#151515] text-[#F4F4F1] py-1.5 overflow-hidden flex items-center border-b border-[#151515]/20 select-none">
        <div className="flex whitespace-nowrap animate-[marquee_25s_linear_infinite]">
          {[...tickerItems, ...tickerItems].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 mx-4 text-[10px] font-mono tracking-widest uppercase">
              <span className="text-[#596238]">⚡</span>
              <span className="font-bold text-[#F4F4F1]">{item}</span>
              <span className="text-[#596238]/60 font-bold">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Main 4-Feature Cards Console */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-16">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#151515]/15 py-3 sm:py-4">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`group relative flex items-center gap-3 sm:gap-4 p-2 sm:p-3 transition-all duration-200 hover:bg-[#151515]/5 ${
                  index % 2 === 0 ? "pr-2 sm:pr-4" : "pl-2 sm:pl-4 md:pl-6"
                } ${index >= 2 ? "md:pl-6" : ""}`}
              >
                {/* Minimal Icon Box */}
                <div className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 border border-[#151515]/20 bg-[#151515]/5 flex items-center justify-center text-[#151515] transition-all duration-200 group-hover:border-[#596238] group-hover:bg-[#596238] group-hover:text-[#F4F4F1]">
                  <Icon className="w-4 h-4 stroke-[1.8] transition-transform duration-200 group-hover:scale-110" />
                </div>

                {/* Text Hierarchy */}
                <div className="flex flex-col justify-center min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-base sm:text-lg font-black tracking-tight text-[#151515] leading-none uppercase">
                      {item.badge}
                    </span>
                    <span className="hidden sm:inline-block text-[8px] font-mono text-[#596238] font-bold">
                      {item.code}
                    </span>
                  </div>
                  <span className="font-editorial text-[10px] sm:text-xs font-bold tracking-wider text-[#151515] leading-tight mt-0.5 uppercase truncate">
                    {item.title}
                  </span>
                  <span className="font-mono text-[8px] sm:text-[9px] tracking-widest text-[#777773] uppercase mt-0.5 truncate">
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
