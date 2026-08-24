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
      } else if (hash.includes("eaa") || hash.includes("amino")) {
        setActiveCategory("EAA");
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
    { id: "ALL", label: "ALL PRODUCTS", count: "05" },
    { id: "PROTEIN", label: "PROTEIN", count: "03" },
    { id: "CREATINE", label: "CREATINE", count: "01" },
    { id: "EAA", label: "EAA", count: "01" },
  ];

  const products: ProductData[] = [
    {
      id: "whey-belgian-chocolate",
      name: "STAGE WHEY - BELGIAN CHOCOLATE",
      subtitle: "MICROFILTERED 100% PURE WHEY // RICH COCOA",
      category: "PROTEIN",
      price: "₹3,499",
      originalPrice: "₹4,299",
      servings: "30 Servings",
      netWeight: "1 KG (2.2 LBS)",
      thumbnail: "/belgium-chocolate-cutout.png",
      labReportUrl: "/lab-reports/belgian-salted-caramel-test-report.png",
      gallery: [
        {
          label: "01 FRONT PACKAGING",
          url: "/whey protein/belgium chocalte/front.png",
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
        { label: "PROTEIN", value: "25", unit: "G" },
        { label: "SCOOP", value: "33", unit: "G" },
        { label: "ENERGY", value: "127.4", unit: "KCAL" },
      ],
      description:
        "Pure microfiltered Belgian Chocolate whey concentrate delivering 25g ultra-pure protein per 33g scoop (127.4 kcal) with decadent European cocoa. Formulated for rapid bio-availability, accelerated muscular hypertrophy, and optimal recovery.",
      nutritionFacts: [
        { name: "Protein per Scoop (33g)", amount: "25g", dailyValue: "50%" },
        { name: "Energy / Calories", amount: "127.4 kcal" },
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
      category: "PROTEIN",
      price: "₹2,599",
      originalPrice: "₹4,299",
      servings: "28 Servings",
      netWeight: "1 KG (2.2 LBS)",
      thumbnail: "/mocha-protein-cutout.png",
      gallery: [
        {
          label: "01 FRONT PACKAGING",
          url: "/whey protein/mocha protein/front.png",
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
        { label: "PROTEIN", value: "24.6", unit: "G" },
        { label: "SCOOP", value: "35", unit: "G" },
        { label: "ENERGY", value: "124.61", unit: "KCAL" },
      ],
      description:
        "Artisanal roast Cafe Mocha whey concentrate combining 24.6g ultra-clean microfiltered protein per 35g scoop (124.61 kcal) with authentic coffee aroma. 28 servings per box. Naturally sweetened with premium Monk Fruit extract for clean bio-availability without sugar spikes.",
      nutritionFacts: [
        { name: "Protein per Scoop (35g)", amount: "24.6g", dailyValue: "49%" },
        { name: "Energy / Calories", amount: "124.61 kcal" },
        { name: "Servings per Box", amount: "28 Servings" },
        { name: "Scoop Size", amount: "35g" },
        { name: "BCAAs (Leucine, Isoleucine, Valine)", amount: "5.5g" },
        { name: "EAAs (Essential Amino Acids)", amount: "11.7g" },
        { name: "Total Carbohydrates", amount: "2.2g" },
        { name: "Dietary Fat", amount: "1.4g" },
        { name: "Sweetener", amount: "Natural Monk Fruit Extract" },
        { name: "DigeZyme® Multi-Enzyme Complex", amount: "100mg" },
      ],
      suggestedUse:
        "Mix 1 scoop (35g) with 200–250ml ice-cold water or milk in a shaker cup. Perfect as a morning kickstarter or high-octane post-workout fuel.",
    },
    {
      id: "whey-salted-caramel",
      name: "STAGE WHEY - SALTED CARAMEL",
      subtitle: "MICROFILTERED 100% PURE WHEY MATRIX",
      category: "PROTEIN",
      price: "₹3,499",
      originalPrice: "₹4,299",
      servings: "30 Servings",
      netWeight: "1 KG (2.2 LBS)",
      thumbnail: "/salted-caramel-cutout.png",
      labReportUrl: "/lab-reports/belgian-salted-caramel-test-report.png",
      gallery: [
        {
          label: "01 FRONT PACKAGING",
          url: "/salted-caramel/front.png",
        },
        {
          label: "02 NUTRITION & AMINO PROFILE",
          url: "/salted-caramel/nutrition.png",
        },
        {
          label: "03 INGREDIENTS & USAGE",
          url: "/salted-caramel/directions.png",
        },
        {
          label: "04 LAB TEST REPORT (COA)",
          url: "/lab-reports/belgian-salted-caramel-test-report.png",
        },
      ],
      accentColor: "#DE8A36",
      batchCode: "BATCH SS-2026-SC",
      flavors: [
        { name: "Salted Caramel", color: "#DE8A36", inStock: true },
      ],
      specs: [
        { label: "PROTEIN", value: "25", unit: "G" },
        { label: "SCOOP", value: "33", unit: "G" },
        { label: "ENERGY", value: "127.4", unit: "KCAL" },
      ],
      description:
        "Pure microfiltered whey protein blend delivering 25g ultra-clean protein per 33g scoop (127.4 kcal) with 6.1g BCAAs in rich, decadent European Salted Caramel flavor. Fast-digesting formula designed for rapid muscular recovery and accelerated hypertrophy.",
      nutritionFacts: [
        { name: "Protein per Scoop (33g)", amount: "25g", dailyValue: "50%" },
        { name: "Energy / Calories", amount: "127.4 kcal" },
        { name: "Scoop Size", amount: "33g" },
        { name: "BCAAs (Leucine 2.9g, Isoleucine 1.6g, Valine 1.6g)", amount: "6.1g" },
        { name: "Essential Amino Acids (Lysine, Threonine, etc.)", amount: "6.55g" },
        { name: "Total Carbohydrates", amount: "4.0g" },
        { name: "Dietary Fat", amount: "1.8g" },
        { name: "Potassium / Sodium", amount: "230mg / 150mg" },
      ],
      suggestedUse:
        "Mix 1 level scoop (33g) with 200–250ml chilled water or skimmed milk in a shaker cup. Shake vigorously for 30 seconds. Consume immediately post-workout or between meals.",
    },
    {
      id: "creapure-creatine",
      name: "STAGE CREATINE MONOHYDRATE",
      subtitle: "GERMAN MICRONIZED MONOHYDRATE (200 MESH)",
      category: "CREATINE",
      price: "₹899",
      originalPrice: "₹1,299",
      servings: "85 Servings",
      netWeight: "300G (0.66 LBS)",
      thumbnail: "/creatine-cutout.png",
      flavorThumbnails: {
        "Orange": "/creatine-cutout.png",
        "Pineapple": "/pineapple-creatine-cutout.png",
      },
      gallery: [
        {
          label: "01 FRONT PACKAGING (ORANGE)",
          url: "/creatine/front.png",
        },
        {
          label: "02 NUTRITION FACTS",
          url: "/creatine/nutrition.png",
        },
        {
          label: "03 DIRECTIONS & USAGE",
          url: "/creatine/usage.png",
        },
      ],
      flavorGalleries: {
        "Orange": [
          {
            label: "01 FRONT PACKAGING (ORANGE)",
            url: "/creatine/front.png",
          },
          {
            label: "02 NUTRITION FACTS",
            url: "/creatine/nutrition.png",
          },
          {
            label: "03 DIRECTIONS & USAGE",
            url: "/creatine/usage.png",
          },
        ],
        "Pineapple": [
          {
            label: "01 FRONT PACKAGING (PINEAPPLE)",
            url: "/creatine/pineapple-front.png",
          },
          {
            label: "02 NUTRITION FACTS",
            url: "/creatine/nutrition.png",
          },
          {
            label: "03 DIRECTIONS & USAGE",
            url: "/creatine/usage.png",
          },
        ],
      },
      accentColor: "#DE8A36",
      batchCode: "BATCH CR-2026-GER",
      flavors: [
        { name: "Orange", color: "#FF7A00", inStock: true },
        { name: "Pineapple", color: "#FFD000", inStock: true },
      ],
      specs: [
        { label: "CREATINE", value: "3000", unit: "MG" },
        { label: "VITAMIN C", value: "40", unit: "MG" },
        { label: "SERVINGS", value: "85", unit: "SCOOPS" },
      ],
      description:
        "Stage & Steel Premium Grade Micronized Creatine Monohydrate in refreshing Orange & Pineapple flavors. Enhanced with 40mg Vitamin C per scoop to combat oxidative stress, improve absorption, and power explosive ATP muscular endurance across 85 full servings.",
      nutritionFacts: [
        { name: "Creatine Monohydrate (Pure Micronized)", amount: "3,000mg" },
        { name: "Vitamin C (Antioxidant Complex)", amount: "40mg (50% RDA)" },
        { name: "Carbohydrates", amount: "0.1g" },
        { name: "Energy / Calories", amount: "0.4 kcal" },
        { name: "Protein / Dietary Fat", amount: "0g" },
        { name: "Sodium", amount: "0mg" },
      ],
      suggestedUse:
        "Mix 1 scoop (3.5g) with 200–250ml cold water or your preferred beverage. Consume once daily, preferably post-workout or at any convenient time on non-training days.",
    },
    {
      id: "stage-eaa-cola",
      name: "STAGE ESSENTIAL AMINO ACIDS (EAA)",
      subtitle: "FULL SPECTRUM 9 EAAS // ELECTROLYTE HYDRATION",
      category: "EAA",
      price: "₹1,199",
      originalPrice: "₹1,599",
      servings: "30 Servings",
      netWeight: "255G (0.56 LBS)",
      thumbnail: "/eaa-cutout.png",
      gallery: [
        {
          label: "01 FRONT PACKAGING",
          url: "/eaa/front.png",
        },
        {
          label: "02 AMINO & FACTS",
          url: "/eaa/nutrition.png",
        },
        {
          label: "03 USAGE & DIRECTIONS",
          url: "/eaa/usage.png",
        },
        {
          label: "04 3D BOTTLE VIEW",
          url: "/eaa/trio.png",
        },
      ],
      accentColor: "#8B1E0F",
      batchCode: "BATCH EAA-2026-COLA",
      flavors: [
        { name: "Cola Flavor", color: "#63170D", inStock: true },
      ],
      specs: [
        { label: "EAAS", value: "6.45", unit: "G" },
        { label: "BCAAS", value: "4000", unit: "MG" },
        { label: "HYDRATION", value: "ELECTROLYTES" },
      ],
      description:
        "Stage & Steel Premium Grade Essential Amino Acids (EAA) in refreshing Cola Flavor. Scientifically formulated blend of all 9 essential amino acids with crucial electrolytes (Sodium & Potassium) designed to fuel intra-workout endurance, prevent muscle breakdown, and accelerate recovery.",
      nutritionFacts: [
        { name: "L-Leucine (Instantized BCAA)", amount: "2,000mg" },
        { name: "L-Isoleucine (BCAA)", amount: "1,000mg" },
        { name: "L-Valine (BCAA)", amount: "1,000mg" },
        { name: "L-Lysine", amount: "950mg" },
        { name: "L-Threonine", amount: "825mg" },
        { name: "L-Histidine", amount: "275mg" },
        { name: "L-Methionine", amount: "150mg" },
        { name: "L-Phenylalanine", amount: "125mg" },
        { name: "L-Tryptophan", amount: "125mg" },
        { name: "Sodium Chloride (Hydration)", amount: "200mg" },
        { name: "Potassium Chloride (Electrolyte)", amount: "175mg" },
        { name: "Energy / Sugars", amount: "0.6 kcal / 0g" },
      ],
      suggestedUse:
        "Mix 1 scoop (8.5g) with 200–250ml cold water or your preferred beverage. Consume before, during (intra-workout), or immediately after workout.",
    },
  ];

  const filteredProducts =
    activeCategory === "ALL"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <section
      id="products"
      className="relative w-full py-20 sm:py-28 bg-[#A8A7A3] text-[#151515] border-t border-[#151515]/10 overflow-hidden"
    >
      {/* Background Decorative Grain & Faint Grid */}
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-40" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#15151508_1px,transparent_1px),linear-gradient(to_bottom,#15151508_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-16 relative z-10">
        
        {/* Section Header - Clean, Bold & Highly Readable */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-[#151515]/20">
          <div>
            <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase text-[#151515] tracking-tight leading-[0.92]">
              FORMULATED UNDER <br />
              <span className="text-[#151515] relative inline-block">
                DISCIPLINE.
                <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-[#151515]" />
              </span>
            </h2>
          </div>

          <div className="flex flex-col gap-3 max-w-lg">
            <p className="text-sm sm:text-base font-sans text-[#151515] leading-relaxed font-semibold">
              Pure microfiltered compounds calibrated for everyone who demands zero proprietary blends, measured bio-availability, and absolute performance output.
            </p>
            <div className="flex items-center gap-4 text-xs sm:text-sm font-mono text-[#151515] uppercase tracking-wider font-bold">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#596238]" /> 100% TRANSPARENT LABELS
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
                  className={`relative px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-sans font-bold tracking-wide uppercase transition-all duration-200 cursor-pointer rounded-md flex items-center gap-2 ${
                    isActive
                      ? "bg-[#596238] text-[#F4F4F1] shadow-lg border border-[#7C8B4C]/40"
                      : "text-[#151515] hover:text-black hover:bg-[#151515]/10"
                  }`}
                >
                  {isActive && <span className="w-2 h-2 rounded-full bg-[#9DB25E] animate-pulse" />}
                  <span>{cat.label}</span>
                  <span className={`text-xs font-mono px-1.5 py-0.5 rounded font-bold ${
                    isActive ? "bg-black/20 text-[#F4F4F1]" : "bg-[#151515]/15 text-[#151515]"
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs sm:text-sm font-mono text-[#20201D] font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 animate-pulse" />
            <span className="tracking-wider uppercase">LIVE INVENTORY // ALL PRODUCTS IN STOCK</span>
          </div>
        </div>

        {/* Two-Column Flagship Cards - Modern Luxury Monolithic Design */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 max-w-6xl mx-auto">
          {filteredProducts.map((product) => {
            const currentSelectedFlavor = selectedCardFlavors[product.id] || product.flavors[0]?.name || "Standard";
            const currentThumbnail =
              (product.flavorThumbnails && currentSelectedFlavor && product.flavorThumbnails[currentSelectedFlavor]) ||
              product.thumbnail;
            const currentGallery =
              (product.flavorGalleries && currentSelectedFlavor && product.flavorGalleries[currentSelectedFlavor]) ||
              product.gallery;

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
                  className="relative w-full h-[360px] sm:h-[420px] bg-gradient-to-b from-[#1E1E1C] via-[#171716] to-[#121211] flex flex-col items-center justify-between p-5 sm:p-6 cursor-pointer group/stage overflow-hidden border-b border-white/5"
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
                  <div className="relative w-full h-64 sm:h-76 flex items-center justify-center my-auto">
                    {/* Pedestal Ground Contact Shadow */}
                    <div className="absolute bottom-2 w-52 sm:w-64 h-6 bg-black/80 rounded-full blur-md pointer-events-none group-hover/stage:scale-95 transition-transform duration-500" />
                    
                    {/* Floating Product Image */}
                    <div className="relative w-full h-full flex items-center justify-center transition-all duration-500 ease-out group-hover/stage:scale-108 group-hover/stage:-translate-y-2">
                      <Image
                        src={currentThumbnail}
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
                      <span>VIEW PACKAGING ({currentGallery.length})</span>
                    </div>
                  </div>
                </div>

                {/* 2. TITANIUM SPECS & CONVERSION SUITE */}
                <div className="p-6 sm:p-8 flex flex-col justify-between flex-1 bg-[#151514]">
                  <div>
                    {/* 1. TOP: PROMINENT PRODUCT PRICE ROW (User: "aur price upar ana chahiye baki sb niche") */}
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                      <div>
                        <span className="text-[10px] font-mono text-[#8E8D88] uppercase tracking-wider block font-bold">
                          PRODUCT PRICE
                        </span>
                        <div className="flex items-baseline gap-2.5 mt-0.5">
                          <span className="font-sans text-3xl sm:text-4xl font-extrabold text-[#F5F5F2] tracking-tight">
                            {product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm font-mono line-through text-[#777773]">
                              {product.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="px-2.5 py-0.5 bg-[#596238]/30 text-[#9DB25E] text-[11px] font-mono font-bold rounded border border-[#596238]/40">
                          SAVE 19%
                        </span>
                        <span className="text-[10px] font-mono text-[#8E8D88] uppercase">
                          FREE DELIVERY
                        </span>
                      </div>
                    </div>

                    {/* Product Name & Subtitle - Clean Sans-Serif Font */}
                    <div className="mb-4">
                      <h3
                        onClick={() => setSelectedProduct(product)}
                        className="font-sans text-xl sm:text-2xl font-bold uppercase text-[#F5F5F2] tracking-tight leading-tight mb-1.5 group-hover:text-[#9DB25E] transition-colors cursor-pointer"
                      >
                        {product.name}
                      </h3>
                      <p className="text-xs font-mono font-medium text-[#A8A7A3] uppercase tracking-wider">
                        {product.subtitle}
                      </p>
                    </div>

                    {/* Performance Specs Matrix - Clean Readability */}
                    <div className="grid grid-cols-3 gap-2 p-3.5 bg-[#0D0D0C] border border-white/10 rounded-lg mb-5 text-center divide-x divide-white/5 shadow-inner">
                      {product.specs.map((s, i) => (
                        <div key={i} className="flex flex-col px-1">
                          <span className="text-[10px] font-mono text-[#8E8D88] uppercase tracking-wider mb-0.5 font-semibold">
                            {s.label}
                          </span>
                          <span className="text-base sm:text-lg font-sans font-bold text-[#F5F5F2]">
                            {s.value} <span className="text-[11px] font-mono text-[#9DB25E] font-bold">{s.unit}</span>
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Flavor & Guarantee Row */}
                    <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs">
                      {product.flavors.length > 1 ? (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {product.flavors.map((f) => {
                            const isSelected = (selectedCardFlavors[product.id] || product.flavors[0]?.name) === f.name;
                            return (
                              <button
                                key={f.name}
                                type="button"
                                onClick={() => setSelectedCardFlavors((prev) => ({ ...prev, [product.id]: f.name }))}
                                className={`px-2.5 py-1 rounded-md text-[11px] font-sans font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer border ${
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
                          <span className="font-sans text-xs font-semibold text-[#D4D3CD]">
                            {product.flavors[0]?.name}
                          </span>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.dispatchEvent(new CustomEvent("open-lab-reports", { detail: product.id.includes("creatine") ? "creapure-creatine-coa" : "whey-matrix-coa" }));
                        }}
                        className="flex items-center gap-1.5 text-xs font-mono text-[#9DB25E] hover:text-white bg-[#596238]/20 hover:bg-[#596238]/40 px-3 py-1.5 rounded border border-[#596238]/40 transition-all cursor-pointer font-semibold"
                        title="View Official 3rd-Party HPLC Lab Test Report"
                      >
                        <Check className="w-4 h-4" />
                        <span>{product.labReportUrl ? "VIEW LAB REPORT" : "HPLC VERIFIED"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Bottom Action Suite: View Packaging & ADD TO CART */}
                  <div className="pt-5 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(product)}
                      title="View Packaging & Supplement Facts"
                      className="px-4 py-3.5 bg-[#222220] hover:bg-[#2C2C29] border border-white/10 hover:border-white/20 text-[#F5F5F2] rounded-lg transition-colors cursor-pointer text-xs font-mono font-bold flex items-center gap-2"
                    >
                      <Images className="w-4 h-4" />
                      <span className="hidden sm:inline">PACKAGING</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        addToCart(
                          {
                            ...product,
                            thumbnail: currentThumbnail,
                          },
                          1,
                          currentSelectedFlavor
                        )
                      }
                      className="flex-1 py-3.5 bg-[#596238] hover:bg-[#48502B] text-[#F4F4F1] font-sans text-xs sm:text-sm font-bold tracking-widest uppercase transition-all duration-200 cursor-pointer rounded-lg border border-[#7C8B4C]/40 shadow-[0_4px_20px_rgba(89,98,56,0.3)] hover:shadow-[0_4px_25px_rgba(89,98,56,0.5)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <span>ADD TO CART</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
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
        initialFlavor={selectedProduct ? selectedCardFlavors[selectedProduct.id] : undefined}
      />
    </section>
  );
}

