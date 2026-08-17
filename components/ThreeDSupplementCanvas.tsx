"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

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
  const currentRotRef = useRef({ x: 0.05, y: -Math.PI / 2 }); // start facing front
  const zoomDistRef = useRef(tubType === "whey" ? 6.2 : 5.4);
  const targetZoomRef = useRef(tubType === "whey" ? 6.2 : 5.4);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  // Initialize and run Three.js scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.4, zoomDistRef.current);
    camera.lookAt(0, 0, 0);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 3. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xced8b2, 1.6);
    fillLight.position.set(-6, 4, -4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.8);
    rimLight.position.set(0, -5, -6);
    scene.add(rimLight);

    const topCapLight = new THREE.PointLight(0xffffff, 1.5, 10);
    topCapLight.position.set(0, 4, 1);
    scene.add(topCapLight);

    // 4. Create Master 3D Supplement Tub Group
    const tubGroup = new THREE.Group();
    scene.add(tubGroup);

    // Parameters based on product type
    const isWhey = tubType === "whey";
    const tubRadius = isWhey ? 1.35 : 1.45;
    const tubHeight = isWhey ? 3.3 : 2.1;
    const lidHeight = isWhey ? 0.45 : 0.4;
    const lidRadius = tubRadius * 0.98;

    // Texture Loader
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      textureUrl,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        // Flip offset so front faces camera cleanly
        texture.offset.set(0.25, 0);

        // Body Material
        const labelMaterial = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.3,
          metalness: 0.15,
        });

        // Tub Main Cylinder Body
        const bodyGeo = new THREE.CylinderGeometry(
          tubRadius,
          tubRadius * 0.97,
          tubHeight,
          64,
          1,
          false
        );
        const bodyMesh = new THREE.Mesh(bodyGeo, labelMaterial);
        bodyMesh.position.y = -0.1;
        tubGroup.add(bodyMesh);

        // Matte Black Neck Ring
        const neckGeo = new THREE.CylinderGeometry(
          lidRadius * 0.96,
          tubRadius * 0.98,
          0.18,
          64
        );
        const neckMat = new THREE.MeshStandardMaterial({
          color: 0x181817,
          roughness: 0.5,
          metalness: 0.3,
        });
        const neckMesh = new THREE.Mesh(neckGeo, neckMat);
        neckMesh.position.y = tubHeight / 2 - 0.1;
        tubGroup.add(neckMesh);

        // Metallic Accent Seal Ring (Stage Gold / Steel)
        const sealGeo = new THREE.TorusGeometry(lidRadius * 0.96, 0.02, 16, 64);
        const sealMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(accentColor),
          roughness: 0.25,
          metalness: 0.85,
        });
        const sealMesh = new THREE.Mesh(sealGeo, sealMat);
        sealMesh.rotation.x = Math.PI / 2;
        sealMesh.position.y = tubHeight / 2 - 0.02;
        tubGroup.add(sealMesh);

        // Matte Black Ribbed Cap
        const capGeo = new THREE.CylinderGeometry(
          lidRadius,
          lidRadius,
          lidHeight,
          64
        );
        const capMat = new THREE.MeshStandardMaterial({
          color: 0x151514,
          roughness: 0.6,
          metalness: 0.2,
        });
        const capMesh = new THREE.Mesh(capGeo, capMat);
        capMesh.position.y = tubHeight / 2 + lidHeight / 2 - 0.05;
        tubGroup.add(capMesh);

        // Cap Top Chamfer Rim
        const capTopGeo = new THREE.CylinderGeometry(
          lidRadius * 0.94,
          lidRadius,
          0.06,
          64
        );
        const capTopMesh = new THREE.Mesh(capTopGeo, capMat);
        capTopMesh.position.y = tubHeight / 2 + lidHeight - 0.02;
        tubGroup.add(capTopMesh);

        // Cap Top Recessed Brand Disc
        const discGeo = new THREE.CylinderGeometry(
          lidRadius * 0.88,
          lidRadius * 0.88,
          0.02,
          64
        );
        const discMat = new THREE.MeshStandardMaterial({
          color: 0x111110,
          roughness: 0.3,
          metalness: 0.4,
        });
        const discMesh = new THREE.Mesh(discGeo, discMat);
        discMesh.position.y = tubHeight / 2 + lidHeight + 0.01;
        tubGroup.add(discMesh);

        // Bottom Tapered Base Rim
        const baseGeo = new THREE.CylinderGeometry(
          tubRadius * 0.97,
          tubRadius * 0.92,
          0.12,
          64
        );
        const baseMat = new THREE.MeshStandardMaterial({
          color: 0x141413,
          roughness: 0.5,
          metalness: 0.2,
        });
        const baseMesh = new THREE.Mesh(baseGeo, baseMat);
        baseMesh.position.y = -tubHeight / 2 - 0.15;
        tubGroup.add(baseMesh);

        setIsLoaded(true);
      },
      undefined,
      (err) => {
        console.error("Failed to load 3D texture:", err);
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

    // 6. Animation Loop with Physics Damping
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Inertia & Damping
      if (!isDraggingRef.current) {
        if (autoRotate) {
          rotVelocityRef.current.y = 0.006;
        } else {
          rotVelocityRef.current.x *= 0.92;
          rotVelocityRef.current.y *= 0.92;
        }
      }

      currentRotRef.current.x += rotVelocityRef.current.x;
      currentRotRef.current.y += rotVelocityRef.current.y;

      // Pitch clamping (avoid flipping upside down completely)
      currentRotRef.current.x = Math.max(
        -0.55,
        Math.min(0.55, currentRotRef.current.x)
      );

      tubGroup.rotation.x = currentRotRef.current.x;
      tubGroup.rotation.y = currentRotRef.current.y;

      // Smooth zoom interpolation
      zoomDistRef.current += (targetZoomRef.current - zoomDistRef.current) * 0.1;
      camera.position.z = zoomDistRef.current;

      // Report angle to parent for live telemetry compass
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

  // Pointer & Touch Controls
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

  // Zoom via mouse wheel
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const minZoom = tubType === "whey" ? 4.2 : 3.8;
    const maxZoom = tubType === "whey" ? 8.5 : 7.8;
    targetZoomRef.current = Math.max(
      minZoom,
      Math.min(maxZoom, targetZoomRef.current + e.deltaY * 0.004)
    );
  };

  // Touch Pinch-to-zoom
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
        const minZoom = tubType === "whey" ? 4.2 : 3.8;
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

  // Reset Angle helper
  const resetToFront = useCallback(() => {
    currentRotRef.current = { x: 0.05, y: -Math.PI / 2 };
    rotVelocityRef.current = { x: 0, y: 0 };
    targetZoomRef.current = tubType === "whey" ? 6.2 : 5.4;
  }, [tubType]);

  const rotateToBack = useCallback(() => {
    currentRotRef.current = { x: 0.05, y: Math.PI / 2 };
    rotVelocityRef.current = { x: 0, y: 0 };
  }, []);

  const rotateToTop = useCallback(() => {
    currentRotRef.current = { x: 0.52, y: -Math.PI / 2 };
    rotVelocityRef.current = { x: 0, y: 0 };
  }, []);

  return (
    <div className="relative w-full h-full select-none touch-none flex items-center justify-center">
      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="w-full h-full cursor-grab active:cursor-grabbing focus:outline-hidden"
      />

      {/* Loading HUD Overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#111110]/80 backdrop-blur-xs text-[#A8B778] font-mono text-xs tracking-widest uppercase">
          <div className="w-10 h-10 border-2 border-[#596238] border-t-[#A8B778] rounded-full animate-spin mb-3" />
          <span>INITIALIZING 3D LAB MESH // 60 FPS</span>
        </div>
      )}

      {/* Quick View Direction Triggers */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={resetToFront}
          className="px-3 py-1.5 bg-[#151514]/80 hover:bg-[#596238]/30 border border-[#596238]/40 hover:border-[#A8B778] text-[10px] font-mono font-bold tracking-widest text-[#F4F4F1] uppercase transition-all duration-200 cursor-pointer"
        >
          FRONT VIEW
        </button>
        <button
          type="button"
          onClick={rotateToBack}
          className="px-3 py-1.5 bg-[#151514]/80 hover:bg-[#596238]/30 border border-[#596238]/40 hover:border-[#A8B778] text-[10px] font-mono font-bold tracking-widest text-[#F4F4F1] uppercase transition-all duration-200 cursor-pointer"
        >
          BACK SPECS
        </button>
        <button
          type="button"
          onClick={rotateToTop}
          className="px-3 py-1.5 bg-[#151514]/80 hover:bg-[#596238]/30 border border-[#596238]/40 hover:border-[#A8B778] text-[10px] font-mono font-bold tracking-widest text-[#F4F4F1] uppercase transition-all duration-200 cursor-pointer"
        >
          CAP VIEW
        </button>
      </div>

      {/* Drag & Zoom Interaction Hint */}
      <div className="absolute top-4 left-4 pointer-events-none z-20 flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#A8B778] uppercase bg-[#151514]/70 px-3 py-1 border border-[#596238]/30">
        <span className="w-1.5 h-1.5 rounded-full bg-[#A8B778] animate-ping" />
        <span>DRAG TO ROTATE 360° // PINCH / SCROLL TO ZOOM</span>
      </div>
    </div>
  );
}
