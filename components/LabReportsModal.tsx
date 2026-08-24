"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  ShieldCheck,
  CheckCircle2,
  Download,
  ExternalLink,
  Award,
  FlaskConical,
  Sparkles,
} from "lucide-react";
import { soundFX } from "@/lib/sound";

interface LabReportData {
  id: string;
  productName: string;
  category: string;
  batchCode: string;
  testDate: string;
  testedProtein: string;
  labelClaim: string;
  purityScore: string;
  heavyMetals: string;
  imageUrl: string;
  labName: string;
  summaryPoints: string[];
}

const LAB_REPORTS: LabReportData[] = [
  {
    id: "whey-matrix-coa",
    productName: "100% Microfiltered Whey Protein (Belgian Chocolate & Salted Caramel)",
    category: "PROTEIN",
    batchCode: "BATCH SS-2026-BC/SC",
    testDate: "JANUARY 2026",
    testedProtein: "25.1g per 33g Scoop",
    labelClaim: "25.0g per Scoop (100.4% Accuracy)",
    purityScore: "99.8% Pure HPLC Verified",
    heavyMetals: "NIL / UNDETECTED (Lead, Cadmium, Arsenic)",
    imageUrl: "/lab-reports/belgian-salted-caramel-test-report.png",
    labName: "National Analytical Testing Laboratory (NABL Accredited)",
    summaryPoints: [
      "Protein Content Verified: 25.1g / 33g serving (Zero Amino Spiking)",
      "Heavy Metal Screening: Lead <0.01 ppm, Mercury <0.005 ppm (100% Safe)",
      "Microbial Analysis: Salmonella & E. coli Absent / Negative",
      "WADA & FSSAI 2026 Doping-Free Benchmark Compliance Passed",
    ],
  },
  {
    id: "creapure-creatine-coa",
    productName: "German Micronized Creatine Monohydrate (200 Mesh)",
    category: "CREATINE",
    batchCode: "BATCH CR-2026-GER",
    testDate: "JANUARY 2026",
    testedProtein: "3,000mg Pure Creatine + 40mg Vit C",
    labelClaim: "3,000mg Creatine (100% Label Match)",
    purityScore: "99.9% Micronized Purity",
    heavyMetals: "NIL / BELOW DETECTION LIMIT",
    imageUrl: "/lab-reports/belgian-salted-caramel-test-report.png",
    labName: "Independent HPLC Analytical Laboratories",
    summaryPoints: [
      "Pure Micronized Monohydrate 200 Mesh: Instant Solubility Guaranteed",
      "Creatinine & DCD Impurities: <0.001% (German Creapure Grade Standard)",
      "Enriched with 40mg Vitamin C for Rapid Cellular Bio-Absorption",
      "Zero Fillers, Zero Added Sugars, Zero Artificial Dyes",
    ],
  },
];

