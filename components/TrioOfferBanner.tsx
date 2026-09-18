"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ShoppingBag, Zap, Sparkles, Check, ArrowRight, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { soundFX } from "@/lib/sound";

export default function TrioOfferBanner() {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const trioProduct = {
    id: "stage-trio-performance-stack",
    name: "STAGE 3-IN-1 PERFORMANCE TRIO STACK",
    subtitle: "YEAST PROTEIN (MOCHA) + CREATINE (ORANGE) + EAA (COLA)",
    price: "₹3,150",
    flavor: "Mocha + Orange + Cola",
    thumbnail: "/desktop.png",
    servings: "Complete 3-Product Protocol",
    netWeight: "1.55 KG TOTAL",
  };

  const handleAddTrioToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    soundFX.playAddToCart();
    
    addToCart(trioProduct, 1, "Mocha + Orange + Cola");
    
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2500);
  };

  return (
    <section className="relative w-full bg-[#111210] py-6 sm:py-10 px-3 sm:px-6 lg:px-12 overflow-hidden border-y border-[#262824]">
      {/* Background Ambience & Grain */}
      <div className="absolute inset-0 bg-grain opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(89,98,56,0.25),rgba(17,18,16,0))] pointer-events-none" />

      <div className="max-w-[1240px] mx-auto relative z-10">
        
        {/* Header Ribbon / Status Telemetry */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3 sm:mb-5 px-1">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#596238]/25 border border-[#596238]/60 text-[#A6BD64] font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-xs">
              <Zap className="w-3.5 h-3.5 fill-[#A6BD64]" />
              SPECIAL 3-IN-1 TRIO COMBO OFFER
            </span>
            <span className="hidden md:inline-block text-[#8c8e88] font-mono text-xs tracking-wider">
              BATCH SS-TRIO-2026 // ALL 3 SUPPLEMENTS INCLUDED
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#A6BD64]">
            <Sparkles className="w-3.5 h-3.5 text-[#A6BD64]" />
            <span className="font-bold tracking-wider">SAVE ₹1,547 • FLAT ₹3,150</span>
          </div>
        </div>

        {/* Clean Poster Stage - Zero Overlays, 100% Visible & Crystal Sharp */}
        <div
          onClick={handleAddTrioToCart}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleAddTrioToCart(e as any);
            }
          }}
          aria-label="Click to add Stage 3-in-1 Trio Offer (Mocha Protein, Creatine, EAA) to Cart for ₹3,150"
          className="group relative w-full rounded-md sm:rounded-lg overflow-hidden border border-[#2e302b] hover:border-[#596238] bg-[#000000] shadow-2xl transition-all duration-300 cursor-pointer select-none focus:outline-hidden focus:ring-2 focus:ring-[#A6BD64]"
        >
          {/* 1. DESKTOP POSTER (Exact 1402 x 1122 aspect ratio, zero crop, zero blur) */}
          <div className="hidden md:block relative w-full aspect-[1402/1122]">
            <Image
              src="/desktop.png"
              alt="Stage & Steel 3-in-1 Trio Offer - Mocha Protein, Creatine Monohydrate, Essential Amino Acids for ₹3,150"
              fill
              priority
              unoptimized
              className="object-contain w-full h-full group-hover:scale-[1.01] transition-transform duration-300 ease-out"
              sizes="(min-width: 768px) 1200px, 100vw"
            />
          </div>

          {/* 2. MOBILE POSTER (Exact 1122 x 1402 aspect ratio, zero crop, zero blur) */}
          <div className="block md:hidden relative w-full aspect-[1122/1402]">
            <Image
              src="/mobile.png"
              alt="Stage & Steel 3-in-1 Trio Offer - Mocha Protein, Creatine Monohydrate, Essential Amino Acids for ₹3,150"
              fill
              priority
              unoptimized
              className="object-contain w-full h-full group-hover:scale-[1.01] transition-transform duration-300 ease-out"
              sizes="100vw"
            />
          </div>

          {/* Subtle Hover Callout Strip */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#151515]/90 border border-[#596238]/80 text-[#F4F4F1] font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-xs shadow-lg group-hover:bg-[#596238] transition-colors">
              <ShoppingBag className="w-3 h-3 text-[#A6BD64] group-hover:text-white" />
              CLICK POSTER TO ADD TO CART
            </span>
          </div>
        </div>

        {/* Separate Bottom Action Bar (Placed OUTSIDE image so zero blur/crop) */}
        <div className="mt-4 p-4 sm:p-5 bg-[#1a1c18] border border-[#2e302b] rounded-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-xs sm:text-sm font-mono font-bold tracking-widest text-[#A6BD64] uppercase">
                3 FULL-SIZE SUPPLEMENTS
              </span>
              <span className="text-[#555751]">•</span>
              <span className="text-xs sm:text-sm font-mono text-[#8c8e88] line-through">
                MRP ₹4,697
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-editorial font-bold text-white uppercase tracking-wide mt-0.5">
              STAGE YEAST PROTEIN (1KG) + CREATINE (300G) + EAA (255G)
            </h3>
          </div>

          {/* Dedicated CTA Button */}
          <button
            type="button"
            onClick={handleAddTrioToCart}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 sm:px-9 py-3.5 sm:py-4 font-editorial font-bold text-sm sm:text-base tracking-widest uppercase transition-all duration-200 shadow-xl rounded-xs cursor-pointer ${
              isAdded
                ? "bg-[#2563EB] text-white shadow-[0_0_20px_rgba(37,99,235,0.6)]"
                : "bg-[#596238] hover:bg-[#6c7744] text-[#F4F4F1] hover:shadow-[0_0_25px_rgba(89,98,56,0.6)] hover:translate-x-0.5"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-5 h-5 text-white animate-bounce" />
                <span>ADDED TO CART (₹3,150)</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5 transition-transform duration-200" />
                <span>ADD TRIO TO CART — ₹3,150</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200" />
              </>
            )}
          </button>
        </div>

        {/* Footnote Assurance */}
        <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-between gap-2 sm:gap-4 text-[11px] sm:text-xs font-mono text-[#8c8e88]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#A6BD64]" />
            100% Authentic & Certified Lab Tested
          </span>
          <span className="hidden sm:inline-block">•</span>
          <span>Free Express Shipping Across India</span>
          <span className="hidden sm:inline-block">•</span>
          <span>Instant Checkout via UPI, Cards & Net Banking</span>
        </div>

      </div>
    </section>
  );
}
