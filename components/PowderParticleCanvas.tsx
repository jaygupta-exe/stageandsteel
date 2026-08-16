"use client";

import React, { useEffect, useRef } from "react";

interface PowderParticleCanvasProps {
  isActive: boolean;
  origin?: { x: number; y: number } | null;
}

interface DustCloud {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  maxAlpha: number;
  growth: number;
  decay: number;
  color: string;
  wobbleSpeed: number;
  wobbleOffset: number;
  age: number;
}

export default function PowderParticleCanvas({
  isActive,
  origin,
}: PowderParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let isSpawning = true;
    let spawnTimer: NodeJS.Timeout;

    // Handle High-DPI Canvas Resizing
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Realistic Soft Whey Concentrate & Micronized Creatine Dust Hues
    const powderTones = [
      "255, 255, 255", // Pure Chalk Whey White
      "246, 245, 240", // Soft Off-White Concentrate
      "235, 233, 222", // Creamy Vanilla Whey
      "225, 229, 218", // Fine Creatine Micro-Dust
      "210, 215, 195", // Subtle Botanical Olive Mist
    ];

    const clouds: DustCloud[] = [];
    const emitterX = origin?.x ?? 80;
    const emitterY = origin?.y ?? 65;

    // Spawn soft billowing powder smoke puffs
    const spawnPuffs = (count: number, isInitial = false) => {
      for (let i = 0; i < count; i++) {
        const color =
          powderTones[Math.floor(Math.random() * powderTones.length)];

        // Lip offset (mouth of the tilted scoop)
        const offsetX = (Math.random() - 0.4) * 16;
        const offsetY = (Math.random() - 0.2) * 10;

        const initialRadius = isInitial
          ? Math.random() * 25 + 15
          : Math.random() * 18 + 8;

        const maxRadius = initialRadius + Math.random() * 60 + 35;
        const initialAlpha = isInitial
          ? Math.random() * 0.22 + 0.12
          : Math.random() * 0.16 + 0.08;

        clouds.push({
          x: emitterX + offsetX,
          y: emitterY + offsetY,
          // Gentle downward & outward drifting velocity
          vx: (Math.random() - 0.25) * 2.2 + 0.4,
          vy: Math.random() * 3.2 + 1.2,
          radius: initialRadius,
          maxRadius: maxRadius,
          alpha: initialAlpha,
          maxAlpha: initialAlpha,
          growth: Math.random() * 0.45 + 0.25,
          decay: Math.random() * 0.0025 + 0.0018,
          color: color,
          wobbleSpeed: Math.random() * 0.03 + 0.01,
          wobbleOffset: Math.random() * Math.PI * 2,
          age: 0,
        });
      }
    };

    // 1. Initial soft billowing burst
    spawnPuffs(45, true);

    // 2. Smooth gentle powder cloud pour stream for 1.4s
    spawnTimer = setTimeout(() => {
      isSpawning = false;
    }, 1400);

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Continuous gentle billowing while pouring
      if (isSpawning) {
        spawnPuffs(3);
      }

      for (let i = clouds.length - 1; i >= 0; i--) {
        const p = clouds[i];
        p.age++;

        // Gentle physics: air drag and soft expansion
        p.x += p.vx + Math.sin(p.age * p.wobbleSpeed + p.wobbleOffset) * 0.3;
        p.y += p.vy;
        p.vy *= 0.985; // Air resistance decelerates gravity
        p.vx *= 0.98;

        // Gradual cloud expansion
        if (p.radius < p.maxRadius) {
          p.radius += p.growth;
        }

        // Smooth alpha decay
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.y > window.innerHeight + 100) {
          clouds.splice(i, 1);
          continue;
        }

        // Draw soft, organic, multi-stop powder dust smoke gradient
        const grad = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          p.radius
        );

        const currentAlpha = Math.max(0, p.alpha);
        grad.addColorStop(0, `rgba(${p.color}, ${currentAlpha * 0.95})`);
        grad.addColorStop(0.35, `rgba(${p.color}, ${currentAlpha * 0.55})`);
        grad.addColorStop(0.7, `rgba(${p.color}, ${currentAlpha * 0.2})`);
        grad.addColorStop(1, `rgba(${p.color}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      if (clouds.length > 0 || isSpawning) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(spawnTimer);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isActive, origin]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[60] w-full h-full"
    />
  );
}
