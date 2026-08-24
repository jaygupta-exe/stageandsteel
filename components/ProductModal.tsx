"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ShieldCheck, Award, Check, ArrowRight, Plus, Minus } from "lucide-react";

import { useCart } from "@/context/CartContext";

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
  flavorThumbnails?: Record<string, string>;
  gallery: ProductImageSlide[];
  flavorGalleries?: Record<string, ProductImageSlide[]>;
  accentColor: string;
  batchCode: string;
  flavors: { name: string; color: string; inStock: boolean }[];
  specs: { label: string; value: string; unit?: string }[];
  description: string;
  nutritionFacts: { name: string; amount: string; dailyValue?: string }[];
  suggestedUse: string;
  labReportUrl?: string;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductData | null;
  initialFlavor?: string;
}

export default function ProductModal({
  isOpen,
  onClose,
  product,
  initialFlavor,
}: ProductModalProps) {
  const { addToCart } = useCart();
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [selectedFlavor, setSelectedFlavor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"SPECS" | "NUTRITION" | "USAGE" | "LAB_REPORT">("SPECS");

  useEffect(() => {
    if (product) {
      setActiveSlide(0);
      setQuantity(1);
      if (initialFlavor && product.flavors.some((f) => f.name.toLowerCase() === initialFlavor.toLowerCase())) {
        const matched = product.flavors.find((f) => f.name.toLowerCase() === initialFlavor.toLowerCase());
        setSelectedFlavor(matched?.name || product.flavors[0]?.name || "");
      } else if (product.flavors.length > 0) {
        setSelectedFlavor(product.flavors[0].name);
      }
    }
  }, [product, initialFlavor]);

  // Handle keyboard navigation and Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      const currentGallery = product?.flavorGalleries?.[selectedFlavor] || product?.gallery || [];
      if (e.key === "ArrowLeft") {
        setActiveSlide((prev) =>
          currentGallery.length > 0
            ? (prev - 1 + currentGallery.length) % currentGallery.length
            : 0
        );
      }
      if (e.key === "ArrowRight") {
        setActiveSlide((prev) =>
          currentGallery.length > 0
            ? (prev + 1) % currentGallery.length
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
  }, [isOpen, onClose, product, selectedFlavor]);

  if (!isOpen || !product) return null;

  const currentGallery =
    (selectedFlavor && product.flavorGalleries?.[selectedFlavor]) || product.gallery;
  const currentSlide = currentGallery[activeSlide] || currentGallery[0];

  const handlePrev = () => {
    setActiveSlide((prev) =>
      (prev - 1 + currentGallery.length) % currentGallery.length
    );
  };

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % currentGallery.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111110]/85 backdrop-blur-md p-3 sm:p-6 lg:p-8 animate-in fade-in duration-200 select-none">
      
      {/* Modal Card */}
      <div className="relative w-full max-w-[1340px] max-h-[94vh] bg-[#151514] text-[#F4F4F1] border border-white/15 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Top Tactical Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0E0E0D] shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#9DB25E] uppercase font-bold">
              <span className="w-2 h-2 rounded-full bg-[#8FA355] animate-pulse" />
              <span>STAGE &amp; STEEL LAB // {product.batchCode}</span>
            </div>
            <span className="hidden md:inline-block px-2.5 py-0.5 bg-[#596238]/20 border border-[#596238]/40 text-[10px] font-mono text-[#9DB25E] uppercase rounded font-bold">
              HPLC 3RD-PARTY VERIFIED • 100% PURE
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close product view"
            className="p-2 bg-[#222220] hover:bg-[#596238] hover:text-[#F4F4F1] border border-white/10 text-[#F4F4F1] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Body Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
          
          {/* LEFT: 100% SEAMLESS PURE WHITE GALLERY (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-[#FAFAFA] text-[#151515] relative p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-black/10">
            
            {/* Top Info Bar inside White Area */}
            <div className="flex items-center justify-between w-full mb-2 z-10">
              <span className="text-[11px] font-mono tracking-widest text-[#151515] uppercase bg-[#151515]/5 px-3 py-1 border border-black/10 font-bold rounded">
                VIEW {activeSlide + 1} OF {currentGallery.length} // {currentSlide?.label}
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono text-[#777773] uppercase">
                USE ARROWS OR THUMBNAILS
              </span>
            </div>

            {/* Seamless Main Image Display */}
            <div className="relative w-full h-[380px] sm:h-[450px] bg-transparent flex items-center justify-center my-auto group">
              <div className="relative w-full h-full p-2 flex items-center justify-center">
                {currentGallery.map((slide, idx) => (
                  <div
                    key={slide.url}
                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                      idx === activeSlide
                        ? "opacity-100 z-10"
                        : "opacity-0 z-0 pointer-events-none"
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
              {currentGallery.length > 1 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous image"
                  className="absolute left-1 sm:left-2 z-20 p-3 bg-[#151515] hover:bg-[#596238] text-white hover:text-white rounded-lg transition-colors cursor-pointer shadow-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              {/* Slider Right Arrow */}
              {currentGallery.length > 1 && (
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next image"
                  className="absolute right-1 sm:right-2 z-20 p-3 bg-[#151515] hover:bg-[#596238] text-white hover:text-white rounded-lg transition-colors cursor-pointer shadow-lg"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Thumbnail Strip (Pure White Backgrounds) */}
            {currentGallery.length > 1 && (
              <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-4 border-t border-black/10 mt-2 z-10">
                {currentGallery.map((slide, idx) => {
                  const isActive = idx === activeSlide;
                  return (
                    <button
                      key={slide.url}
                      type="button"
                      onClick={() => setActiveSlide(idx)}
                      className={`relative flex flex-col items-center gap-1 p-1.5 bg-white border-2 rounded-lg transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "border-[#151515] shadow-md scale-[1.02]"
                          : "border-black/10 hover:border-black/30 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <div className="relative w-full h-14 sm:h-16 bg-white overflow-hidden flex items-center justify-center rounded">
                        <Image
                          src={slide.url}
                          alt={slide.label}
                          fill
                          unoptimized
                          className="object-contain"
                        />
                      </div>
                      <span className={`text-[9px] font-mono tracking-wider uppercase truncate max-w-full px-1 ${
                        isActive ? "text-[#151515] font-bold" : "text-[#777773]"
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
          <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-8 lg:p-10 bg-[#151514]">
            
            <div>
              {/* Category & Weight */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-[#9DB25E] tracking-widest uppercase font-bold">
                  {product.category}
                </span>
                <span className="text-[10px] font-mono text-[#8E8D88] uppercase tracking-widest">
                  {product.netWeight} // {product.servings}
                </span>
              </div>

              {/* Title & Subtitle Matching Hero Typography */}
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-black uppercase text-[#F5F5F2] tracking-tight leading-[0.95] mb-2">
                {product.name}
              </h2>
              <div className="flex items-center gap-2 mb-5">
                <span className="w-2.5 h-[2px] bg-[#8FA355]" />
                <p className="font-mono text-xs sm:text-sm font-bold text-[#A8A7A3] uppercase tracking-wider">
                  {product.subtitle}
                </p>
              </div>

              {/* Quick Specs Highlight Box */}
              <div className="grid grid-cols-3 gap-2.5 p-3.5 bg-[#0D0D0C] border border-white/10 rounded-lg mb-6 shadow-inner">
                {product.specs.map((s, i) => (
                  <div key={i} className="flex flex-col text-center">
                    <span className="text-[9px] font-mono text-[#8E8D88] uppercase tracking-wider mb-0.5">
                      {s.label}
                    </span>
                    <span className="text-base sm:text-lg font-display font-black text-[#F5F5F2]">
                      {s.value} <span className="text-[10px] font-mono text-[#9DB25E] font-bold">{s.unit}</span>
                    </span>
                  </div>
                ))}
              </div>

              {/* Tabs: Specs | Nutrition Facts | Usage | Lab Report */}
              <div className="flex border-b border-white/10 mb-5 gap-1 overflow-x-auto">
                {(["SPECS", "NUTRITION", "USAGE", "LAB_REPORT"] as const).map((tab) => {
                  if (tab === "LAB_REPORT" && !product.labReportUrl) return null;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab);
                        if (tab === "LAB_REPORT" && product.labReportUrl) {
                          const labIdx = product.gallery.findIndex((g) => g.label.includes("LAB TEST") || g.url.includes("lab-reports"));
                          if (labIdx !== -1) setActiveSlide(labIdx);
                        }
                      }}
                      className={`px-4 py-2.5 text-xs font-editorial font-bold tracking-widest uppercase transition-all duration-150 cursor-pointer rounded-t-lg shrink-0 flex items-center gap-1.5 ${
                        activeTab === tab
                          ? "text-[#9DB25E] border-b-2 border-[#596238] bg-white/5"
                          : "text-[#8E8D88] hover:text-[#F4F4F1]"
                      }`}
                    >
                      {tab === "SPECS" && "FORMULA SPECS"}
                      {tab === "NUTRITION" && "NUTRITION PANEL"}
                      {tab === "USAGE" && "HOW TO USE"}
                      {tab === "LAB_REPORT" && (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5 text-[#9DB25E]" />
                          <span>LAB REPORT (COA)</span>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Tab 1: Specs & Flavor */}
              {activeTab === "SPECS" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <p className="text-xs sm:text-sm font-sans text-[#D4D3CD] leading-relaxed">
                    {product.description}
                  </p>

                  {/* Flavor Switcher */}
                  {product.flavors.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[10px] font-mono text-[#8E8D88] uppercase tracking-widest block mb-2">
                        AVAILABLE FLAVOR: <span className="text-[#F4F4F1] font-bold">{selectedFlavor}</span>
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {product.flavors.map((f) => (
                          <button
                            key={f.name}
                            type="button"
                            onClick={() => setSelectedFlavor(f.name)}
                            className={`px-3.5 py-2 text-xs font-editorial font-bold uppercase tracking-wider border rounded-lg transition-all duration-150 flex items-center gap-2 cursor-pointer ${
                              selectedFlavor === f.name
                                ? "bg-[#596238] border-[#596238] text-[#F4F4F1]"
                                : "bg-[#1E1E1C] border-white/10 text-[#8E8D88] hover:border-white/30 hover:text-white"
                            }`}
                          >
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-black/20"
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
                  <div className="text-[10px] font-mono text-[#9DB25E] tracking-wider mb-2 flex justify-between border-b border-white/10 pb-1 font-bold">
                    <span>ACTIVE COMPOUND</span>
                    <span>AMOUNT PER SERVING</span>
                  </div>
                  {product.nutritionFacts.map((n, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b border-white/5">
                      <span className="text-[#D4D3CD] font-sans">{n.name}</span>
                      <span className="font-mono font-bold text-[#F5F5F2]">{n.amount}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Suggested Use */}
              {activeTab === "USAGE" && (
                <div className="space-y-4 text-xs text-[#D4D3CD] leading-relaxed animate-in fade-in duration-200">
                  <div className="p-3.5 bg-[#0D0D0C] border border-white/10 rounded-lg">
                    <span className="font-mono text-[10px] text-[#9DB25E] uppercase tracking-wider block mb-1 font-bold">
                      SUGGESTED USAGE:
                    </span>
                    <p className="text-xs sm:text-sm font-sans text-[#F5F5F2] leading-relaxed">
                      {product.suggestedUse}
                    </p>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-[#0D0D0C] border border-white/10 rounded-lg">
                    <ShieldCheck className="w-4 h-4 text-[#9DB25E] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-editorial font-bold text-[#F5F5F2] block mb-0.5">100% Transparent Label Guarantee</span>
                      <span className="text-[11px] font-sans text-[#8E8D88]">Zero proprietary blends, zero amino-spiking, zero banned substances. CGMP &amp; WADA compliant.</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Lab Test Report COA */}
              {activeTab === "LAB_REPORT" && product.labReportUrl && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="p-3.5 bg-[#0D0D0C] border border-[#596238]/40 rounded-lg flex items-start justify-between gap-3">
                    <div>
                      <span className="font-mono text-[10px] text-[#9DB25E] uppercase tracking-wider block mb-0.5 font-bold">
                        3RD-PARTY HPLC CERTIFIED REPORT
                      </span>
                      <p className="text-xs font-sans text-[#F5F5F2] leading-relaxed">
                        Official analytical laboratory report confirming purity, measured protein content, and 100% label accuracy.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent("open-lab-reports", { detail: product.id.includes("creatine") ? "creapure-creatine-coa" : "whey-matrix-coa" }));
                      }}
                      className="px-3 py-1.5 bg-[#596238] hover:bg-[#48502B] text-[#F4F4F1] border border-[#7C8B4C]/40 font-mono text-[10px] font-bold tracking-wider uppercase rounded transition-colors shrink-0 flex items-center gap-1 shadow-sm cursor-pointer"
                    >
                      <span>ZOOM REPORT</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div
                    className="relative w-full h-44 bg-white/5 border border-white/10 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer group"
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent("open-lab-reports", { detail: product.id.includes("creatine") ? "creapure-creatine-coa" : "whey-matrix-coa" }));
                    }}
                  >
                    <Image
                      src={product.labReportUrl}
                      alt="Lab Test Report COA"
                      fill
                      unoptimized
                      className="object-contain p-2 group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-mono text-[#9DB25E] font-bold">
                      CLICK TO ZOOM &amp; PAN REPORT
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom E-Commerce Actions & Price */}
            <div className="pt-6 mt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Price & Quantity */}
              <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-start">
                <div>
                  <span className="text-[9px] font-mono text-[#8E8D88] tracking-widest uppercase block font-bold">
                    PRICE // TAX INCLUDED
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-3xl sm:text-4xl font-black text-[#F5F5F2]">
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
                <div className="flex items-center border border-white/15 bg-[#0D0D0C] rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2.5 text-[#8E8D88] hover:text-[#F5F5F2] hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-mono font-bold text-[#F5F5F2]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2.5 text-[#8E8D88] hover:text-[#F5F5F2] hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Order Now Button */}
              <div className="w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    const flavorThumbnail =
                      (selectedFlavor && product.flavorThumbnails?.[selectedFlavor]) || product.thumbnail;
                    addToCart(
                      {
                        ...product,
                        thumbnail: flavorThumbnail,
                      },
                      quantity,
                      selectedFlavor
                    );
                    onClose();
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-[#596238] hover:bg-[#48502B] text-[#F4F4F1] font-editorial text-xs sm:text-sm font-bold tracking-widest uppercase rounded-lg transition-all duration-200 cursor-pointer border border-[#7C8B4C]/40 shadow-[0_4px_20px_rgba(89,98,56,0.35)] hover:shadow-[0_4px_25px_rgba(89,98,56,0.55)] active:scale-98"
                >
                  <span>ADD TO CART</span>
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
