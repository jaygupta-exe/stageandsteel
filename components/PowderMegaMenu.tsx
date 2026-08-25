"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, X, Zap } from "lucide-react";

interface PowderMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PowderMegaMenu({
  isOpen,
  onClose,
}: PowderMegaMenuProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number>(0);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
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

  if (!isOpen) return null;

  const navItems = [
    {
      num: "01",
      title: "PROTEIN",
      href: "#products",
      category: "WHEY & FERMENTED YEAST MATRIX",
      spec: "25G PROTEIN // PER SCOOP",
      desc: "Instantized 100% Pure Whey Concentrate & Bio-Fermented Yeast Protein matrix for optimal recovery and lean muscle growth.",
      badge: "LAB FLAGSHIP",
    },
    {
      num: "02",
      title: "CREATINE",
      href: "#products",
      category: "MICRONIZED CREATINE",
      spec: "85 SERVINGS // 200 MESH",
      desc: "100% German micronized monohydrate in Orange & Pineapple flavors for cell volumization and explosive ATP output.",
      badge: "99.9% PURITY",
    },
    {
      num: "03",
      title: "EAA",
      href: "#products",
      category: "ESSENTIAL AMINO ACIDS",
      spec: "6.45G EAAS // 4G BCAAS // COLA",
      desc: "Full spectrum 9 Essential Amino Acids fortified with crucial hydration electrolytes in refreshing Cola flavor.",
      badge: "INTRA-WORKOUT",
    },
    {
      num: "04",
      title: "ABOUT US",
      href: "#about",
      category: "MEET THE FOUNDERS",
      spec: "DIVESH MEHAN & ASHISH YADAV",
      desc: "Built on discipline, backed by experience, and forged for champions.",
      badge: "FOUNDERS & VISION",
    },
    {
      num: "05",
      title: "CONTACT",
      href: "#contact",
      category: "SUPPORT & B2B",
      spec: "CUSTOMER DESK & WHOLESALE",
      desc: "Direct support desk and specialized guidance from founders & certified sports nutritionists.",
      badge: "24/7 DESK",
    },
  ];

  const activeItem = navItems[hoveredIdx] || navItems[0];

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-[#111110]/85 backdrop-blur-2xl text-[#F4F4F1] p-6 sm:p-10 lg:p-14 animate-in fade-in duration-300 select-none overflow-y-auto">
      
      {/* 1. TOP BAR */}
      <div className="max-w-[1580px] w-full mx-auto flex items-center justify-between pb-4 border-b border-[#F4F4F1]/10 shrink-0">
        
        {/* Left: Close Scoop Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation"
          className="group flex items-center gap-3 text-xs font-mono tracking-widest text-[#F4F4F1] hover:text-[#596238] uppercase transition-colors cursor-pointer"
        >
          <div className="w-7 h-7 bg-[#151515] border border-[#F4F4F1]/20 group-hover:border-[#596238] flex items-center justify-center transition-colors">
            <X className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-90 text-[#F4F4F1]" />
          </div>
          <span className="font-bold text-[11px]">MENU // CLOSE</span>
        </button>

        {/* Center: Brand Signature */}
        <Link
          href="/"
          onClick={() => {
            onClose();
            if (typeof window !== "undefined") {
              if (window.location.pathname === "/" || window.location.pathname === "") {
                if (window.location.hash) {
                  window.history.pushState(null, "", "/");
                }
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }
          }}
          className="hidden sm:flex items-center gap-2 font-display text-lg tracking-tight text-[#F4F4F1] hover:text-[#9DB25E] transition-colors uppercase cursor-pointer"
        >
          <span>STAGE</span>
          <Zap className="w-3.5 h-3.5 text-[#596238] fill-current" />
          <span>STEEL LAB</span>
        </Link>

        {/* Right: Tactical Corner-Brackets CTA Button */}
        <div className="relative">
          <Link
            href="#products"
            onClick={onClose}
            className="relative inline-flex items-center gap-2 px-5 py-2 bg-[#596238] hover:bg-[#48502B] text-[#F4F4F1] font-mono text-[11px] font-bold tracking-widest uppercase transition-all duration-200 border border-[#7C8B4C]/40 shadow-sm"
          >
            <span className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-[#9DB25E]" />
            <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-[#9DB25E]" />
            <span>SHOP NOW</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </Link>
        </div>
      </div>

      {/* 2. MAIN TWO-COLUMN BALANCED EDITORIAL SECTION */}
      <div className="max-w-[1580px] w-full mx-auto my-auto py-8 lg:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
        
        {/* Left Column: Refined Navigation Menu (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          
          {/* Sub-header */}
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#A8B778] tracking-[0.25em] uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#596238] animate-ping" />
            <span>SYSTEM DIRECTORY // NAVIGATION</span>
          </div>

          {/* Clean Pro-Sized Navigation Links */}
          <nav className="flex flex-col border-t border-[#F4F4F1]/10">
            {navItems.map((item, idx) => {
              const isHovered = hoveredIdx === idx;

              return (
                <Link
                  key={item.num}
                  href={item.href}
                  onClick={() => {
                    if (item.title === "PROTEIN") {
                      window.dispatchEvent(new CustomEvent("filter-category", { detail: "PROTEIN" }));
                    } else if (item.title === "CREATINE") {
                      window.dispatchEvent(new CustomEvent("filter-category", { detail: "CREATINE" }));
                    } else if (item.title.includes("EAA")) {
                      window.dispatchEvent(new CustomEvent("filter-category", { detail: "EAA" }));
                    }
                    onClose();
                  }}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  className={`group relative flex items-center justify-between py-3.5 sm:py-4 px-2 border-b border-[#F4F4F1]/10 transition-all duration-200 ${
                    isHovered
                      ? "bg-[#181817]/60 border-[#596238]/50 pl-4"
                      : "hover:bg-[#151514]/40"
                  }`}
                >
                  {/* Left: Number + Title */}
                  <div className="flex items-center gap-4 sm:gap-6">
                    <span
                      className={`font-mono text-xs transition-colors duration-200 ${
                        isHovered ? "text-[#A8B778] font-bold" : "text-[#777773]"
                      }`}
                    >
                      {item.num}
                    </span>

                    <span
                      className={`font-display text-2xl sm:text-3xl lg:text-[34px] font-extrabold uppercase tracking-wide leading-none transition-colors duration-200 ${
                        isHovered ? "text-[#A8B778]" : "text-[#F4F4F1] group-hover:text-[#F4F4F1]"
                      }`}
                    >
                      {item.title}
                    </span>
                  </div>

                  {/* Right: Category tag & Arrow */}
                  <div className="flex items-center gap-3">
                    <span className="hidden sm:inline-block text-[9px] font-mono tracking-widest text-[#777773] group-hover:text-[#C4C3BE] uppercase">
                      {item.spec}
                    </span>
                    <ArrowUpRight
                      className={`w-4 h-4 transition-all duration-200 ${
                        isHovered
                          ? "opacity-100 text-[#596238] translate-x-0.5 -translate-y-0.5"
                          : "opacity-0 text-[#777773]"
                      }`}
                    />
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Column: Interactive Formula Spotlight & Specs Card (5 cols) */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-6 sm:p-8 bg-[#151514]/80 border border-[#596238]/30 rounded-xs shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          
          <div>
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#F4F4F1]/10">
              <span className="text-[10px] font-mono text-[#A8B778] tracking-widest uppercase">
                PRODUCT SPECIFICATION // {activeItem.num}
              </span>
              <span className="px-2 py-0.5 bg-[#596238]/20 border border-[#596238]/40 text-[9px] font-mono text-[#A8B778]">
                {activeItem.badge}
              </span>
            </div>

            <span className="text-xs font-mono text-[#777773] tracking-widest uppercase block mb-1">
              {activeItem.category}
            </span>

            <h4 className="font-display text-2xl font-black uppercase text-[#F4F4F1] mb-2 tracking-tight">
              {activeItem.title}
            </h4>

            <p className="text-xs font-mono text-[#596238] uppercase font-bold tracking-wider mb-4">
              {activeItem.spec}
            </p>

            <p className="text-xs text-[#C4C3BE] leading-relaxed font-body mb-6">
              {activeItem.desc}
            </p>
          </div>

          {/* Quick Specs Indicator Grid */}
          <div className="pt-4 border-t border-[#F4F4F1]/10 grid grid-cols-2 gap-3 text-[10px] font-mono text-[#777773]">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#596238]" />
              <span>HPLC VERIFIED</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#596238]" />
              <span>ZERO DOPING</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM FOOTER BAR */}
      <div className="max-w-[1580px] w-full mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-[#F4F4F1]/10 shrink-0 text-[10px] sm:text-[11px] font-mono tracking-widest text-[#777773] uppercase">
        
        {/* Bottom Left CTA */}
        <div className="relative">
          <Link
            href="#products"
            onClick={onClose}
            className="relative inline-flex items-center gap-2 px-4 py-1.5 bg-[#596238] hover:bg-[#48502B] text-[#F4F4F1] font-mono font-bold tracking-widest uppercase transition-all duration-200 border border-[#7C8B4C]/40"
          >
            <span className="absolute -top-1 -left-1 w-1.5 h-1.5 border-t-2 border-l-2 border-[#9DB25E]" />
            <span className="absolute -bottom-1 -right-1 w-1.5 h-1.5 border-b-2 border-r-2 border-[#9DB25E]" />
            <span>EXPLORE CATALOG</span>
          </Link>
        </div>

        {/* Right Info */}
        <div className="flex items-center gap-4">
          <span className="text-[#A8B778]">ELITE SPORTS NUTRITION FORMULATION</span>
          <span className="hidden sm:inline-block border-l border-[#F4F4F1]/10 pl-4 text-[#777773]">
            BATCH SS-2026-X
          </span>
        </div>
      </div>
    </div>
  );
}
