"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Zap, Sparkles } from "lucide-react";
import gsap from "gsap";
import ProductShowcase from "./ProductShowcase";
import Navbar from "./Navbar";
import FeatureStrip from "./FeatureStrip";
import AmbientDust from "./AmbientDust";
import { soundFX } from "@/lib/sound";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Animation Refs
  const navbarRef = useRef<HTMLElement | null>(null);
  const subtagRef = useRef<HTMLDivElement | null>(null);
  const line1Ref = useRef<HTMLSpanElement | null>(null);
  const line2Ref = useRef<HTMLSpanElement | null>(null);
  const line3Ref = useRef<HTMLSpanElement | null>(null);
  const descRef = useRef<HTMLDivElement | null>(null);
  const ctaGroupRef = useRef<HTMLDivElement | null>(null);
  const footnoteRef = useRef<HTMLDivElement | null>(null);

  // Product Showcase Refs
  const circleRef = useRef<HTMLDivElement | null>(null);
  const circleInnerRef = useRef<HTMLDivElement | null>(null);
  const wheyRef = useRef<HTMLDivElement | null>(null);
  const wheyFloatRef = useRef<HTMLDivElement | null>(null);
  const creatineRef = useRef<HTMLDivElement | null>(null);
  const creatineFloatRef = useRef<HTMLDivElement | null>(null);
  const eaaRef = useRef<HTMLDivElement | null>(null);
  const eaaFloatRef = useRef<HTMLDivElement | null>(null);

  // Parallax Refs
  const parallaxHeadlineRef = useRef<HTMLDivElement | null>(null);
  const parallaxProductRef = useRef<HTMLDivElement | null>(null);
  const parallaxCircleRef = useRef<HTMLDivElement | null>(null);
  const parallaxBgRef = useRef<HTMLDivElement | null>(null);

  // Feature Strip
  const featureStripRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(
          [
            navbarRef.current,
            subtagRef.current,
            line1Ref.current,
            line2Ref.current,
            line3Ref.current,
            descRef.current,
            ctaGroupRef.current,
            footnoteRef.current,
            circleRef.current,
            wheyRef.current,
            creatineRef.current,
            eaaRef.current,
            featureStripRef.current,
          ],
          { opacity: 1, y: 0, x: 0, scale: 1 }
        );
        return;
      }

      // =========================================================================
      // 1. HERO ENTRANCE TIMELINE
      // =========================================================================
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          initAmbientMotion();
        },
      });

      // Navbar
      if (navbarRef.current) {
        tl.fromTo(
          navbarRef.current,
          { opacity: 0, y: -15 },
          { opacity: 1, y: 0, duration: 0.6 },
          0.0
        );
      }

      // Category Sub-tag
      if (subtagRef.current) {
        tl.fromTo(
          subtagRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5 },
          0.1
        );
      }

      // Headline Lines Reveal
      if (line1Ref.current) {
        tl.fromTo(
          line1Ref.current,
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, duration: 0.55 },
          0.2
        );
      }
      if (line2Ref.current) {
        tl.fromTo(
          line2Ref.current,
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, duration: 0.55 },
          0.3
        );
      }
      if (line3Ref.current) {
        tl.fromTo(
          line3Ref.current,
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, duration: 0.55 },
          0.4
        );
      }

      // Circle Backdrop
      if (circleRef.current) {
        tl.fromTo(
          circleRef.current,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.85, ease: "power2.out" },
          0.5
        );
      }

      // Whey Tub
      if (wheyRef.current) {
        tl.fromTo(
          wheyRef.current,
          { opacity: 0, scale: 0.92, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power3.out" },
          0.58
        );
      }

      // Creatine Jar (Left)
      if (creatineRef.current) {
        tl.fromTo(
          creatineRef.current,
          { opacity: 0, y: 25, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, duration: 0.75, ease: "power3.out" },
          0.7
        );
      }

      // EAA Jar (Right)
      if (eaaRef.current) {
        tl.fromTo(
          eaaRef.current,
          { opacity: 0, y: 25, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, duration: 0.75, ease: "power3.out" },
          0.76
        );
      }

      // Description & CTA buttons
      const ctaElements = [
        descRef.current,
        ctaGroupRef.current,
        footnoteRef.current,
      ].filter(Boolean);

      if (ctaElements.length) {
        tl.fromTo(
          ctaElements,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
          0.85
        );
      }

      // Feature strip at bottom
      if (featureStripRef.current) {
        tl.fromTo(
          featureStripRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.45 },
          1.0
        );
      }

      // =========================================================================
      // 2. CONTINUOUS NONSTOP AMBIENT MOTION (Circle Breathing & 3D Product Float)
      // =========================================================================
      function initAmbientMotion() {
        // Geometric Circle Breathing
        if (circleInnerRef.current) {
          gsap.to(circleInnerRef.current, {
            scale: 1.02,
            duration: 4.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }

        // Whey Tub floating
        if (wheyFloatRef.current) {
          gsap.to(wheyFloatRef.current, {
            y: -8,
            duration: 2.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }

        // Creatine floating (out of phase for realistic physical independence)
        if (creatineFloatRef.current) {
          gsap.to(creatineFloatRef.current, {
            y: -5,
            duration: 2.1,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 0.4,
          });
        }

        // EAA floating (subtle offset float)
        if (eaaFloatRef.current) {
          gsap.to(eaaFloatRef.current, {
            y: -6,
            duration: 2.3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 0.7,
          });
        }
      }

      // =========================================================================
      // 3. MOUSE PARALLAX (Desktop only)
      // =========================================================================
      const isDesktop = window.matchMedia(
        "(min-width: 1024px) and (hover: hover)"
      ).matches;

      if (isDesktop && containerRef.current) {
        const headlineX = parallaxHeadlineRef.current
          ? gsap.quickTo(parallaxHeadlineRef.current, "x", {
              duration: 0.6,
              ease: "power2.out",
            })
          : null;
        const headlineY = parallaxHeadlineRef.current
          ? gsap.quickTo(parallaxHeadlineRef.current, "y", {
              duration: 0.6,
              ease: "power2.out",
            })
          : null;

        const productX = parallaxProductRef.current
          ? gsap.quickTo(parallaxProductRef.current, "x", {
              duration: 0.7,
              ease: "power2.out",
            })
          : null;
        const productY = parallaxProductRef.current
          ? gsap.quickTo(parallaxProductRef.current, "y", {
              duration: 0.7,
              ease: "power2.out",
            })
          : null;

        const handleMouseMove = (e: MouseEvent) => {
          const { innerWidth, innerHeight } = window;
          const normX = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
          const normY = (e.clientY / innerHeight - 0.5) * 2;

          if (productX && productY) {
            productX(normX * 8);
            productY(normY * 8);
          }
          if (headlineX && headlineY) {
            headlineX(normX * 2);
            headlineY(normY * 2);
          }
        };

        window.addEventListener("mousemove", handleMouseMove, {
          passive: true,
        });

        return () => {
          window.removeEventListener("mousemove", handleMouseMove);
        };
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-[100dvh] flex flex-col justify-between bg-[#A8A7A3] text-[#151515] relative selection:bg-[#596238] selection:text-[#F4F4F1] overflow-x-hidden"
    >
      {/* 1. TOP NAVBAR */}
      <Navbar navbarRef={navbarRef} />

      {/* 2. HERO MAIN SECTION */}
      <section className="relative w-full flex-1 flex flex-col justify-center overflow-hidden bg-[#A8A7A3] py-4 sm:py-6 lg:py-8">
        
        {/* Background Micro Grain */}
        <div
          ref={parallaxBgRef}
          className="absolute inset-0 bg-grain pointer-events-none z-0 will-change-transform"
        />

        {/* Continuous Floating Ambient Powder Particles */}
        <AmbientDust />

        {/* Main Hero Container - Spacious 2-Column Luxury Layout */}
        <div className="relative z-10 w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-16 my-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            
            {/* ========================================================================= */}
            {/* 1. LEFT COLUMN: TYPOGRAPHY & PRIMARY CTAs (6 cols) */}
            {/* ========================================================================= */}
            <div
              ref={parallaxHeadlineRef}
              className="order-2 lg:order-1 lg:col-span-6 xl:col-span-6 flex flex-col justify-center z-20 will-change-transform"
            >
              {/* Category Sub-Tag & Continuous Readable Promo Badge */}
              <div
                ref={subtagRef}
                className="flex flex-wrap items-center gap-2.5 mb-3 sm:mb-4 opacity-0 will-change-transform"
              >
                {/* Continuous Steady & High-Contrast Promo Modal Trigger */}
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    window.dispatchEvent(new CustomEvent("open-launch-promo"));
                  }}
                  className="group inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#141413] hover:bg-[#1E1E1C] border border-[#8FA355] text-[#9DB25E] rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer shadow-[0_0_15px_rgba(143,163,85,0.3)] hover:shadow-[0_0_25px_rgba(143,163,85,0.6)] hover:scale-[1.02]"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8FA355]" />
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#9DB25E] fill-current" />
                    <span>FLASH CODE: <span className="text-[#F4F4F1] bg-[#596238] px-1.5 py-0.5 rounded font-mono font-bold">LAUNCH10</span> (10% OFF)</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#9DB25E] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Commanding Huge Headline */}
              <h1 className="condensed-title text-[56px] sm:text-[80px] md:text-[96px] lg:text-[86px] xl:text-[108px] 2xl:text-[124px] font-black uppercase select-none leading-[0.84] tracking-tight">
                <span className="block overflow-hidden">
                  <span
                    ref={line1Ref}
                    className="block text-[#F4F4F1] drop-shadow-sm opacity-0 will-change-transform"
                  >
                    BUILT
                  </span>
                </span>
                <span className="block overflow-hidden">
                  <span
                    ref={line2Ref}
                    className="block text-[#F4F4F1] drop-shadow-sm opacity-0 will-change-transform"
                  >
                    UNDER
                  </span>
                </span>
                <span className="block overflow-hidden">
                  <span
                    ref={line3Ref}
                    className="block text-[#596238] drop-shadow-sm opacity-0 will-change-transform"
                  >
                    PRESSURE.
                  </span>
                </span>
              </h1>

              {/* Sub-headline / Brand Philosophy - Enriched Font Size & Contrast */}
              <div ref={descRef} className="mt-3.5 sm:mt-5 max-w-xl opacity-0 will-change-transform">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-3 h-[2px] bg-[#596238]" />
                  <p className="font-editorial text-sm sm:text-base font-bold text-[#151515] tracking-wider uppercase leading-snug">
                    ENGINEERED FOR EVERYONE.
                  </p>
                </div>
                <p className="mt-1 text-sm sm:text-base font-sans text-[#151515] font-medium leading-relaxed max-w-lg">
                  Pure microfiltered whey concentrate delivering 25g protein per scoop and German Creapure® creatine engineered for everyone who demands uncompromising bioavailability, pure quality, and measured output.
                </p>
              </div>

              {/* Action Buttons */}
              <div
                ref={ctaGroupRef}
                className="mt-6 sm:mt-7 flex flex-wrap items-center gap-3.5 opacity-0 will-change-transform"
              >
                <Link
                  href="#products"
                  className="group relative inline-flex items-center gap-2.5 px-7 sm:px-9 py-4 bg-[#151515] text-[#F4F4F1] font-editorial text-sm sm:text-base font-bold tracking-widest uppercase hover:bg-[#596238] hover:translate-x-1 transition-all duration-200 shadow-xl focus:outline-hidden rounded-xs"
                >
                  <span className="transition-transform duration-200">SHOP SUPPLEMENTS</span>
                  <ArrowRight className="w-4.5 h-4.5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    window.dispatchEvent(new CustomEvent("open-lab-reports"));
                  }}
                  className="group relative inline-flex items-center gap-2 px-7 sm:px-8 py-4 border-2 border-[#151515] bg-[#A8A7A3]/40 hover:bg-[#151515] text-[#151515] hover:text-[#F4F4F1] font-editorial text-sm sm:text-base font-bold tracking-widest uppercase transition-all duration-200 focus:outline-hidden cursor-pointer rounded-xs"
                >
                  <span>LAB RESULTS</span>
                  <ArrowUpRight className="w-4.5 h-4.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>

              {/* Technical Footnote Telemetry - Enhanced Readability */}
              <div
                ref={footnoteRef}
                className="mt-6 pt-3.5 border-t border-[#151515]/20 flex flex-wrap items-center gap-3 text-xs sm:text-sm font-mono text-[#252522] font-semibold uppercase tracking-wider opacity-0 will-change-transform"
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#596238]" />
                  BATCH: SS-2026-X
                </span>
                <span className="text-[#151515]/30">•</span>
                <span>100% DOPING FREE</span>
                <span className="text-[#151515]/30">•</span>
                <span>ZERO PROPRIETARY BLENDS</span>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* 2. RIGHT COLUMN: 3D INTERACTIVE PRODUCT SHOWCASE (6 cols) */}
            {/* ========================================================================= */}
            <div
              ref={parallaxProductRef}
              className="order-1 lg:order-2 lg:col-span-6 xl:col-span-6 relative flex items-center justify-center py-2 lg:py-0 will-change-transform"
            >
              <ProductShowcase
                circleRef={circleRef}
                circleInnerRef={circleInnerRef}
                wheyRef={wheyRef}
                wheyFloatRef={wheyFloatRef}
                creatineRef={creatineRef}
                creatineFloatRef={creatineFloatRef}
                eaaRef={eaaRef}
                eaaFloatRef={eaaFloatRef}
              />
            </div>

          </div>
        </div>
      </section>

      {/* 3. BOTTOM FEATURE STRIP WITH CONTINUOUS MARQUEE */}
      <FeatureStrip featureStripRef={featureStripRef} />
    </div>
  );
}
