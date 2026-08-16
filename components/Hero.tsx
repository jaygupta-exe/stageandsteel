"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import ProductShowcase from "./ProductShowcase";
import Navbar from "./Navbar";
import FeatureStrip from "./FeatureStrip";
import AmbientDust from "./AmbientDust";

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

      // Creatine Jar
      if (creatineRef.current) {
        tl.fromTo(
          creatineRef.current,
          { opacity: 0, y: 25, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, duration: 0.75, ease: "power3.out" },
          0.7
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
      className="min-h-screen lg:h-screen lg:max-h-screen flex flex-col justify-between bg-[#A8A7A3] text-[#151515] relative selection:bg-[#596238] selection:text-[#F4F4F1] overflow-x-hidden"
    >
      {/* 1. TOP NAVBAR */}
      <Navbar navbarRef={navbarRef} />

      {/* 2. HERO MAIN SECTION */}
      <section className="relative w-full flex-1 flex flex-col justify-center overflow-hidden bg-[#A8A7A3] py-4 lg:py-6">
        
        {/* Background Micro Grain */}
        <div
          ref={parallaxBgRef}
          className="absolute inset-0 bg-grain pointer-events-none z-0 will-change-transform"
        />

        {/* Continuous Floating Ambient Powder Particles */}
        <AmbientDust />

        {/* Main Hero Container - Spacious 2-Column Luxury Layout */}
        <div className="relative z-10 w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 my-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            
            {/* ========================================================================= */}
            {/* 1. LEFT COLUMN: TYPOGRAPHY & PRIMARY CTAs (6 cols) */}
            {/* ========================================================================= */}
            <div
              ref={parallaxHeadlineRef}
              className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center z-20 will-change-transform"
            >
              {/* Category Sub-Tag */}
              <div
                ref={subtagRef}
                className="flex items-center gap-2 mb-2 sm:mb-3 opacity-0 will-change-transform"
              >
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-[#151515] text-[#F4F4F1] border border-[#596238]/40 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#596238] animate-ping" />
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[#A8B778] uppercase">
                    STAGE PROTOCOL // 2026
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[#151515]/70 uppercase">
                  SPORTS NUTRITION LABS
                </span>
              </div>

              {/* Commanding Huge Headline */}
              <h1 className="condensed-title text-[56px] sm:text-[80px] md:text-[96px] lg:text-[90px] xl:text-[112px] 2xl:text-[128px] font-black uppercase select-none leading-[0.84] tracking-tight">
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

              {/* Sub-headline / Brand Philosophy */}
              <div ref={descRef} className="mt-3.5 sm:mt-5 max-w-lg opacity-0 will-change-transform">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2.5 h-[2px] bg-[#596238]" />
                  <p className="font-editorial text-xs sm:text-sm font-bold text-[#151515] tracking-wider uppercase leading-snug">
                    ENGINEERED FOR STAGE. BUILT ON DISCIPLINE.
                  </p>
                </div>
                <p className="mt-1 text-xs sm:text-sm font-sans text-[#151515]/80 leading-relaxed max-w-md">
                  Pure cold-microfiltered whey isolate and German Creapure® creatine engineered for athletes who demand uncompromising bioavailability and measured output.
                </p>
              </div>

              {/* Action Buttons */}
              <div
                ref={ctaGroupRef}
                className="mt-6 flex flex-wrap items-center gap-3.5 opacity-0 will-change-transform"
              >
                <Link
                  href="#"
                  className="group relative inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 bg-[#151515] text-[#F4F4F1] font-editorial text-xs sm:text-sm font-bold tracking-widest uppercase hover:bg-[#596238] hover:translate-x-1 transition-all duration-200 shadow-lg focus:outline-hidden"
                >
                  <span className="transition-transform duration-200">SHOP SUPPLEMENTS</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>

                <Link
                  href="#"
                  className="group relative inline-flex items-center gap-2 px-6 py-3.5 border border-[#151515] bg-[#A8A7A3]/30 hover:bg-[#151515] text-[#151515] hover:text-[#F4F4F1] font-editorial text-xs sm:text-sm font-bold tracking-widest uppercase transition-all duration-200 focus:outline-hidden"
                >
                  <span>LAB RESULTS</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>

              {/* Technical Footnote Telemetry */}
              <div
                ref={footnoteRef}
                className="mt-5 pt-3 border-t border-[#151515]/15 flex flex-wrap items-center gap-3 text-[10px] sm:text-[11px] font-mono text-[#555550] uppercase tracking-wider opacity-0 will-change-transform"
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#596238]" />
                  BATCH: SS-2026-X
                </span>
                <span className="text-[#151515]/20">•</span>
                <span>100% DOPING FREE</span>
                <span className="text-[#151515]/20">•</span>
                <span>ZERO PROPRIETARY BLENDS</span>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* 2. RIGHT COLUMN: 3D INTERACTIVE PRODUCT SHOWCASE (6 cols) */}
            {/* ========================================================================= */}
            <div
              ref={parallaxProductRef}
              className="lg:col-span-6 xl:col-span-6 relative flex items-center justify-center py-2 lg:py-0 will-change-transform"
            >
              <ProductShowcase
                circleRef={circleRef}
                circleInnerRef={circleInnerRef}
                wheyRef={wheyRef}
                wheyFloatRef={wheyFloatRef}
                creatineRef={creatineRef}
                creatineFloatRef={creatineFloatRef}
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
