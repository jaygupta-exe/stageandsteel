"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Eye, ArrowUpRight, ShieldCheck, Sparkles, Filter, Layers, Check } from "lucide-react";
import Product3DModal, { Product3DData } from "./Product3DModal";

export default function ProductCatalog() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [selectedProduct3D, setSelectedProduct3D] = useState<Product3DData | null>(null);

  const categories = [
    { id: "ALL", label: "ALL PROTOCOLS" },
    { id: "PROTEIN", label: "PROTEIN MATRIX" },
    { id: "CREATINE", label: "CREATINE LAB" },
    { id: "PERFORMANCE", label: "PERFORMANCE & ENERGY" },
  ];

  const products: Product3DData[] = [
    {
      id: "whey-concentrate",
      name: "STAGE WHEY CONCENTRATE",
      subtitle: "MICROFILTERED 100% PURE WHEY MATRIX",
      category: "PROTEIN MATRIX",
      price: "₹3,499",
      servings: "30 Servings",
      netWeight: "1 KG (2.2 LBS)",
      tubType: "whey",
      textureUrl: "/whey-3d-wrap-texture.png",
      accentColor: "#A8B778",
      batchCode: "BATCH SS-2026-X",
      flavors: [
        { name: "Salted Caramel", color: "#D4A373", inStock: true },
        { name: "Double Rich Chocolate", color: "#582F0E", inStock: true },
        { name: "Gourmet Vanilla Cream", color: "#EDE0D4", inStock: true },
      ],
      specs: [
        { label: "PROTEIN", value: "25", unit: "G" },
        { label: "BCAAS", value: "5.5", unit: "G" },
        { label: "ENZYMES", value: "DigeZyme®" },
      ],
      description:
        "Microfiltered pure whey concentrate engineered for maximum leucine bio-availability and accelerated muscular hypertrophy. Formulated with zero amino spiking and zero proprietary blends.",
      nutritionFacts: [
        { name: "Protein", amount: "25g", dailyValue: "50%" },
        { name: "BCAAs (Leucine, Isoleucine, Valine)", amount: "5.5g" },
        { name: "EAAs (Essential Amino Acids)", amount: "11.7g" },
        { name: "Total Carbohydrates", amount: "2.1g" },
        { name: "Dietary Fat", amount: "1.4g" },
        { name: "Digestive Enzyme Complex", amount: "100mg" },
      ],
    },
    {
      id: "creapure-creatine",
      name: "STAGE CREAPURE® CREATINE",
      subtitle: "GERMAN MICRONIZED MONOHYDRATE (200 MESH)",
      category: "CREATINE LAB",
      price: "₹1,899",
      servings: "60 Servings",
      netWeight: "300G (0.66 LBS)",
      tubType: "creatine",
      textureUrl: "/creatine-3d-wrap-texture.png",
      accentColor: "#C4C3BE",
      batchCode: "BATCH CR-2026-GER",
      flavors: [
        { name: "Unflavored Raw Purity", color: "#F4F4F1", inStock: true },
        { name: "Sour Green Apple", color: "#70E000", inStock: true },
      ],
      specs: [
        { label: "PURITY", value: "99.9", unit: "%" },
        { label: "CREAPURE®", value: "5000", unit: "MG" },
        { label: "FILLERS", value: "0", unit: "%" },
      ],
      description:
        "100% German Creapure® micronized creatine monohydrate. Rapidly replenishes intracellular phosphocreatine reserves to fuel explosive ATP output, maximal strength, and cellular volumization.",
      nutritionFacts: [
        { name: "Creapure® Creatine Monohydrate", amount: "5,000mg" },
        { name: "Purity Rating", amount: "99.9%" },
        { name: "Micronized Rating", amount: "200 Mesh" },
        { name: "Carbohydrates & Fats", amount: "0g" },
        { name: "Sodium / Additives", amount: "0mg" },
      ],
    },
    {
      id: "iso-peak",
      name: "STAGE ISO-PEAK ISOLATE",
      subtitle: "CROSS-FLOW MICROFILTERED 90% ISOLATE",
      category: "PROTEIN MATRIX",
      price: "₹4,299",
      servings: "30 Servings",
      netWeight: "1 KG (2.2 LBS)",
      tubType: "whey",
      textureUrl: "/whey-3d-wrap-texture.png",
      accentColor: "#A8B778",
      batchCode: "BATCH ISO-2026-V1",
      flavors: [
        { name: "Cold Brew Mocha", color: "#3D2B1F", inStock: true },
        { name: "Alpine Strawberry", color: "#E05368", inStock: true },
      ],
      specs: [
        { label: "PROTEIN", value: "27", unit: "G" },
        { label: "CARBS", value: "<1", unit: "G" },
        { label: "FAT", value: "0", unit: "G" },
      ],
      description:
        "Ultra-refined CFM Whey Isolate delivering rapid amino influx with virtually zero fats and carbohydrates. Ideal for contest prep, peak conditioning, and lean tissue preservation.",
      nutritionFacts: [
        { name: "Protein", amount: "27g", dailyValue: "54%" },
        { name: "BCAAs", amount: "6.2g" },
        { name: "Total Carbohydrates", amount: "0.6g" },
        { name: "Dietary Fat", amount: "0.2g" },
        { name: "Lactose", amount: "<0.5%" },
      ],
    },
    {
      id: "nitro-prep",
      name: "STAGE NITRO-PREP PUMP",
      subtitle: "CLINICALLY DOSED HIGH-STIM PRE-WORKOUT",
      category: "PERFORMANCE",
      price: "₹2,499",
      servings: "30 Servings",
      netWeight: "420G (0.92 LBS)",
      tubType: "creatine",
      textureUrl: "/creatine-3d-wrap-texture.png",
      accentColor: "#D4A373",
      batchCode: "BATCH NITRO-2026-MAX",
      flavors: [
        { name: "Electric Blue Razz", color: "#0077B6", inStock: true },
        { name: "Blood Orange Velocity", color: "#D00000", inStock: true },
      ],
      specs: [
        { label: "L-CITRULLINE", value: "6000", unit: "MG" },
        { label: "BETA-ALANINE", value: "3200", unit: "MG" },
        { label: "CAFFEINE", value: "400", unit: "MG" },
      ],
      description:
        "High-stimulant stage prep amplifier engineered for skin-splitting nitric oxide pumps, sustained neurological focus, and unyielding training intensity.",
      nutritionFacts: [
        { name: "Pure L-Citrulline", amount: "6,000mg" },
        { name: "Beta-Alanine (CarnoSyn®)", amount: "3,200mg" },
        { name: "Anhydrous Caffeine Matrix", amount: "400mg" },
        { name: "Alpha-GPC 50%", amount: "300mg" },
        { name: "AstraGin® Absorption Enhancer", amount: "50mg" },
      ],
    },
  ];

  const filteredProducts =
    activeCategory === "ALL"
      ? products
      : products.filter((p) => {
          if (activeCategory === "PROTEIN") return p.category === "PROTEIN MATRIX";
          if (activeCategory === "CREATINE") return p.category === "CREATINE LAB";
          if (activeCategory === "PERFORMANCE") return p.category === "PERFORMANCE";
          return true;
        });

  return (
    <section className="relative w-full py-24 sm:py-32 bg-[#121211] text-[#F4F4F1] overflow-hidden border-t border-[#151515]/20">
      
      {/* Background Ambience & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#596238_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.07] pointer-events-none" />
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-[#596238]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-40 w-96 h-96 bg-[#A8B778]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-16 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-12 border-b border-[#F4F4F1]/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#A8B778] tracking-[0.25em] uppercase mb-3">
              <span className="w-2 h-2 rounded-full bg-[#596238] animate-pulse" />
              <span>STAGE PROTOCOL // LAB ROSTER 2026</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase text-[#F4F4F1] tracking-tight leading-[0.95]">
              FORMULATED FOR <br />
              <span className="text-[#A8B778]">THE STAGE.</span>
            </h2>
          </div>

          <p className="max-w-xl text-sm sm:text-base text-[#C4C3BE] leading-relaxed font-body">
            Pure microfiltered compounds calibrated for elite athletes who demand zero proprietary blends, maximum bioavailability, and unyielding laboratory transparency.
          </p>
        </div>

        {/* Category Filters Bar */}
        <div className="flex flex-wrap items-center gap-2 py-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 text-xs font-mono tracking-widest uppercase transition-all duration-200 cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-[#A8B778] text-[#151515] font-black border border-[#A8B778]"
                  : "bg-[#181817] text-[#777773] hover:text-[#F4F4F1] border border-[#F4F4F1]/10 hover:border-[#596238]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Masterpiece Product Grid (Editorial Tactical Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
          {filteredProducts.map((product) => {
            const isWhey = product.tubType === "whey";
            const thumbnailSrc = isWhey
              ? "/whey protein/salted caramel/Whey_protein_front..png"
              : "/creatine-cutout.png";

            return (
              <div
                key={product.id}
                className="group relative flex flex-col justify-between bg-[#161615] border border-[#F4F4F1]/10 hover:border-[#596238] transition-all duration-300 p-6 sm:p-7 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_15px_45px_rgba(89,98,56,0.15)]"
              >
                {/* Corner Tactical Brackets */}
                <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#596238] opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#596238] opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#596238] opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#596238] opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  {/* Top Bar inside Card */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#F4F4F1]/10 mb-6">
                    <span className="text-[10px] font-mono text-[#A8B778] uppercase tracking-wider">
                      {product.category}
                    </span>
                    <span className="text-[9px] font-mono text-[#777773] uppercase tracking-widest">
                      {product.servings}
                    </span>
                  </div>

                  {/* Interactive 3D Product Cutout Stage */}
                  <div className="relative w-full h-64 sm:h-72 flex items-center justify-center mb-6 overflow-hidden">
                    {/* Subtle Radial Glow */}
                    <div className="absolute inset-0 bg-radial from-[#596238]/15 via-transparent to-transparent rounded-full opacity-40 group-hover:opacity-80 transition-opacity" />

                    <div className="relative w-48 sm:w-56 h-full transition-transform duration-500 ease-out group-hover:scale-108 group-hover:-translate-y-2">
                      <Image
                        src={thumbnailSrc}
                        alt={product.name}
                        fill
                        unoptimized
                        className="object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.7)]"
                      />
                    </div>

                    {/* Floating 3D Inspect Action Overlay on Hover */}
                    <button
                      type="button"
                      onClick={() => setSelectedProduct3D(product)}
                      className="absolute inset-0 m-auto w-40 h-10 bg-[#141413]/90 border border-[#A8B778] text-[#F4F4F1] font-mono text-[11px] font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-2 hover:bg-[#A8B778] hover:text-[#151515] shadow-lg cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>INSPECT 3D (360°)</span>
                    </button>
                  </div>

                  {/* Product Title & Info */}
                  <h3 className="font-display text-xl sm:text-2xl font-black uppercase text-[#F4F4F1] tracking-tight leading-tight mb-1 group-hover:text-[#A8B778] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-[11px] font-mono text-[#777773] uppercase tracking-wider mb-4">
                    {product.subtitle}
                  </p>

                  {/* Live Specs Matrix Mini */}
                  <div className="grid grid-cols-3 gap-1.5 p-2.5 bg-[#121211] border border-[#F4F4F1]/5 mb-5 text-center">
                    {product.specs.map((s, i) => (
                      <div key={i} className="flex flex-col">
                        <span className="text-[8px] font-mono text-[#777773] uppercase">
                          {s.label}
                        </span>
                        <span className="text-xs font-display font-bold text-[#F4F4F1]">
                          {s.value} <span className="text-[8px] text-[#A8B778]">{s.unit}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-4 border-t border-[#F4F4F1]/10 flex items-center justify-between">
                  <div>
                    <span className="text-[8px] font-mono text-[#777773] uppercase block">
                      PROTOCOL PRICE
                    </span>
                    <span className="font-display text-2xl font-black text-[#F4F4F1]">
                      {product.price}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Direct 3D Inspect Trigger */}
                    <button
                      type="button"
                      onClick={() => setSelectedProduct3D(product)}
                      title="Open 360° 3D Inspector"
                      className="p-2.5 bg-[#181817] hover:bg-[#596238]/30 border border-[#F4F4F1]/10 hover:border-[#A8B778] text-[#C4C3BE] hover:text-[#F4F4F1] transition-colors cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Quick Add Button */}
                    <button
                      type="button"
                      onClick={() => alert(`Added ${product.name} to protocol shaker!`)}
                      className="px-4 py-2.5 bg-[#A8B778] hover:bg-[#8E9A5E] text-[#151515] font-mono text-[11px] font-black tracking-wider uppercase transition-colors cursor-pointer"
                    >
                      ORDER NOW
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Fullscreen Real-time 360° 3D Product Inspector Modal */}
      <Product3DModal
        isOpen={Boolean(selectedProduct3D)}
        onClose={() => setSelectedProduct3D(null)}
        product={selectedProduct3D}
      />
    </section>
  );
}
