"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { ZoomIn, ZoomOut, RotateCcw, Play, Pause } from "lucide-react";

interface ThreeDSupplementCanvasProps {
  textureUrl: string;
  tubType?: "whey" | "creatine";
  accentColor?: string;
  autoRotate?: boolean;
  onAngleChange?: (angleDeg: number) => void;
}

export default function ThreeDSupplementCanvas({
  textureUrl,
  tubType = "whey",
  accentColor = "#A8B778",
  autoRotate = true,
  onAngleChange,
}: ThreeDSupplementCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const previousPointerPosRef = useRef({ x: 0, y: 0 });
  const touchStartDistRef = useRef(0);
  const rotVelocityRef = useRef({ x: 0, y: 0 });
  const currentRotRef = useRef({ x: 0.1, y: 0 }); // start facing front label
  const zoomDistRef = useRef(tubType === "whey" ? 6.2 : 5.2);
  const targetZoomRef = useRef(tubType === "whey" ? 6.2 : 5.2);
  const [isLoaded, setIsLoaded] = useState(false);
  const [zoomPercent, setZoomPercent] = useState<number>(100);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Three.js Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.3, zoomDistRef.current);
    camera.lookAt(0, 0, 0);

    // 2. High-Performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 3. Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(6, 8, 6);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xd4dbc2, 1.8);
    fillLight.position.set(-6, 5, -5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 2.2);
    rimLight.position.set(0, -4, -6);
    scene.add(rimLight);

    const topCapLight = new THREE.PointLight(0xffffff, 2.0, 12);
    topCapLight.position.set(0, 5, 2);
    scene.add(topCapLight);

    // 4. Create Master 3D Supplement Tub Model
    const tubGroup = new THREE.Group();
    scene.add(tubGroup);

    const isWhey = tubType === "whey";
    const bodyRadius = isWhey ? 1.32 : 1.42;
    const bodyHeight = isWhey ? 2.6 : 1.7;
    const shoulderHeight = isWhey ? 0.6 : 0.45;
    const neckRadius = isWhey ? 1.05 : 1.15;
    const neckHeight = 0.25;
    const lidRadius = isWhey ? 1.18 : 1.28;
    const lidHeight = isWhey ? 0.55 : 0.45;

    // Materials: Realistic Shiny Black HDPE Plastic for Bottle Body
    const bottlePlasticMat = new THREE.MeshPhysicalMaterial({
      color: 0x161615,
      roughness: 0.22,
      metalness: 0.1,
      clearcoat: 0.65,
      clearcoatRoughness: 0.2,
    });

    // Texture Loader for the Wrapped Body Label
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      textureUrl,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        // Center the front label towards camera at rotation = 0
        texture.offset.set(0.25, 0);

        const labelMaterial = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.38,
          metalness: 0.05,
        });

        // A. Cylindrical Label Wrap Mesh
        const labelGeo = new THREE.CylinderGeometry(
          bodyRadius * 1.002,
          bodyRadius * 0.998,
          bodyHeight,
          64,
          1,
          true
        );
        const labelMesh = new THREE.Mesh(labelGeo, labelMaterial);
        labelMesh.position.y = -0.15;
        tubGroup.add(labelMesh);

        // B. Inner Solid Core Body
        const innerBodyGeo = new THREE.CylinderGeometry(
          bodyRadius,
          bodyRadius * 0.96,
          bodyHeight,
          64
        );
        const innerBodyMesh = new THREE.Mesh(innerBodyGeo, bottlePlasticMat);
        innerBodyMesh.position.y = -0.15;
        tubGroup.add(innerBodyMesh);

        // C. Smooth Shoulder Inward Curve (Transition to Neck)
        const shoulderGeo = new THREE.CylinderGeometry(
          neckRadius * 1.05,
          bodyRadius,
          shoulderHeight,
          64
        );
        const shoulderMesh = new THREE.Mesh(shoulderGeo, bottlePlasticMat);
        shoulderMesh.position.y = bodyHeight / 2 - 0.15 + shoulderHeight / 2;
        tubGroup.add(shoulderMesh);

        // D. Threaded Neck
        const neckGeo = new THREE.CylinderGeometry(
          neckRadius,
          neckRadius,
          neckHeight,
          64
        );
        const neckMesh = new THREE.Mesh(neckGeo, bottlePlasticMat);
        neckMesh.position.y =
          bodyHeight / 2 - 0.15 + shoulderHeight + neckHeight / 2;
        tubGroup.add(neckMesh);

        // E. Metallic Accent Safety Seal Ring (Stage Gold / Olive)
        const sealGeo = new THREE.TorusGeometry(neckRadius * 1.06, 0.025, 16, 64);
        const sealMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(accentColor),
          roughness: 0.2,
          metalness: 0.9,
        });
        const sealMesh = new THREE.Mesh(sealGeo, sealMat);
        sealMesh.rotation.x = Math.PI / 2;
        sealMesh.position.y =
          bodyHeight / 2 - 0.15 + shoulderHeight + neckHeight - 0.04;
        tubGroup.add(sealMesh);

        // F. Matte Black Ribbed Cap (Lid)
        const capMat = new THREE.MeshPhysicalMaterial({
          color: 0x141413,
          roughness: 0.55,
          metalness: 0.2,
          clearcoat: 0.2,
        });

        const capGeo = new THREE.CylinderGeometry(
          lidRadius,
          lidRadius,
          lidHeight,
          64
        );
        const capMesh = new THREE.Mesh(capGeo, capMat);
        capMesh.position.y =
          bodyHeight / 2 -
          0.15 +
          shoulderHeight +
          neckHeight +
          lidHeight / 2 -
          0.06;
        tubGroup.add(capMesh);

        // G. Cap Top Chamfer Edge
        const capTopGeo = new THREE.CylinderGeometry(
          lidRadius * 0.94,
          lidRadius,
          0.07,
          64
        );
        const capTopMesh = new THREE.Mesh(capTopGeo, capMat);
        capTopMesh.position.y =
          bodyHeight / 2 -
          0.15 +
          shoulderHeight +
          neckHeight +
          lidHeight -
          0.03;
        tubGroup.add(capTopMesh);

        // H. Cap Top Recessed Brand Disc
        const discGeo = new THREE.CylinderGeometry(
          lidRadius * 0.88,
          lidRadius * 0.88,
          0.02,
          64
        );
        const discMat = new THREE.MeshStandardMaterial({
          color: 0x0d0d0c,
          roughness: 0.35,
          metalness: 0.4,
        });
        const discMesh = new THREE.Mesh(discGeo, discMat);
        discMesh.position.y =
          bodyHeight / 2 -
          0.15 +
          shoulderHeight +
          neckHeight +
          lidHeight +
          0.01;
        tubGroup.add(discMesh);

        // I. Bottom Tapered Base Rim
        const baseGeo = new THREE.CylinderGeometry(
          bodyRadius * 0.96,
          bodyRadius * 0.91,
          0.15,
          64
        );
        const baseMesh = new THREE.Mesh(baseGeo, bottlePlasticMat);
        baseMesh.position.y = -bodyHeight / 2 - 0.15 - 0.075;
        tubGroup.add(baseMesh);

        // J. Studio Turntable Shadow Plane underneath
        const shadowPlaneGeo = new THREE.PlaneGeometry(6, 6);
        const shadowCanvas = document.createElement("canvas");
        shadowCanvas.width = 256;
        shadowCanvas.height = 256;
        const sCtx = shadowCanvas.getContext("2d");
        if (sCtx) {
          const grad = sCtx.createRadialGradient(
            128,
            128,
            0,
            128,
            128,
            110
          );
          grad.addColorStop(0, "rgba(0, 0, 0, 0.75)");
          grad.addColorStop(0.5, "rgba(0, 0, 0, 0.3)");
          grad.addColorStop(1, "rgba(0, 0, 0, 0)");
          sCtx.fillStyle = grad;
          sCtx.fillRect(0, 0, 256, 256);
        }
        const shadowTex = new THREE.CanvasTexture(shadowCanvas);
        const shadowMat = new THREE.MeshBasicMaterial({
          map: shadowTex,
          transparent: true,
          opacity: 0.8,
        });
        const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowMat);
        shadowPlane.rotation.x = -Math.PI / 2;
        shadowPlane.position.y = -bodyHeight / 2 - 0.15 - 0.15;
        scene.add(shadowPlane);

        setIsLoaded(true);
      },
      undefined,
      (err) => {
        console.error("Failed to load 3D label texture:", err);
      }
    );

    // 5. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // 6. 60 FPS Render Loop with Physics Damping
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isDraggingRef.current) {
        if (autoRotate) {
          rotVelocityRef.current.y = 0.007;
        } else {
          rotVelocityRef.current.x *= 0.92;
          rotVelocityRef.current.y *= 0.92;
        }
      }

      currentRotRef.current.x += rotVelocityRef.current.x;
      currentRotRef.current.y += rotVelocityRef.current.y;

      // Vertical tilt clamp (-45 deg to +45 deg)
      currentRotRef.current.x = Math.max(
        -0.75,
        Math.min(0.75, currentRotRef.current.x)
      );

      tubGroup.rotation.x = currentRotRef.current.x;
      tubGroup.rotation.y = currentRotRef.current.y;

      // Smooth zoom damping
      zoomDistRef.current += (targetZoomRef.current - zoomDistRef.current) * 0.12;
      camera.position.z = zoomDistRef.current;

      const baseZoom = isWhey ? 6.2 : 5.2;
      const pct = Math.round((baseZoom / zoomDistRef.current) * 100);
      setZoomPercent(pct);

      if (onAngleChange) {
        const deg =
          (((tubGroup.rotation.y * 180) / Math.PI) % 360 + 360) % 360;
        onAngleChange(Math.round(deg));
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [textureUrl, tubType, accentColor, autoRotate, onAngleChange]);

  // Pointer Drag Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    previousPointerPosRef.current = { x: e.clientX, y: e.clientY };
    rotVelocityRef.current = { x: 0, y: 0 };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - previousPointerPosRef.current.x;
    const deltaY = e.clientY - previousPointerPosRef.current.y;

    rotVelocityRef.current = {
      x: deltaY * 0.005,
      y: deltaX * 0.008,
    };

    currentRotRef.current.x += deltaY * 0.005;
    currentRotRef.current.y += deltaX * 0.008;

    previousPointerPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  // Zoom via wheel
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const minZoom = tubType === "whey" ? 3.8 : 3.4;
    const maxZoom = tubType === "whey" ? 8.5 : 7.8;
    targetZoomRef.current = Math.max(
      minZoom,
      Math.min(maxZoom, targetZoomRef.current + e.deltaY * 0.004)
    );
  };

  // Touch pinch to zoom
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );
      if (touchStartDistRef.current > 0) {
        const delta = touchStartDistRef.current - dist;
        const minZoom = tubType === "whey" ? 3.8 : 3.4;
        const maxZoom = tubType === "whey" ? 8.5 : 7.8;
        targetZoomRef.current = Math.max(
          minZoom,
          Math.min(maxZoom, targetZoomRef.current + delta * 0.01)
        );
      }
      touchStartDistRef.current = dist;
    }
  };

  const handleTouchEnd = () => {
    touchStartDistRef.current = 0;
  };

  // Quick Angle Triggers
  const setFrontView = useCallback(() => {
    currentRotRef.current = { x: 0.1, y: 0 };
    rotVelocityRef.current = { x: 0, y: 0 };
    targetZoomRef.current = tubType === "whey" ? 6.2 : 5.2;
  }, [tubType]);

  const setBackView = useCallback(() => {
    currentRotRef.current = { x: 0.1, y: Math.PI };
    rotVelocityRef.current = { x: 0, y: 0 };
  }, []);

  const setCapView = useCallback(() => {
    currentRotRef.current = { x: 0.65, y: 0 };
    rotVelocityRef.current = { x: 0, y: 0 };
  }, []);

  const setBaseView = useCallback(() => {
    currentRotRef.current = { x: -0.65, y: 0 };
    rotVelocityRef.current = { x: 0, y: 0 };
  }, []);

  return (
    <div
      onWheel={handleWheel}
      className="relative w-full h-full select-none touch-none flex items-center justify-center"
    >
      {/* 3D WebGL Canvas */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="w-full h-full cursor-grab active:cursor-grabbing focus:outline-hidden"
      />

      {/* Loading Overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#111110]/90 backdrop-blur-xs text-[#A8B778] font-mono text-xs tracking-widest uppercase">
          <div className="w-10 h-10 border-2 border-[#596238] border-t-[#A8B778] rounded-full animate-spin mb-3" />
          <span>RENDERING REAL 3D PBR MESH // 60 FPS</span>
        </div>
      )}

      {/* Top HUD Hint */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#A8B778] uppercase bg-[#151514]/80 px-3 py-1.5 border border-[#596238]/30">
        <span className="w-1.5 h-1.5 rounded-full bg-[#A8B778] animate-ping" />
        <span>DRAG IN ANY DIRECTION (360°) // SCROLL TO ZOOM ({zoomPercent}%)</span>
      </div>

      {/* Bottom Quick Angle Direction Buttons */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2">
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={setFrontView}
            className="px-3 py-1.5 bg-[#181817]/90 hover:bg-[#596238]/30 border border-[#F4F4F1]/10 hover:border-[#A8B778] text-[10px] font-mono font-bold tracking-widest text-[#F4F4F1] uppercase transition-all duration-200 cursor-pointer"
          >
            FRONT VIEW (0°)
          </button>
          <button
            type="button"
            onClick={setBackView}
            className="px-3 py-1.5 bg-[#181817]/90 hover:bg-[#596238]/30 border border-[#F4F4F1]/10 hover:border-[#A8B778] text-[10px] font-mono font-bold tracking-widest text-[#F4F4F1] uppercase transition-all duration-200 cursor-pointer"
          >
            BACK FACTS (180°)
          </button>
          <button
            type="button"
            onClick={setCapView}
            className="px-3 py-1.5 bg-[#181817]/90 hover:bg-[#596238]/30 border border-[#F4F4F1]/10 hover:border-[#A8B778] text-[10px] font-mono font-bold tracking-widest text-[#F4F4F1] uppercase transition-all duration-200 cursor-pointer"
          >
            TOP CAP VIEW
          </button>
          <button
            type="button"
            onClick={setBaseView}
            className="px-3 py-1.5 bg-[#181817]/90 hover:bg-[#596238]/30 border border-[#F4F4F1]/10 hover:border-[#A8B778] text-[10px] font-mono font-bold tracking-widest text-[#F4F4F1] uppercase transition-all duration-200 cursor-pointer"
          >
            BOTTOM BASE
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5 bg-[#181817]/90 border border-[#F4F4F1]/10 p-1">
          <button
            type="button"
            onClick={() => {
              targetZoomRef.current = Math.min(8.5, targetZoomRef.current + 0.8);
            }}
            aria-label="Zoom out"
            className="p-1 text-[#777773] hover:text-[#F4F4F1] transition-colors cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[9px] font-mono text-[#A8B778] px-1">
            {zoomPercent}%
          </span>
          <button
            type="button"
            onClick={() => {
              targetZoomRef.current = Math.max(3.8, targetZoomRef.current - 0.8);
            }}
            aria-label="Zoom in"
            className="p-1 text-[#777773] hover:text-[#F4F4F1] transition-colors cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={setFrontView}
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
