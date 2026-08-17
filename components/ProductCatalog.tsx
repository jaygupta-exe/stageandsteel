"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ShieldCheck, Sparkles, Filter, Layers, Check, FileText, Images } from "lucide-react";
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
          label: "01 FRONT VIEW",
          url: "/whey protein/salted caramel/Whey protein salted.JPG.jpeg",
        },
        {
          label: "02 NUTRITION FACTS",
          url: "/whey protein/salted caramel/sakted caramel back.PNG",
        },
        {
          label: "03 AMINO & SPECS",
          url: "/whey protein/salted caramel/salted caramel back 1.PNG",
        },
      ],
      accentColor: "#A8B778",
      batchCode: "BATCH SS-2026-X",
      flavors: [
        { name: "Salted Caramel", color: "#D4A373", inStock: true },
      ],
      specs: [
        { label: "PROTEIN", value: "25", unit: "G" },
        { label: "BCAAS", value: "5.5", unit: "G" },
        { label: "ENZYMES", value: "DigeZyme®" },
      ],
      description:
        "Microfiltered pure whey concentrate engineered for maximum leucine bio-availability and accelerated muscular hypertrophy. Formulated with zero amino spiking, zero banned substances, and zero proprietary blends.",
      nutritionFacts: [
        { name: "Protein", amount: "25g", dailyValue: "50%" },
        { name: "BCAAs (Leucine, Isoleucine, Valine)", amount: "5.5g" },
        { name: "EAAs (Essential Amino Acids)", amount: "11.7g" },
        { name: "Total Carbohydrates", amount: "2.1g" },
        { name: "Dietary Fat", amount: "1.4g" },
        { name: "DigeZyme® Multi-Enzyme Matrix", amount: "100mg" },
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
          label: "01 FRONT VIEW",
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
      accentColor: "#C4C3BE",
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

        {/* Masterpiece Product Grid (2 Flagship Products) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {filteredProducts.map((product) => {
            return (
              <div
                key={product.id}
                className="group relative flex flex-col justify-between bg-[#161615] border border-[#F4F4F1]/10 hover:border-[#596238] transition-all duration-300 p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_15px_45px_rgba(89,98,56,0.15)]"
              >
                {/* Corner Tactical Brackets */}
                <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#596238] opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#596238] opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-[#596238] opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[#596238] opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  {/* Top Bar inside Card */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#F4F4F1]/10 mb-6">
                    <span className="text-[10px] font-mono text-[#A8B778] uppercase tracking-wider">
                      {product.category}
                    </span>
                    <span className="text-[9px] font-mono text-[#777773] uppercase tracking-widest">
                      {product.servings} • {product.netWeight}
                    </span>
                  </div>

                  {/* High-Resolution Product Cutout Stage */}
                  <div
                    onClick={() => setSelectedProduct(product)}
                    className="relative w-full h-72 sm:h-80 flex items-center justify-center mb-6 overflow-hidden cursor-pointer"
                  >
                    {/* Subtle Radial Glow */}
                    <div className="absolute inset-0 bg-radial from-[#596238]/15 via-transparent to-transparent rounded-full opacity-40 group-hover:opacity-80 transition-opacity" />

                    <div className="relative w-56 sm:w-64 h-full transition-transform duration-500 ease-out group-hover:scale-106 group-hover:-translate-y-2">
                      <Image
                        src={product.thumbnail}
                        alt={product.name}
                        fill
                        unoptimized
                        className="object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.7)]"
                      />
                    </div>

                    {/* View Packaging Gallery Overlay on Hover */}
                    <div className="absolute inset-0 m-auto w-44 h-10 bg-[#141413]/90 border border-[#A8B778] text-[#F4F4F1] font-mono text-[11px] font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-2 hover:bg-[#A8B778] hover:text-[#151515] shadow-lg">
                      <Images className="w-3.5 h-3.5" />
                      <span>VIEW PACKAGING ({product.gallery.length})</span>
                    </div>
                  </div>

                  {/* Product Title & Info */}
                  <h3
                    onClick={() => setSelectedProduct(product)}
                    className="font-display text-2xl sm:text-3xl font-black uppercase text-[#F4F4F1] tracking-tight leading-tight mb-1 group-hover:text-[#A8B778] transition-colors cursor-pointer"
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs font-mono text-[#777773] uppercase tracking-wider mb-5">
                    {product.subtitle}
                  </p>

                  {/* Live Specs Matrix Mini */}
                  <div className="grid grid-cols-3 gap-2 p-3 bg-[#121211] border border-[#F4F4F1]/5 mb-6 text-center">
                    {product.specs.map((s, i) => (
                      <div key={i} className="flex flex-col">
                        <span className="text-[8px] font-mono text-[#777773] uppercase">
                          {s.label}
                        </span>
                        <span className="text-sm font-display font-bold text-[#F4F4F1]">
                          {s.value} <span className="text-[8px] text-[#A8B778]">{s.unit}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-5 border-t border-[#F4F4F1]/10 flex items-center justify-between">
                  <div>
                    <span className="text-[8px] font-mono text-[#777773] uppercase block">
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
                    {/* View Specs Trigger */}
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(product)}
                      title="View Full Lab Packaging & Facts"
                      className="p-2.5 bg-[#181817] hover:bg-[#596238]/30 border border-[#F4F4F1]/10 hover:border-[#A8B778] text-[#C4C3BE] hover:text-[#F4F4F1] transition-colors cursor-pointer"
                    >
                      <Images className="w-4 h-4" />
                    </button>

                    {/* Quick Add Button */}
                    <button
                      type="button"
                      onClick={() => alert(`Added ${product.name} to protocol shaker!`)}
                      className="px-5 py-2.5 bg-[#A8B778] hover:bg-[#8E9A5E] text-[#151515] font-mono text-xs font-black tracking-wider uppercase transition-colors cursor-pointer"
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

      {/* E-Commerce Multi-Image Slider Product Modal */}
      <ProductModal
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
      />
    </section>
  );
}
