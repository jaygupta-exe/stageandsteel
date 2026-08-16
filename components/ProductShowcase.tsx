"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";

interface ProductShowcaseProps {
  circleRef?: React.RefObject<HTMLDivElement | null>;
  circleInnerRef?: React.RefObject<HTMLDivElement | null>;
  wheyRef?: React.RefObject<HTMLDivElement | null>;
  wheyFloatRef?: React.RefObject<HTMLDivElement | null>;
  creatineRef?: React.RefObject<HTMLDivElement | null>;
  creatineFloatRef?: React.RefObject<HTMLDivElement | null>;
  parallaxRef?: React.RefObject<HTMLDivElement | null>;
}

export default function ProductShowcase({
  circleRef,
  circleInnerRef,
  wheyRef,
  wheyFloatRef,
  creatineRef,
  creatineFloatRef,
  parallaxRef,
}: ProductShowcaseProps) {
  const container3DRef = useRef<HTMLDivElement | null>(null);
  const card3DRef = useRef<HTMLDivElement | null>(null);

  // 3D Touch & Mouse Tilt for Mobile & Desktop
  useEffect(() => {
    const el = container3DRef.current;
    const card = card3DRef.current;
    if (!el || !card) return;

    const setRotateX = gsap.quickTo(card, "rotationX", {
      duration: 0.5,
      ease: "power2.out",
    });
    const setRotateY = gsap.quickTo(card, "rotationY", {
      duration: 0.5,
      ease: "power2.out",
    });

    const handlePointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      // 3D tilt angles
      setRotateY(x * 24); // max 12 deg tilt
      setRotateX(-y * 24);
    };

    const handlePointerLeave = () => {
      setRotateX(0);
      setRotateY(0);
    };

    el.addEventListener("pointermove", handlePointerMove, { passive: true });
    el.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      el.removeEventListener("pointermove", handlePointerMove);
      el.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <div
      ref={container3DRef}
      className="relative w-full h-full flex items-center justify-center min-h-[320px] sm:min-h-[420px] lg:min-h-[480px] xl:min-h-[540px] select-none py-2 lg:py-0 [perspective:1000px] cursor-grab active:cursor-grabbing"
    >
      {/* 1. Large Geometric Circular Backdrop with Continuous Nonstop Rotation */}
      <div
        ref={circleRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0"
      >
        {/* Outer Continuous Rotating Dashed Orbit Ring */}
        <div className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[460px] lg:h-[460px] xl:w-[520px] xl:h-[520px] rounded-full border border-dashed border-[#151515]/20 flex items-center justify-center animate-[spin_60s_linear_infinite]">
          <span className="absolute top-0 w-2.5 h-2.5 rounded-full bg-[#596238] shadow-[0_0_8px_rgba(89,98,56,0.6)]" />
          <span className="absolute bottom-0 w-2 h-2 rounded-full bg-[#151515]/40" />
        </div>

        {/* Counter-Rotating Precision Ring */}
        <div className="absolute w-[280px] h-[280px] sm:w-[370px] sm:h-[370px] lg:w-[430px] lg:h-[430px] xl:w-[480px] xl:h-[480px] rounded-full border border-[#151515]/10 animate-[spin_45s_linear_infinite_reverse]" />
        
        {/* Main Geometric Dark Studio Circle with Breathing Animation */}
        <div
          ref={circleInnerRef}
          className="absolute w-[250px] h-[250px] sm:w-[340px] sm:h-[340px] lg:w-[400px] lg:h-[400px] xl:w-[450px] xl:h-[450px] rounded-full bg-[#585752] shadow-[inset_0_4px_30px_rgba(0,0,0,0.5)] overflow-hidden flex items-center justify-center will-change-transform"
        >
          {/* Inner Concentric Detail Ring */}
          <div className="w-[170px] h-[170px] sm:w-[250px] sm:h-[250px] lg:w-[300px] lg:h-[300px] xl:w-[350px] xl:h-[350px] rounded-full border border-[#F4F4F1]/15" />
          
          {/* Technical Radial Crosshairs */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#F4F4F1]" />
            <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-[#F4F4F1]" />
          </div>

          {/* Continuous Subtle Radar Sweep */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#596238]/20 to-transparent animate-[spin_10s_linear_infinite] origin-center opacity-60 pointer-events-none" />
        </div>
      </div>

      {/* 2. 3D Interactive Products Composition Stage with Preserved 3D Depth */}
      <div
        ref={card3DRef}
        className="relative z-10 w-full max-w-[360px] sm:max-w-[440px] lg:max-w-[500px] h-[300px] sm:h-[400px] lg:h-[460px] xl:h-[520px] flex items-center justify-center [transform-style:preserve-3d] will-change-transform"
      >
        {/* Realistic Ambient Studio Ground Shadows */}
        <div className="absolute bottom-2 sm:bottom-4 w-[80%] h-7 contact-shadow rounded-full blur-md opacity-90 pointer-events-none [transform:translateZ(0px)]" />
        <div className="absolute bottom-1 left-4 sm:left-6 w-[40%] h-5 contact-shadow rounded-full blur-sm opacity-95 pointer-events-none [transform:translateZ(0px)]" />

        {/* MAIN PRODUCT: Stage & Steel Whey Protein Tub (Center / Dominant) */}
        <div
          ref={wheyRef}
          className="relative z-20 w-[190px] sm:w-[260px] lg:w-[300px] xl:w-[340px] opacity-0 will-change-transform [transform:translateZ(35px)]"
        >
          <div
            ref={wheyFloatRef}
            className="relative aspect-[1122/1402] w-full studio-shadow-whey will-change-transform"
          >
            <Image
              src="/whey-cutout.png"
              alt="Stage & Steel Whey Protein - Belgian Chocolate 1kg"
              fill
              priority
              unoptimized
              sizes="(max-width: 640px) 190px, (max-width: 1024px) 260px, 340px"
              className="object-contain filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.45)] pointer-events-none select-none"
            />
          </div>
        </div>

        {/* SECONDARY PRODUCT: Stage & Steel Creatine Monohydrate (Foreground Layer with higher 3D pop) */}
        <div
          ref={creatineRef}
          className="absolute z-30 bottom-2 -left-2 sm:bottom-3 sm:left-2 lg:-left-2 xl:-left-4 w-[110px] sm:w-[145px] lg:w-[170px] xl:w-[190px] opacity-0 will-change-transform [transform:translateZ(70px)]"
        >
          <div
            ref={creatineFloatRef}
            className="relative aspect-[1500/2100] w-full studio-shadow-creatine will-change-transform"
          >
            <Image
              src="/creatine-cutout.png"
              alt="Stage & Steel Creatine Monohydrate - Orange 300g"
              fill
              priority
              unoptimized
              sizes="(max-width: 640px) 110px, (max-width: 1024px) 145px, 190px"
              className="object-contain filter drop-shadow-[0_18px_25px_rgba(0,0,0,0.4)] pointer-events-none select-none"
            />
          </div>
        </div>

      </div>

    </div>
  );
}
