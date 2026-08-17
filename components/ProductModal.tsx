"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ShieldCheck, Award, Check, ArrowRight, Plus, Minus } from "lucide-react";

export interface ProductImageSlide {
  label: string;
  url: string;
}

export interface ProductData {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  price: string;
  originalPrice?: string;
  servings: string;
  netWeight: string;
  thumbnail: string;
  gallery: ProductImageSlide[];
  accentColor: string;
  batchCode: string;
  flavors: { name: string; color: string; inStock: boolean }[];
  specs: { label: string; value: string; unit?: string }[];
  description: string;
  nutritionFacts: { name: string; amount: string; dailyValue?: string }[];
  suggestedUse: string;
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
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [selectedFlavor, setSelectedFlavor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"SPECS" | "NUTRITION" | "USAGE">("SPECS");

  useEffect(() => {
    if (product) {
      setActiveSlide(0);
      setQuantity(1);
      if (product.flavors.length > 0) {
        setSelectedFlavor(product.flavors[0].name);
      }
    }
  }, [product]);

  // Handle keyboard navigation and Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") {
        setActiveSlide((prev) =>
          product && product.gallery.length > 0
            ? (prev - 1 + product.gallery.length) % product.gallery.length
            : 0
        );
      }
      if (e.key === "ArrowRight") {
        setActiveSlide((prev) =>
          product && product.gallery.length > 0
            ? (prev + 1) % product.gallery.length
            : 0
        );
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
  }, [isOpen, onClose, product]);

  if (!isOpen || !product) return null;

  const currentSlide = product.gallery[activeSlide] || product.gallery[0];

  const handlePrev = () => {
    setActiveSlide((prev) =>
      (prev - 1 + product.gallery.length) % product.gallery.length
    );
  };

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % product.gallery.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#151515]/90 backdrop-blur-md p-3 sm:p-6 lg:p-8 animate-in fade-in duration-200 select-none">
      
      {/* Modal Card Matching Hero Aesthetic */}
      <div className="relative w-full max-w-[1340px] max-h-[94vh] bg-[#151515] text-[#F4F4F1] border border-[#F4F4F1]/15 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Top Tactical Status Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F4F4F1]/10 bg-[#111110] shrink-0">
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#A8B778] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#596238] animate-pulse" />
              <span>STAGE PROTOCOL // {product.batchCode}</span>
            </div>
            <span className="hidden md:inline-block px-2.5 py-0.5 bg-[#596238]/30 border border-[#596238] text-[10px] font-mono text-[#A8B778] uppercase">
              HPLC 3RD-PARTY VERIFIED • 100% PURE
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close product view"
            className="p-1.5 bg-[#181817] hover:bg-[#596238] border border-[#F4F4F1]/20 text-[#F4F4F1] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Body Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
          
          {/* LEFT: PURE WHITE PRODUCT SLIDER GALLERY (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-[#111110] border-b lg:border-b-0 lg:border-r border-[#F4F4F1]/10 p-5 sm:p-8 relative">
            
            {/* View Indicator Badge */}
            <div className="flex items-center justify-between w-full mb-3 z-10">
              <span className="text-[11px] font-mono tracking-widest text-[#A8B778] uppercase bg-[#181817] px-3 py-1 border border-[#596238]/40">
                VIEW {activeSlide + 1} OF {product.gallery.length} // {currentSlide?.label}
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono text-[#777773] uppercase">
                USE ARROWS OR CLICK THUMBNAILS
              </span>
            </div>

            {/* Main Image Slider Stage (PURE WHITE BG for Seamless Blend) */}
            <div className="relative w-full h-[360px] sm:h-[430px] bg-white rounded-xs border border-white flex items-center justify-center overflow-hidden my-auto group shadow-inner">
              
              {/* Active Image */}
              <div className="relative w-full h-full p-4 flex items-center justify-center">
                {product.gallery.map((slide, idx) => (
                  <div
                    key={slide.url}
                    className={`absolute inset-0 p-4 flex items-center justify-center transition-all duration-300 ${
                      idx === activeSlide
                        ? "opacity-100 scale-100 z-10"
                        : "opacity-0 scale-95 z-0 pointer-events-none"
                    }`}
                  >
                    <Image
                      src={slide.url}
                      alt={slide.label}
                      fill
                      priority={idx === 0}
                      unoptimized
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>

              {/* Slider Left Arrow */}
              {product.gallery.length > 1 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous image"
                  className="absolute left-2 z-20 p-2.5 bg-[#151515]/90 hover:bg-[#596238] border border-[#F4F4F1]/20 text-[#F4F4F1] transition-colors cursor-pointer shadow-md"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              {/* Slider Right Arrow */}
              {product.gallery.length > 1 && (
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next image"
                  className="absolute right-2 z-20 p-2.5 bg-[#151515]/90 hover:bg-[#596238] border border-[#F4F4F1]/20 text-[#F4F4F1] transition-colors cursor-pointer shadow-md"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Thumbnail Strip (Pure White Backgrounds) */}
            {product.gallery.length > 1 && (
              <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-4 border-t border-[#F4F4F1]/10 mt-3 z-10">
                {product.gallery.map((slide, idx) => {
                  const isActive = idx === activeSlide;
                  return (
                    <button
                      key={slide.url}
                      type="button"
                      onClick={() => setActiveSlide(idx)}
                      className={`relative flex flex-col items-center gap-1.5 p-1.5 bg-[#161615] border transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "border-[#A8B778] bg-[#1e1e1d] shadow-[0_0_12px_rgba(168,183,120,0.3)]"
                          : "border-[#F4F4F1]/10 hover:border-[#596238] opacity-70 hover:opacity-100"
                      }`}
                    >
                      <div className="relative w-full h-14 sm:h-16 bg-white rounded-xs overflow-hidden flex items-center justify-center p-1">
                        <Image
                          src={slide.url}
                          alt={slide.label}
                          fill
                          unoptimized
                          className="object-contain"
                        />
                      </div>
                      <span className={`text-[9px] font-mono tracking-wider uppercase ${
                        isActive ? "text-[#A8B778] font-bold" : "text-[#777773]"
                      }`}>
                        {slide.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT: E-Commerce Product Details & Purchasing Suite (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-8 lg:p-10 bg-[#151515]">
            
            <div>
              {/* Category & Weight */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-[#A8B778] tracking-widest uppercase font-bold">
                  {product.category}
                </span>
                <span className="text-[10px] font-mono text-[#777773] uppercase tracking-widest">
                  {product.netWeight} // {product.servings}
                </span>
              </div>

              {/* Title & Subtitle Matching Hero Typography */}
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-black uppercase text-[#F4F4F1] tracking-tight leading-[0.95] mb-2">
                {product.name}
              </h2>
              <div className="flex items-center gap-2 mb-5">
                <span className="w-2.5 h-[2px] bg-[#596238]" />
                <p className="font-editorial text-xs sm:text-sm font-bold text-[#596238] uppercase tracking-wider">
                  {product.subtitle}
                </p>
              </div>

              {/* Quick Specs Highlight Box */}
              <div className="grid grid-cols-3 gap-2.5 p-3.5 bg-[#111110] border border-[#F4F4F1]/10 mb-6">
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

              {/* Tabs: Specs | Nutrition Facts | Usage */}
              <div className="flex border-b border-[#F4F4F1]/10 mb-5">
                {(["SPECS", "NUTRITION", "USAGE"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-xs font-editorial font-bold tracking-widest uppercase transition-all duration-150 cursor-pointer ${
                      activeTab === tab
                        ? "text-[#A8B778] border-b-2 border-[#A8B778] bg-[#181817]"
                        : "text-[#777773] hover:text-[#F4F4F1]"
                    }`}
                  >
                    {tab === "SPECS" ? "FORMULA SPECS" : tab === "NUTRITION" ? "NUTRITION PANEL" : "HOW TO USE"}
                  </button>
                ))}
              </div>

              {/* Tab 1: Specs & Flavor */}
              {activeTab === "SPECS" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <p className="text-xs sm:text-sm font-sans text-[#F4F4F1]/80 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Flavor Switcher */}
                  {product.flavors.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[10px] font-mono text-[#777773] uppercase tracking-widest block mb-2">
                        AVAILABLE FLAVOR: <span className="text-[#F4F4F1] font-bold">{selectedFlavor}</span>
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {product.flavors.map((f) => (
                          <button
                            key={f.name}
                            type="button"
                            onClick={() => setSelectedFlavor(f.name)}
                            className={`px-3.5 py-2 text-xs font-editorial font-bold uppercase tracking-wider border transition-all duration-150 flex items-center gap-2 cursor-pointer ${
                              selectedFlavor === f.name
                                ? "bg-[#596238] border-[#A8B778] text-[#F4F4F1]"
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

              {/* Tab 2: Nutrition Matrix */}
              {activeTab === "NUTRITION" && (
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2 animate-in fade-in duration-200">
                  <div className="text-[10px] font-mono text-[#A8B778] tracking-wider mb-2 flex justify-between border-b border-[#F4F4F1]/10 pb-1">
                    <span>ACTIVE COMPOUND</span>
                    <span>AMOUNT PER SERVING</span>
                  </div>
                  {product.nutritionFacts.map((n, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b border-[#F4F4F1]/5">
                      <span className="text-[#F4F4F1]/80 font-sans">{n.name}</span>
                      <span className="font-mono font-bold text-[#F4F4F1]">{n.amount}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Suggested Use */}
              {activeTab === "USAGE" && (
                <div className="space-y-4 text-xs text-[#F4F4F1]/80 leading-relaxed animate-in fade-in duration-200">
                  <div className="p-3.5 bg-[#111110] border border-[#596238]/40">
                    <span className="font-mono text-[10px] text-[#A8B778] uppercase tracking-wider block mb-1">
                      SUGGESTED PROTOCOL:
                    </span>
                    <p className="text-xs sm:text-sm font-sans text-[#F4F4F1] leading-relaxed">
                      {product.suggestedUse}
                    </p>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-[#111110] border border-[#F4F4F1]/10">
                    <ShieldCheck className="w-4 h-4 text-[#A8B778] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-editorial font-bold text-[#F4F4F1] block mb-0.5">100% Transparent Label Guarantee</span>
                      <span className="text-[11px] font-sans text-[#777773]">Zero proprietary blends, zero amino-spiking, zero banned substances. CGMP &amp; WADA compliant.</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom E-Commerce Actions & Price */}
            <div className="pt-6 mt-6 border-t border-[#F4F4F1]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Price & Quantity */}
              <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-start">
                <div>
                  <span className="text-[9px] font-mono text-[#777773] tracking-widest uppercase block">
                    PRICE // TAX INCLUDED
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-3xl sm:text-4xl font-black text-[#F4F4F1]">
                      {product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs font-mono line-through text-[#777773]">
                        {product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center border border-[#F4F4F1]/20 bg-[#111110]">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 text-[#777773] hover:text-[#F4F4F1] transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-mono font-bold text-[#F4F4F1]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2 text-[#777773] hover:text-[#F4F4F1] transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Order Now Button */}
              <div className="w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => alert(`Added ${quantity}x ${product.name} (${selectedFlavor}) to protocol!`)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-[#596238] hover:bg-[#A8B778] text-[#F4F4F1] hover:text-[#151515] font-editorial text-xs sm:text-sm font-bold tracking-widest uppercase transition-all duration-200 cursor-pointer shadow-lg"
                >
                  <span>ADD TO PROTOCOL</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
