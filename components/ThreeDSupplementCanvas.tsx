"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { ZoomIn, ZoomOut, RotateCcw, Sparkles } from "lucide-react";

export interface ProductAngleView {
  angle: number; // 0, 120, 240 etc.
  label: string;
  image: string;
}

interface ThreeDSupplementCanvasProps {
  views: ProductAngleView[];
  accentColor?: string;
  autoRotate?: boolean;
  onAngleChange?: (angleDeg: number) => void;
}

export default function ThreeDSupplementCanvas({
  views,
  accentColor = "#A8B778",
  autoRotate = true,
  onAngleChange,
}: ThreeDSupplementCanvasProps) {
  const [rotationY, setRotationY] = useState<number>(0);
  const [rotationX, setRotationX] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const isDraggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);
  const rotYRef = useRef(0);
  const rotXRef = useRef(0);

  // Determine current active image based on rotation angle (0 - 360)
  const normalizedAngle = ((rotYRef.current % 360) + 360) % 360;

  // Find closest view or slice
  const getActiveViewIndex = useCallback(
    (deg: number) => {
      if (!views || views.length === 0) return 0;
      if (views.length === 1) return 0;

      // When 3 views:
      // Front: 300° to 60° (0°)
      // Side 1: 60° to 180° (120°)
      // Back: 180° to 300° (240°)
      const step = 360 / views.length;
      let minDiff = 999;
      let bestIdx = 0;

      views.forEach((v, idx) => {
        const target = (idx * step) % 360;
        let diff = Math.abs(deg - target);
        if (diff > 180) diff = 360 - diff;
        if (diff < minDiff) {
          minDiff = diff;
          bestIdx = idx;
        }
      });

      return bestIdx;
    },
    [views]
  );

  const activeIdx = getActiveViewIndex(normalizedAngle);
  const currentView = views[activeIdx] || views[0];

  // Animation Loop for Auto-spin & Physics Inertia
  useEffect(() => {
    const loop = () => {
      if (!isDraggingRef.current) {
        if (autoRotate) {
          rotYRef.current = (rotYRef.current + 0.45) % 360;
          setRotationY(rotYRef.current);
        } else {
          // Damping
          velocityRef.current.x *= 0.93;
          velocityRef.current.y *= 0.93;

          rotYRef.current = (rotYRef.current + velocityRef.current.x) % 360;
          rotXRef.current = Math.max(
            -18,
            Math.min(18, rotXRef.current + velocityRef.current.y)
          );

          setRotationY(rotYRef.current);
          setRotationX(rotXRef.current);
        }
      }

      if (onAngleChange) {
        const deg = Math.round(((rotYRef.current % 360) + 360) % 360);
        onAngleChange(deg);
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [autoRotate, onAngleChange]);

  // Pointer Drag Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    startPosRef.current = { x: e.clientX, y: e.clientY };
    velocityRef.current = { x: 0, y: 0 };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - startPosRef.current.x;
    const deltaY = e.clientY - startPosRef.current.y;

    velocityRef.current = {
      x: deltaX * 0.45,
      y: -deltaY * 0.25,
    };

    rotYRef.current = (rotYRef.current + deltaX * 0.45) % 360;
    rotXRef.current = Math.max(
      -18,
      Math.min(18, rotXRef.current - deltaY * 0.25)
    );

    setRotationY(rotYRef.current);
    setRotationX(rotXRef.current);

    startPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  // Zoom controls
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    setZoom((prev) => Math.max(0.85, Math.min(2.0, prev - e.deltaY * 0.0015)));
  };

  const setTargetAngle = (targetDeg: number) => {
    rotYRef.current = targetDeg;
    rotXRef.current = 0;
    velocityRef.current = { x: 0, y: 0 };
    setRotationY(targetDeg);
    setRotationX(0);
  };

  // 3D dynamic card angle calculate for subtle perspective
  const localAngle = (normalizedAngle % (360 / (views.length || 1))) - (180 / (views.length || 1));
  const cardTiltY = Math.max(-25, Math.min(25, localAngle * 0.4));

  // Dynamic light sheen position
  const sheenPos = `${((normalizedAngle % 360) / 360) * 100}%`;

  return (
    <div
      onWheel={handleWheel}
      className="relative w-full h-full select-none touch-none flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Studio Background Glow & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#596238_0%,transparent_70%)] opacity-20 pointer-events-none" />
      
      {/* Studio Turntable Floor Ring */}
      <div
        className="absolute bottom-12 w-80 sm:w-96 h-24 rounded-[100%] border border-[#596238]/40 bg-radial from-[#596238]/20 via-[#151514]/80 to-transparent pointer-events-none"
        style={{
          transform: `perspective(600px) rotateX(70deg) scale(${zoom})`,
          boxShadow: `0 0 40px rgba(89, 98, 56, 0.25)`,
        }}
      >
        <div className="absolute inset-2 rounded-[100%] border border-dashed border-[#A8B778]/30" />
      </div>

      {/* Main 3D Bottle Stage */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative z-10 w-full h-[360px] sm:h-[440px] lg:h-[500px] flex items-center justify-center cursor-grab active:cursor-grabbing focus:outline-hidden"
        style={{
          perspective: "1200px",
        }}
      >
        {/* The 3D Rotating Product Container */}
        <div
          className="relative transition-transform duration-75 ease-out flex items-center justify-center"
          style={{
            transform: `scale(${zoom}) rotateX(${rotationX}deg) rotateY(${cardTiltY}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Real High-Res Product Photo */}
          <div className="relative w-64 sm:w-80 md:w-96 h-[340px] sm:h-[420px] lg:h-[480px]">
            {views.map((v, i) => {
              const isCurrent = i === activeIdx;
              return (
                <div
                  key={v.image}
                  className={`absolute inset-0 transition-opacity duration-300 ${
                    isCurrent ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                  }`}
                >
                  <Image
                    src={v.image}
                    alt={v.label}
                    fill
                    priority
                    unoptimized
                    className="object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)] pointer-events-none"
                  />
                  
                  {/* Dynamic Studio Specular Reflection Sweep */}
                  <div
                    className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30"
                    style={{
                      background: `linear-gradient(105deg, transparent ${sheenPos}, rgba(255,255,255,0.7) calc(${sheenPos} + 15%), transparent calc(${sheenPos} + 30%))`,
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Contact Shadow beneath the tub */}
          <div
            className="absolute -bottom-6 w-56 sm:w-64 h-8 bg-[#000000]/90 rounded-full blur-md pointer-events-none"
            style={{
              transform: `scale(${1 / zoom})`,
            }}
          />
        </div>
      </div>

      {/* Top Angle HUD Badge */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#A8B778] uppercase bg-[#151514]/80 px-3 py-1.5 border border-[#596238]/30">
        <span className="w-1.5 h-1.5 rounded-full bg-[#A8B778] animate-ping" />
        <span>DRAG TO ROTATE 360° // SCROLL TO ZOOM ({Math.round(zoom * 100)}%)</span>
      </div>

      {/* Bottom Direct Angle Switchers */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2">
        
        {/* Angle Buttons */}
        <div className="flex items-center gap-2">
          {views.map((v, i) => {
            const step = 360 / (views.length || 1);
            const targetDeg = i * step;
            const isCurrent = i === activeIdx;

            return (
              <button
                key={v.label}
                type="button"
                onClick={() => setTargetAngle(targetDeg)}
                className={`px-3 py-1.5 text-[10px] font-mono font-bold tracking-widest uppercase transition-all duration-150 cursor-pointer ${
                  isCurrent
                    ? "bg-[#A8B778] text-[#151515] border border-[#A8B778]"
                    : "bg-[#181817]/90 text-[#C4C3BE] hover:text-[#F4F4F1] border border-[#F4F4F1]/10 hover:border-[#596238]"
                }`}
              >
                {v.label}
              </button>
            );
          })}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5 bg-[#181817]/90 border border-[#F4F4F1]/10 p-1">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.85, z - 0.2))}
            aria-label="Zoom out"
            className="p-1 text-[#777773] hover:text-[#F4F4F1] transition-colors cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[9px] font-mono text-[#A8B778] px-1">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(2.0, z + 0.2))}
            aria-label="Zoom in"
            className="p-1 text-[#777773] hover:text-[#F4F4F1] transition-colors cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              setZoom(1);
              setTargetAngle(0);
            }}
            title="Reset Angle & Zoom"
            className="p-1 text-[#777773] hover:text-[#A8B778] transition-colors cursor-pointer ml-1 border-l border-[#F4F4F1]/10 pl-1.5"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>

      </div>
    </div>
  );
}
