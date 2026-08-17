"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, ShieldCheck, Images, Check } from "lucide-react";
import ProductModal, { ProductData } from "./ProductModal";

export default function ProductCatalog() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);

  const categories = [
    { id: "ALL", label: "ALL PROTOCOLS" },
    { id: "PROTEIN", label: "PROTEIN MATRIX" },
    { id: "CREATINE", label: "CREATINE LAB" },
  ];

  const products: ProductData[] = [
    {
      id: "whey-concentrate",
      name: "STAGE WHEY CONCENTRATE",
      subtitle: "MICROFILTERED 100% PURE WHEY MATRIX",
      category: "PROTEIN MATRIX",
      price: "₹3,499",
      originalPrice: "₹4,299",
      servings: "30 Servings",
      netWeight: "1 KG (2.2 LBS)",
      thumbnail: "/whey protein/salted caramel/Whey protein salted.JPG.jpeg",
      gallery: [
        {
          label: "01 FRONT PACKAGING",
          url: "/whey protein/salted caramel/Whey protein salted.JPG.jpeg",
        },
        {
          label: "02 NUTRITION FACTS",
          url: "/whey protein/salted caramel/sakted caramel back.PNG",
        },
        {
          label: "03 AMINO & DIRECTIONS",
          url: "/whey protein/salted caramel/salted caramel back 1.PNG",
        },
      ],
      accentColor: "#596238",
      batchCode: "BATCH SS-2026-X",
      flavors: [
        { name: "Salted Caramel", color: "#DE8A36", inStock: true },
      ],
      specs: [
        { label: "PROTEIN", value: "25", unit: "G" },
        { label: "BCAAS", value: "5.5", unit: "G" },
        { label: "ENZYMES", value: "DigeZyme®" },
      ],
      description:
        "Pure microfiltered whey concentrate delivering 25g protein per scoop, instantized for rapid bio-availability, accelerated muscular hypertrophy, and optimal recovery.",
      nutritionFacts: [
        { name: "Protein per Scoop", amount: "25g", dailyValue: "50%" },
        { name: "BCAAs (Leucine, Isoleucine, Valine)", amount: "5.5g" },
        { name: "EAAs (Essential Amino Acids)", amount: "11.7g" },
        { name: "Total Carbohydrates", amount: "2.1g" },
        { name: "Dietary Fat", amount: "1.4g" },
        { name: "DigeZyme® Multi-Enzyme Complex", amount: "100mg" },
      ],
      suggestedUse:
        "Mix 1 rounded scoop (33g) with 200–250ml cold water or skimmed milk in a shaker cup. Consume immediately post-workout or between meals for optimal protein synthesis.",
    },
    {
      id: "creapure-creatine",
      name: "STAGE CREAPURE® CREATINE",
      subtitle: "GERMAN MICRONIZED MONOHYDRATE (200 MESH)",
      category: "CREATINE LAB",
      price: "₹1,899",
      originalPrice: "₹2,399",
      servings: "60 Servings",
      netWeight: "300G (0.66 LBS)",
      thumbnail: "/creatine/creatine front.jpg.jpeg",
      gallery: [
        {
          label: "01 FRONT PACKAGING",
          url: "/creatine/creatine front.jpg.jpeg",
        },
        {
          label: "02 SUPPLEMENT FACTS",
          url: "/creatine/creatine back 1jpg.jpeg",
        },
        {
          label: "03 DIRECTIONS & USAGE",
          url: "/creatine/creatine back 2.jpg.jpeg",
        },
      ],
      accentColor: "#596238",
      batchCode: "BATCH CR-2026-GER",
      flavors: [
        { name: "Unflavored Raw Purity", color: "#F4F4F1", inStock: true },
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
        { name: "Micronized Mesh Rating", amount: "200 Mesh" },
        { name: "Carbohydrates & Fats", amount: "0g" },
        { name: "Sodium / Additives", amount: "0mg" },
      ],
      suggestedUse:
        "Mix 1 scoop (5g) with 250ml cold water, juice, or your post-workout Stage Whey shake. Consume daily for optimal cellular phosphocreatine saturation.",
    },
  ];

  const filteredProducts =
    activeCategory === "ALL"
      ? products
      : products.filter((p) => {
          if (activeCategory === "PROTEIN") return p.category === "PROTEIN MATRIX";
          if (activeCategory === "CREATINE") return p.category === "CREATINE LAB";
          return true;
        });

  return (
    <section className="relative w-full py-20 sm:py-28 bg-[#A8A7A3] text-[#151515] overflow-hidden border-t border-[#151515]/15">
      
      {/* Subtle Concrete Texture */}
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-40" />

      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-16 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-[#151515]/15">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-[2px] bg-[#596238]" />
              <p className="font-editorial text-xs sm:text-sm font-bold text-[#151515] tracking-widest uppercase leading-snug">
                STAGE PROTOCOL // LAB ROSTER 2026
              </p>
            </div>

            <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase text-[#151515] tracking-tight leading-[0.92]">
              FORMULATED UNDER <br />
              <span className="text-[#596238]">DISCIPLINE.</span>
            </h2>
          </div>

          <p className="max-w-md text-xs sm:text-sm font-sans text-[#151515]/80 leading-relaxed">
            Pure microfiltered compounds calibrated for athletes who demand zero proprietary blends, measured bio-availability, and absolute stage output.
          </p>
        </div>

        {/* Category Filters Bar */}
        <div className="flex flex-wrap items-center gap-3 py-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-2.5 text-xs font-editorial font-bold tracking-widest uppercase transition-all duration-200 cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-[#151515] text-[#F4F4F1] shadow-md"
                  : "bg-[#151515]/10 text-[#151515] hover:bg-[#151515]/20 border border-[#151515]/15"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Two-Column Flagship Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {filteredProducts.map((product) => {
            return (
              <div
                key={product.id}
                className="group relative flex flex-col justify-between bg-white text-[#151515] border border-[#151515]/20 shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* 1. TOP HALF: PURE WHITE IMAGE STAGE */}
                <div
                  onClick={() => setSelectedProduct(product)}
                  className="relative w-full h-80 sm:h-96 bg-white flex items-center justify-center p-6 cursor-pointer group/img border-b border-[#151515]/10"
                >
                  {/* Top Tags inside White Canvas */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <span className="text-[10px] font-mono font-bold tracking-widest text-[#151515] bg-[#151515]/5 px-2.5 py-1 uppercase">
                      {product.category}
                    </span>
                    <span className="text-[10px] font-mono text-[#777773] uppercase tracking-widest">
                      {product.servings} • {product.netWeight}
                    </span>
                  </div>

                  {/* Product Image */}
                  <div className="relative w-full h-full flex items-center justify-center transition-transform duration-500 ease-out group-hover/img:scale-106">
                    <Image
                      src={product.thumbnail}
                      alt={product.name}
                      fill
                      priority
                      unoptimized
                      className="object-contain"
                    />
                  </div>

                  {/* View Packaging Action Overlay on Hover */}
                  <div className="absolute inset-0 m-auto w-48 h-10 bg-[#151515]/90 text-[#F4F4F1] font-editorial text-xs font-bold tracking-widest uppercase opacity-0 group-hover/img:opacity-100 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg">
                    <Images className="w-4 h-4 text-[#A8B778]" />
                    <span>VIEW PACKAGING ({product.gallery.length})</span>
                  </div>
                </div>

                {/* 2. BOTTOM HALF: DARK TITANIUM LAB SPECS & ORDER SUITE */}
                <div className="bg-[#151515] text-[#F4F4F1] p-6 sm:p-8 flex flex-col justify-between flex-1">
                  <div>
                    {/* Title */}
                    <h3
                      onClick={() => setSelectedProduct(product)}
                      className="font-display text-2xl sm:text-3xl font-black uppercase text-[#F4F4F1] tracking-tight leading-tight mb-1 group-hover:text-[#A8B778] transition-colors cursor-pointer"
                    >
                      {product.name}
                    </h3>
                    <p className="text-xs font-editorial font-bold text-[#596238] uppercase tracking-wider mb-5">
                      {product.subtitle}
                    </p>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-3 gap-2 p-3 bg-[#111110] border border-[#F4F4F1]/10 mb-6 text-center">
                      {product.specs.map((s, i) => (
                        <div key={i} className="flex flex-col">
                          <span className="text-[9px] font-mono text-[#777773] uppercase tracking-wider">
                            {s.label}
                          </span>
                          <span className="text-sm font-display font-extrabold text-[#F4F4F1]">
                            {s.value} <span className="text-[9px] text-[#A8B778]">{s.unit}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="pt-5 border-t border-[#F4F4F1]/10 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-[#777773] uppercase tracking-wider block">
                        PROTOCOL PRICE
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-display text-2xl sm:text-3xl font-black text-[#F4F4F1]">
                          {product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs font-mono line-through text-[#777773]">
                            {product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedProduct(product)}
                        title="View Packaging & Lab Facts"
                        className="p-3 bg-[#181817] hover:bg-[#596238] border border-[#F4F4F1]/20 text-[#F4F4F1] transition-colors cursor-pointer"
                      >
                        <Images className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => alert(`Added ${product.name} to protocol shaker!`)}
                        className="px-6 py-3 bg-[#596238] hover:bg-[#A8B778] text-[#F4F4F1] hover:text-[#151515] font-editorial text-xs font-bold tracking-widest uppercase transition-all duration-200 cursor-pointer shadow-md"
                      >
                        ORDER NOW
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Technical Telemetry Strip */}
        <div className="mt-14 pt-6 border-t border-[#151515]/15 flex flex-wrap items-center justify-between gap-4 text-[10px] sm:text-[11px] font-mono text-[#555550] uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#596238]" />
            <span>HPLC 3RD-PARTY CERTIFIED BATCHES</span>
          </div>
          <div className="flex items-center gap-4">
            <span>100% DOPING FREE</span>
            <span>•</span>
            <span>ZERO PROPRIETARY BLENDS</span>
            <span>•</span>
            <span>FAST DISPATCH NATIONWIDE</span>
          </div>
        </div>

      </div>

      {/* Multi-Image Packaging Slider Modal */}
      <ProductModal
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
      />
    </section>
  );
}
