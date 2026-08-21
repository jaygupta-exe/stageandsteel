"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, ShieldCheck, Images, Check, Sparkles, Zap, Flame } from "lucide-react";
import ProductModal, { ProductData } from "./ProductModal";
import { useCart } from "@/context/CartContext";

export default function ProductCatalog() {
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
  const [selectedCardFlavors, setSelectedCardFlavors] = useState<Record<string, string>>({});

  useEffect(() => {
    const handleCategoryFilter = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setActiveCategory(customEvent.detail);
        const section = document.getElementById("products");
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes("protein")) {
        setActiveCategory("PROTEIN");
      } else if (hash.includes("creatine")) {
        setActiveCategory("CREATINE");
      }
    };

    handleHash();
    window.addEventListener("filter-category", handleCategoryFilter);
    window.addEventListener("hashchange", handleHash);

    return () => {
      window.removeEventListener("filter-category", handleCategoryFilter);
      window.removeEventListener("hashchange", handleHash);
    };
  }, []);

  const categories = [
    { id: "ALL", label: "ALL PROTOCOLS", count: "04" },
    { id: "PROTEIN", label: "PROTEIN MATRIX", count: "03" },
    { id: "CREATINE", label: "CREATINE LAB", count: "01" },
  ];

  const products: ProductData[] = [
    {
      id: "whey-belgian-chocolate",
      name: "STAGE WHEY - BELGIAN CHOCOLATE",
      subtitle: "MICROFILTERED 100% PURE WHEY // RICH COCOA",
      category: "PROTEIN MATRIX",
      price: "₹3,499",
      originalPrice: "₹4,299",
      servings: "30 Servings",
      netWeight: "1 KG (2.2 LBS)",
      thumbnail: "/belgium-chocolate-cutout.png",
      labReportUrl: "/lab-reports/belgian-salted-caramel-test-report.png",
      gallery: [
        {
          label: "01 FRONT PACKAGING",
          url: "/whey protein/belgium chocalte/belgium choclate 3.PNG",
        },
        {
          label: "02 SUPPLEMENT FACTS",
          url: "/whey protein/belgium chocalte/belgium chocalte.PNG",
        },
        {
          label: "03 AMINO & DIRECTIONS",
          url: "/whey protein/belgium chocalte/belgium chocalte2.PNG",
        },
        {
          label: "04 LAB TEST REPORT (COA)",
          url: "/lab-reports/belgian-salted-caramel-test-report.png",
        },
      ],
      accentColor: "#596238",
      batchCode: "BATCH SS-2026-BC",
      flavors: [
        { name: "Belgian Chocolate", color: "#5C3A21", inStock: true },
      ],
      specs: [
        { label: "PROTEIN", value: "24", unit: "G" },
        { label: "BCAAS", value: "5.5", unit: "G" },
        { label: "ENZYMES", value: "DigeZyme®" },
      ],
      description:
        "Pure microfiltered Belgian Chocolate whey concentrate delivering 24g ultra-pure protein per scoop with decadent European cocoa. Formulated for rapid bio-availability, accelerated muscular hypertrophy, and optimal recovery.",
      nutritionFacts: [
        { name: "Protein per Scoop", amount: "24g", dailyValue: "48%" },
        { name: "BCAAs (Leucine, Isoleucine, Valine)", amount: "5.5g" },
        { name: "EAAs (Essential Amino Acids)", amount: "11.7g" },
        { name: "Total Carbohydrates", amount: "2.4g" },
        { name: "Dietary Fat", amount: "1.5g" },
        { name: "DigeZyme® Multi-Enzyme Complex", amount: "100mg" },
      ],
      suggestedUse:
        "Mix 1 rounded scoop (33g) with 200–250ml cold water or skimmed milk in a shaker cup. Consume immediately post-workout or between meals for optimal protein synthesis.",
    },
    {
      id: "whey-mocha-protein",
      name: "STAGE WHEY - CAFE MOCHA",
      subtitle: "MICROFILTERED WHEY MATRIX // COFFEE INFUSION",
      category: "PROTEIN MATRIX",
      price: "₹2,599",
      originalPrice: "₹4,299",
      servings: "30 Servings",
      netWeight: "1 KG (2.2 LBS)",
      thumbnail: "/mocha-protein-cutout.png",
      gallery: [
        {
          label: "01 FRONT PACKAGING",
          url: "/whey protein/mocha protein/mocha protein.PNG",
        },
        {
          label: "02 SUPPLEMENT FACTS",
          url: "/whey protein/mocha protein/mocha protein 2.PNG",
        },
        {
          label: "03 AMINO & DIRECTIONS",
          url: "/whey protein/mocha protein/mocha protein 3.PNG",
        },
      ],
      accentColor: "#596238",
      batchCode: "BATCH SS-2026-MC",
      flavors: [
        { name: "Cafe Mocha", color: "#6F4E37", inStock: true },
      ],
      specs: [
        { label: "PROTEIN", value: "25", unit: "G" },
        { label: "BCAAS", value: "5.5", unit: "G" },
        { label: "ENZYMES", value: "DigeZyme®" },
      ],
      description:
        "Artisanal roast Cafe Mocha whey concentrate combining 25g ultra-clean microfiltered protein with authentic coffee aroma and multi-enzyme digestive complex for superior absorption.",
      nutritionFacts: [
        { name: "Protein per Scoop", amount: "25g", dailyValue: "50%" },
        { name: "BCAAs (Leucine, Isoleucine, Valine)", amount: "5.5g" },
        { name: "EAAs (Essential Amino Acids)", amount: "11.7g" },
        { name: "Total Carbohydrates", amount: "2.2g" },
        { name: "Dietary Fat", amount: "1.4g" },
        { name: "DigeZyme® Multi-Enzyme Complex", amount: "100mg" },
      ],
      suggestedUse:
        "Mix 1 rounded scoop (33g) with 200–250ml ice-cold water or milk in a shaker cup. Perfect as a morning kickstarter or high-octane post-workout fuel.",
    },
    {
      id: "whey-salted-caramel",
      name: "STAGE WHEY - SALTED CARAMEL",
      subtitle: "MICROFILTERED 100% PURE WHEY MATRIX",
      category: "PROTEIN MATRIX",
      price: "₹3,499",
      originalPrice: "₹4,299",
      servings: "30 Servings",
      netWeight: "1 KG (2.2 LBS)",
      thumbnail: "/salted-caramel-cutout.png",
      labReportUrl: "/lab-reports/belgian-salted-caramel-test-report.png",
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
        {
          label: "04 LAB TEST REPORT (COA)",
          url: "/lab-reports/belgian-salted-caramel-test-report.png",
        },
      ],
      accentColor: "#596238",
      batchCode: "BATCH SS-2026-SC",
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
        { name: "Total Carbohydrates", amount: "2.5g" },
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
      price: "₹899",
      originalPrice: "₹1,299",
      servings: "85 Servings",
      netWeight: "300G (0.66 LBS)",
      thumbnail: "/creatine-cutout.png",
      gallery: [
        {
          label: "01 FRONT PACKAGING",
          url: "/creatine/1 k.jpg.jpeg",
        },
        {
          label: "02 SUPPLEMENT FACTS",
          url: "/creatine/2 k.jpg.jpeg",
        },
        {
          label: "03 DIRECTIONS & USAGE",
          url: "/creatine/3 k.jpg.jpeg",
        },
      ],
      accentColor: "#DE8A36",
      batchCode: "BATCH CR-2026-GER",
      flavors: [
        { name: "Orange", color: "#FF7A00", inStock: true },
        { name: "Pineapple", color: "#FFD000", inStock: true },
      ],
      specs: [
        { label: "PURITY", value: "99.9", unit: "%" },
        { label: "CREATINE", value: "5000", unit: "MG" },
        { label: "FILLERS", value: "0", unit: "%" },
      ],
      description:
        "Premium 200 Mesh micronized creatine monohydrate in delicious Orange and Pineapple flavors. 85 full servings designed to rapidly replenish intracellular phosphocreatine reserves to fuel explosive ATP output, maximal strength, and cellular volumization.",
      nutritionFacts: [
        { name: "Creatine Monohydrate (Micronized)", amount: "5,000mg" },
        { name: "Purity Rating", amount: "99.9%" },
        { name: "Micronized Mesh Rating", amount: "200 Mesh" },
        { name: "Carbohydrates & Fats", amount: "0g" },
        { name: "Sodium / Additives", amount: "0mg" },
      ],
      suggestedUse:
        "Mix 1 scoop with 250ml cold water. Consume daily for optimal cellular phosphocreatine saturation.",
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
    <section
      id="products"
      className="relative w-full py-20 sm:py-28 bg-[#A8A7A3] text-[#151515] border-t border-[#151515]/10 overflow-hidden"
    >
      {/* Background Decorative Grain & Faint Grid */}
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-40" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#15151508_1px,transparent_1px),linear-gradient(to_bottom,#15151508_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-16 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-[#151515]/20">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-2.5 h-2.5 bg-[#151515] flex items-center justify-center">
                <span className="w-1 h-1 bg-[#8FA355]" />
              </span>
              <p className="font-mono text-xs sm:text-sm font-bold text-[#151515] tracking-widest uppercase">
                STAGE PROTOCOL // LAB ROSTER 2026
              </p>
            </div>

            <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase text-[#151515] tracking-tight leading-[0.92]">
              FORMULATED UNDER <br />
              <span className="text-[#151515] relative inline-block">
                DISCIPLINE.
                <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-[#151515]" />
              </span>
            </h2>
          </div>

          <div className="flex flex-col gap-3 max-w-md">
            <p className="text-xs sm:text-sm font-sans text-[#2B2B28] leading-relaxed font-medium">
              Pure microfiltered compounds calibrated for athletes who demand zero proprietary blends, measured bio-availability, and absolute stage output.
            </p>
            <div className="flex items-center gap-4 text-[10px] font-mono text-[#444440] uppercase tracking-wider">
              <span className="flex items-center gap-1.5 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#151515]" /> 100% TRANSPARENT LABELS
              </span>
              <span>•</span>
              <span>BATCH CERTIFIED</span>
            </div>
          </div>
        </div>

        {/* Category Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-8">
          <div className="inline-flex p-1.5 bg-[#151515]/10 backdrop-blur-sm rounded-lg border border-[#151515]/15 shadow-inner">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`relative px-5 py-2.5 text-xs font-editorial font-bold tracking-widest uppercase transition-all duration-200 cursor-pointer rounded-md flex items-center gap-2.5 ${
                    isActive
                      ? "bg-[#596238] text-[#F4F4F1] shadow-lg border border-[#7C8B4C]/40"
                      : "text-[#151515] hover:text-black hover:bg-[#151515]/10"
                  }`}
                >
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#9DB25E] animate-pulse" />}
                  <span>{cat.label}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    isActive ? "bg-black/20 text-[#F4F4F1]" : "bg-[#151515]/10 text-[#151515]/70"
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#3A3A35]">
            <span className="w-2 h-2 rounded-full bg-emerald-700 animate-pulse" />
            <span className="tracking-wider uppercase font-bold">LIVE INVENTORY // ALL PROTOCOLS IN STOCK</span>
          </div>
        </div>

        {/* Two-Column Flagship Cards - Modern Luxury Monolithic Design */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 max-w-6xl mx-auto">
          {filteredProducts.map((product) => {
            return (
              <div
                key={product.id}
                className="group relative flex flex-col justify-between bg-[#151514] text-[#F4F4F1] border border-[#151515]/30 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.4)] transition-all duration-300 overflow-hidden"
              >
                {/* Top Subtle Metallic Highlight Edge */}
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#596238]/60 to-transparent z-20" />

                {/* 1. SEAMLESS STUDIO SHOWCASE STAGE */}
                <div
                  onClick={() => setSelectedProduct(product)}
                  className="relative w-full h-80 sm:h-96 bg-gradient-to-b from-[#1E1E1C] via-[#171716] to-[#121211] flex flex-col items-center justify-between p-6 cursor-pointer group/stage overflow-hidden border-b border-white/5"
                >
                  {/* Studio Ambient Radial Spotlight */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,rgba(89,98,56,0.18)_0%,rgba(255,255,255,0.03)_35%,transparent_70%)] pointer-events-none" />
                  
                  {/* Subtle Background Circuit / Geometric Accent */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                  {/* Top Meta Bar */}
                  <div className="w-full flex items-center justify-between z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#121211]/90 backdrop-blur-md border border-[#596238]/40 rounded text-[10px] font-mono font-bold tracking-widest text-[#9DB25E] uppercase shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8FA355]" />
                      {product.category}
                    </span>
                    <span className="text-[10px] font-mono text-[#A3A29E] uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded border border-white/5">
                      {product.servings} • {product.netWeight}
                    </span>
                  </div>

                  {/* Product Cutout Showcase with Realistic Ground Shadow */}
                  <div className="relative w-full h-56 sm:h-64 flex items-center justify-center my-auto">
                    {/* Pedestal Ground Contact Shadow */}
                    <div className="absolute bottom-2 w-48 sm:w-56 h-6 bg-black/80 rounded-full blur-md pointer-events-none group-hover/stage:scale-95 transition-transform duration-500" />
                    
                    {/* Floating Product Image */}
                    <div className="relative w-full h-full flex items-center justify-center transition-all duration-500 ease-out group-hover/stage:scale-108 group-hover/stage:-translate-y-2">
                      <Image
                        src={product.thumbnail}
                        alt={product.name}
                        fill
                        priority
                        unoptimized
                        className="object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.6)]"
                      />
                    </div>
                  </div>

                  {/* Hover Gallery Action Badge */}
                  <div className="w-full flex items-center justify-between z-10 pt-2">
                    <span className="text-[10px] font-mono text-[#777773] uppercase tracking-wider">
                      {product.batchCode}
                    </span>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#596238]/20 border border-[#596238]/40 text-[#9DB25E] text-[10px] font-mono font-bold tracking-wider uppercase group-hover/stage:bg-[#596238] group-hover/stage:text-[#F4F4F1] transition-all duration-200">
                      <Images className="w-3.5 h-3.5" />
                      <span>VIEW PACKAGING ({product.gallery.length})</span>
                    </div>
                  </div>
                </div>

                {/* 2. TITANIUM SPECS & CONVERSION SUITE */}
                <div className="p-6 sm:p-8 flex flex-col justify-between flex-1 bg-[#151514]">
                  <div>
                    {/* Product Name & Subtitle */}
                    <div className="mb-4">
                      <h3
                        onClick={() => setSelectedProduct(product)}
                        className="font-display text-2xl sm:text-3xl font-black uppercase text-[#F5F5F2] tracking-tight leading-tight mb-1.5 group-hover:text-[#9DB25E] transition-colors cursor-pointer"
                      >
                        {product.name}
                      </h3>
                      <p className="text-xs font-mono font-medium text-[#A8A7A3] uppercase tracking-wider">
                        {product.subtitle}
                      </p>
                    </div>

                    {/* Performance Specs Matrix */}
                    <div className="grid grid-cols-3 gap-2 p-3.5 bg-[#0D0D0C] border border-white/10 rounded-lg mb-6 text-center divide-x divide-white/5 shadow-inner">
                      {product.specs.map((s, i) => (
                        <div key={i} className="flex flex-col px-1">
                          <span className="text-[9px] font-mono text-[#8E8D88] uppercase tracking-wider mb-0.5">
                            {s.label}
                          </span>
                          <span className="text-base sm:text-lg font-display font-black text-[#F5F5F2]">
                            {s.value} <span className="text-[10px] font-mono text-[#9DB25E] font-bold">{s.unit}</span>
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Flavor & Guarantee Row */}
                    <div className="flex items-center justify-between pb-5 border-b border-white/10 text-xs">
                      {product.flavors.length > 1 ? (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {product.flavors.map((f) => {
                            const isSelected = (selectedCardFlavors[product.id] || product.flavors[0]?.name) === f.name;
                            return (
                              <button
                                key={f.name}
                                type="button"
                                onClick={() => setSelectedCardFlavors((prev) => ({ ...prev, [product.id]: f.name }))}
                                className={`px-2.5 py-1 rounded-md text-[11px] font-editorial font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer border ${
                                  isSelected
                                    ? "bg-[#596238] border-[#8FA355] text-white shadow-sm"
                                    : "bg-[#1E1E1C] border-white/10 text-[#A8A7A3] hover:text-white hover:border-white/25"
                                }`}
                              >
                                <span className="w-2 h-2 rounded-full border border-black/30" style={{ backgroundColor: f.color }} />
                                <span>{f.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: product.flavors[0]?.color || '#DE8A36' }} />
                          <span className="font-editorial text-xs font-semibold text-[#D4D3CD]">
                            {product.flavors[0]?.name}
                          </span>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => setSelectedProduct(product)}
                        className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono text-[#9DB25E] hover:text-white bg-[#596238]/20 hover:bg-[#596238]/35 px-2.5 py-1 rounded border border-[#596238]/40 transition-all cursor-pointer"
                        title="View Official 3rd-Party HPLC Lab Test Report"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{product.labReportUrl ? "HPLC REPORT AVAILABLE" : "HPLC VERIFIED"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Pricing & Checkout Action */}
                  <div className="pt-5 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-mono text-[#8E8D88] uppercase tracking-wider block">
                          PROTOCOL PRICE
                        </span>
                        <span className="px-1.5 py-0.2 bg-[#596238]/25 text-[#9DB25E] text-[9px] font-mono font-bold rounded border border-[#596238]/35">
                          SAVE 19%
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-display text-3xl font-black text-[#F5F5F2]">
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
                        className="p-3.5 bg-[#222220] hover:bg-[#2C2C29] border border-white/10 hover:border-white/20 text-[#F5F5F2] rounded-lg transition-colors cursor-pointer shadow-sm"
                      >
                        <Images className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => addToCart(product, 1, selectedCardFlavors[product.id] || product.flavors[0]?.name)}
                        className="px-6 py-3.5 bg-[#596238] hover:bg-[#48502B] text-[#F4F4F1] font-editorial text-xs font-bold tracking-widest uppercase transition-all duration-200 cursor-pointer rounded-lg border border-[#7C8B4C]/40 shadow-[0_4px_20px_rgba(89,98,56,0.3)] hover:shadow-[0_4px_25px_rgba(89,98,56,0.5)] hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
                      >
                        <span>ADD TO CART</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Technical Telemetry Strip */}
        <div className="mt-14 pt-6 border-t border-[#151515]/20 flex flex-wrap items-center justify-between gap-4 text-[10px] sm:text-[11px] font-mono text-[#2B2B28] uppercase tracking-wider font-semibold">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#151515] animate-ping" />
            <span className="font-bold">HPLC 3RD-PARTY CERTIFIED BATCHES</span>
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