export default function LabReportsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeReportIdx, setActiveReportIdx] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOpenModal = (e: Event) => {
      const customEvent = e as CustomEvent<string | undefined>;
      if (customEvent.detail) {
        const foundIdx = LAB_REPORTS.findIndex((r) => r.id === customEvent.detail);
        if (foundIdx !== -1) setActiveReportIdx(foundIdx);
      }
      setZoomLevel(1);
      setPanPosition({ x: 0, y: 0 });
      setIsOpen(true);
    };

    window.addEventListener("open-lab-reports", handleOpenModal);
    return () => window.removeEventListener("open-lab-reports", handleOpenModal);
  }, []);

  // Keyboard navigation & Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
      if (e.key === "+" || e.key === "=") {
        handleZoomIn();
      }
      if (e.key === "-") {
        handleZoomOut();
      }
      if (e.key === "0") {
        handleResetZoom();
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
  }, [isOpen]);

  const handleClose = () => {
    soundFX.playClick();
    setIsOpen(false);
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    soundFX.playClick();
    setZoomLevel((prev) => Math.min(3.5, Number((prev + 0.35).toFixed(2))));
  };

  const handleZoomOut = () => {
    soundFX.playClick();
    setZoomLevel((prev) => {
      const next = Math.max(1, Number((prev - 0.35).toFixed(2)));
      if (next === 1) setPanPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    soundFX.playClick();
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      setPanPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!isOpen) return null;

  const currentReport = LAB_REPORTS[activeReportIdx] || LAB_REPORTS[0];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 lg:p-8 animate-in fade-in duration-200 select-none">
      {/* Main Modal Window */}
      <div className="relative w-full max-w-[1360px] max-h-[95vh] bg-[#141413] text-[#F4F4F1] border border-white/15 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-8 py-4 border-b border-white/10 bg-[#0E0E0D] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#596238]/30 border border-[#8FA355] flex items-center justify-center text-[#9DB25E]">
              <FlaskConical className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#9DB25E] uppercase font-bold">
                <span className="w-2 h-2 rounded-full bg-[#8FA355] animate-pulse" />
                <span>STAGE &amp; STEEL LAB // 3RD-PARTY HPLC CERTIFICATES (COA)</span>
              </div>
              <h2 className="text-lg sm:text-xl font-editorial font-bold uppercase text-white tracking-wide">
                OFFICIAL LABORATORY TEST REPORTS
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={currentReport.imageUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#222220] hover:bg-[#2C2C29] border border-white/10 text-white rounded-lg text-xs font-mono font-semibold uppercase transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>OPEN ORIGINAL</span>
            </a>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close lab report"
              className="p-2 bg-[#222220] hover:bg-[#596238] text-white rounded-lg border border-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Product Certificate Selector Tabs */}
        <div className="px-5 sm:px-8 py-3 bg-[#181917] border-b border-white/10 flex items-center gap-3 overflow-x-auto shrink-0">
          {LAB_REPORTS.map((report, idx) => {
            const isActive = idx === activeReportIdx;
            return (
              <button
                key={report.id}
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  setActiveReportIdx(idx);
                  setZoomLevel(1);
                  setPanPosition({ x: 0, y: 0 });
                }}
                className={`px-4 py-2.5 text-xs sm:text-sm font-sans font-bold uppercase tracking-wide rounded-lg transition-all flex items-center gap-2 shrink-0 cursor-pointer border ${
                  isActive
                    ? "bg-[#596238] border-[#8FA355] text-white shadow-md"
                    : "bg-[#101110] border-white/10 text-[#A8A7A3] hover:text-white hover:border-white/30"
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-[#9DB25E]" />
                <span>{report.category}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Main Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden min-h-0">
          {/* LEFT: Interactive High-Resolution Zoomable Certificate Viewer (7 cols) */}
          <div className="lg:col-span-7 relative bg-[#0A0A09] flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 overflow-hidden min-h-[380px] sm:min-h-[480px]">
            {/* Top Viewer Controls Overlay */}
            <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
              <div className="px-3 py-1.5 bg-[#121211]/90 backdrop-blur-md border border-white/15 rounded-lg text-[11px] font-mono font-bold text-white shadow-lg pointer-events-auto flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>ZOOM: {Math.round(zoomLevel * 100)}%</span>
                {zoomLevel > 1 && (
                  <span className="text-[10px] text-[#9DB25E] font-normal hidden sm:inline">
                    (Click &amp; Drag to Pan)
                  </span>
                )}
              </div>

              {/* Floating Zoom Action Toolbar */}
              <div className="flex items-center gap-1.5 p-1 bg-[#121211]/90 backdrop-blur-md border border-white/15 rounded-lg shadow-xl pointer-events-auto">
                <button
                  type="button"
                  onClick={handleZoomIn}
                  title="Zoom In (+)"
                  className="p-2 text-white hover:bg-[#596238] rounded-md transition-colors cursor-pointer"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleZoomOut}
                  title="Zoom Out (-)"
                  className="p-2 text-white hover:bg-[#596238] rounded-md transition-colors cursor-pointer"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleResetZoom}
                  title="Reset Zoom (0)"
                  className="p-2 text-white hover:bg-[#596238] rounded-md transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <a
                  href={currentReport.imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  title="View Full Resolution"
                  className="p-2 text-white hover:bg-[#596238] rounded-md transition-colors cursor-pointer"
                >
                  <Maximize2 className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Interactive Image Canvas */}
            <div
              ref={imageContainerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className={`relative w-full h-full flex items-center justify-center p-4 overflow-hidden ${
                zoomLevel > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-zoom-in"
              }`}
              onClick={(e) => {
                if (zoomLevel === 1) handleZoomIn();
              }}
            >
              <div
                style={{
                  transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
                  transition: isDragging ? "none" : "transform 0.2s cubic-bezier(0.2, 0, 0.2, 1)",
                }}
                className="relative w-full h-full max-h-[560px] flex items-center justify-center will-change-transform"
              >
                <Image
                  src={currentReport.imageUrl}
                  alt={currentReport.productName}
                  fill
                  priority
                  unoptimized
                  className="object-contain filter drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
                />
              </div>
            </div>

            {/* Bottom Viewer Guidance Footer */}
            <div className="px-4 py-2.5 bg-[#0E0E0D] border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#8E8D88] shrink-0">
              <span>NABL ACCREDITED LAB TESTING • AOAC HPLC VERIFIED</span>
              <span className="hidden sm:inline text-[#9DB25E] font-bold">100% UNCOMPROMISED ACCURACY</span>
            </div>
          </div>

          {/* RIGHT: Analytical Certificate Findings & Breakdown (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 bg-[#151514] overflow-y-auto">
            <div className="space-y-6">
              {/* Product Heading */}
              <div>
                <span className="text-xs font-mono text-[#9DB25E] uppercase tracking-widest font-bold block mb-1">
                  OFFICIAL CERTIFICATE OF ANALYSIS
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-black uppercase text-[#F5F5F2] leading-tight mb-2">
                  {currentReport.productName}
                </h3>
                <p className="text-xs font-mono text-[#8E8D88] uppercase">
                  {currentReport.labName} • {currentReport.testDate}
                </p>
              </div>

              {/* Verified Metrics Matrix */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-[#0D0D0C] border border-white/10 rounded-xl">
                  <span className="text-[10px] font-mono text-[#8E8D88] uppercase block mb-1">
                    TESTED PROTEIN / PURITY
                  </span>
                  <span className="font-display text-xl font-black text-[#9DB25E] block">
                    {currentReport.testedProtein}
                  </span>
                  <span className="text-[10px] font-mono text-[#D4D3CD]">
                    {currentReport.labelClaim}
                  </span>
                </div>

                <div className="p-3.5 bg-[#0D0D0C] border border-white/10 rounded-xl">
                  <span className="text-[10px] font-mono text-[#8E8D88] uppercase block mb-1">
                    HEAVY METALS SCREEN
                  </span>
                  <span className="font-display text-xl font-black text-emerald-400 block">
                    PASSED / NIL
                  </span>
                  <span className="text-[10px] font-mono text-[#D4D3CD]">
                    {currentReport.heavyMetals}
                  </span>
                </div>
              </div>

              {/* Key Verification Bullet Points */}
              <div className="p-4 sm:p-5 bg-[#0D0D0C] border border-[#596238]/40 rounded-xl space-y-3">
                <span className="text-[11px] font-mono text-[#9DB25E] uppercase font-bold tracking-wider block flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#9DB25E]" />
                  LAB FINDINGS &amp; CERTIFICATION
                </span>
                <ul className="space-y-2 text-xs font-sans text-[#D4D3CD]">
                  {currentReport.summaryPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-[#9DB25E] shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Brand Transparency Commitment */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#9DB25E] shrink-0 mt-0.5" />
                <div className="text-xs font-sans text-[#C4C3BE] leading-relaxed">
                  <strong className="text-white font-semibold block mb-0.5">
                    Our Uncompromising Transparency Promise
                  </strong>
                  Every single batch produced by Stage &amp; Steel undergoes independent 3rd-party HPLC testing before release. Zero proprietary blends, zero amino-spiking, and 100% label honesty.
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 mt-6 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
              <a
                href={currentReport.imageUrl}
                download={`Stage_and_Steel_${currentReport.category}_COA.png`}
                className="w-full sm:flex-1 py-3.5 bg-[#596238] hover:bg-[#48502B] text-white font-editorial text-xs font-bold tracking-widest uppercase rounded-xl transition-all flex items-center justify-center gap-2 border border-[#7C8B4C]/40 shadow-lg cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>DOWNLOAD REPORT (COA)</span>
              </a>

              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#222220] hover:bg-[#2C2C29] text-[#F4F4F1] font-editorial text-xs font-bold tracking-widest uppercase rounded-xl border border-white/10 transition-colors cursor-pointer"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
