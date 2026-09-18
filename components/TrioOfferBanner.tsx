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
    <section className="relative w-full bg-[#151515] py-8 sm:py-12 px-3 sm:px-6 lg:px-12 overflow-hidden border-y border-[#2b2c28]">
      {/* Background Ambience & Grid Pattern */}
      <div className="absolute inset-0 bg-grain opacity-25 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(89,98,56,0.25),rgba(21,21,21,0))] pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#596238]/15 blur-[120px] pointer-events-none" />

      <div className="max-w-[1520px] mx-auto relative z-10">
        
        {/* Header Ribbon / Telemetry Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-6 px-1">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#596238]/20 border border-[#596238]/50 text-[#9DB25E] font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-xs animate-pulse">
              <Zap className="w-3.5 h-3.5 fill-[#9DB25E]" />
              SPECIAL 3-IN-1 PROTOCOL OFFER
            </span>
            <span className="hidden sm:inline-block text-[#8c8e88] font-mono text-xs tracking-wider">
              BATCH SS-TRIO-2026 // ALL 3 SUPPLEMENTS
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#9DB25E]">
            <Sparkles className="w-3.5 h-3.5 text-[#9DB25E]" />
            <span className="font-bold tracking-wider">INSTANT ₹1,547 DISCOUNT</span>
          </div>
        </div>

        {/* Interactive Poster Stage Container */}
        <div
          onClick={handleAddTrioToCart}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleAddTrioToCart(e as any);
            }
          }}
          aria-label="Add Stage 3-in-1 Trio Stack (Mocha Protein + Creatine + EAA) to Cart for ₹3,150"
          className="group relative w-full rounded-md sm:rounded-lg overflow-hidden border border-[#333530] hover:border-[#596238] bg-[#0d0e0d] shadow-2xl transition-all duration-300 cursor-pointer select-none focus:outline-hidden focus:ring-2 focus:ring-[#9DB25E]"
        >
          {/* Subtle Dynamic Gloss Sweep on Hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out z-20 pointer-events-none" />

          {/* 1. DESKTOP POSTER (Hidden on Mobile) */}
          <div className="hidden md:block relative w-full aspect-[16/9] sm:aspect-[1920/1080] max-h-[720px] overflow-hidden">
            <Image
              src="/desktop.png"
              alt="Stage & Steel 3-in-1 Trio Offer: Mocha Protein + Creatine Monohydrate + Essential Amino Acids for ₹3150"
              fill
              priority
              unoptimized
              className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-500 ease-out"
              sizes="(min-width: 768px) 100vw, 1200px"
            />
          </div>

          {/* 2. MOBILE POSTER (Visible only on Mobile & Small Tablets) */}
          <div className="block md:hidden relative w-full aspect-[4/5] sm:aspect-[3/4] overflow-hidden">
            <Image
              src="/mobile.png"
              alt="Stage & Steel 3-in-1 Trio Offer: Mocha Protein + Creatine Monohydrate + Essential Amino Acids for ₹3150"
              fill
              priority
              unoptimized
              className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-500 ease-out"
              sizes="100vw"
            />
          </div>

          {/* Floating Bottom Quick-Action Bar */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0d0e0d] via-[#0d0e0d]/90 to-transparent p-4 sm:p-6 sm:pt-12 flex flex-col sm:flex-row items-center justify-between gap-3.5 z-20 backdrop-blur-xs">
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-xs sm:text-sm font-mono font-bold tracking-widest text-[#9DB25E] uppercase">
                  3 FULL-SIZE PRODUCTS
                </span>
                <span className="text-[#686a64]">•</span>
                <span className="text-xs sm:text-sm font-mono text-[#a3a59e] line-through">
                  MRP ₹4,697
                </span>
              </div>
              <h3 className="text-base sm:text-xl md:text-2xl font-editorial font-bold text-white uppercase tracking-wide">
                MOCHA PROTEIN + CREATINE + EAA BUNDLE
              </h3>
            </div>

            {/* CTA Button */}
            <div className="w-full sm:w-auto">
              <button
                type="button"
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 font-editorial font-bold text-sm sm:text-base tracking-widest uppercase transition-all duration-200 shadow-xl rounded-xs cursor-pointer ${
                  isAdded
                    ? "bg-[#2563EB] text-white"
                    : "bg-[#596238] hover:bg-[#6c7744] text-[#F4F4F1] group-hover:shadow-[0_0_25px_rgba(89,98,56,0.7)]"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-5 h-5 text-white animate-bounce" />
                    <span>ADDED TO CART (₹3,150)</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                    <span>CLAIM TRIO OFFER — ₹3,150</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footnote Assurance */}
        <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-center sm:justify-between gap-2 sm:gap-4 text-[11px] sm:text-xs font-mono text-[#8c8e88]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#9DB25E]" />
            100% Authentic & Lab Tested
          </span>
          <span className="hidden sm:inline-block">•</span>
          <span>Free Express Pan-India Delivery Included</span>
          <span className="hidden sm:inline-block">•</span>
          <span>Instant Checkout with UPI, Cards & Net Banking</span>
        </div>

      </div>
    </section>
  );
}
