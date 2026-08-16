"use client";

import React, { useRef } from "react";

interface SupplementScoopProps {
  isOpen: boolean;
  onToggle: () => void;
  scoopRef?: React.RefObject<HTMLButtonElement | null>;
}

export default function SupplementScoop({
  isOpen,
  onToggle,
  scoopRef,
}: SupplementScoopProps) {
  const localRef = useRef<HTMLButtonElement | null>(null);
  const buttonRef = scoopRef || localRef;

  return (
    <div className="flex items-center">
      {/* Scoop Interactive Button - Completely transparent background, no black box */}
      <button
        ref={buttonRef}
        type="button"
        onClick={onToggle}
        aria-label={isOpen ? "Refill Scoop & Close Menu" : "Dump Scoop & Open Menu"}
        title={isOpen ? "Click to Refill Scoop" : "Click to Pour Powder & Open Menu"}
        className="group relative p-1 bg-transparent border-none focus:outline-hidden cursor-pointer select-none transition-transform duration-200 hover:scale-110 active:scale-95"
      >
        {/* Scoop Visual Container with Smooth Flip Animation */}
        <div
          className={`relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center transition-transform duration-500 ease-out origin-[38%_42%] ${
            isOpen
              ? "-rotate-125 -translate-y-1 scale-105"
              : "rotate-0 group-hover:-rotate-12"
          }`}
          style={{
            filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.35)) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2))",
          }}
        >
          <svg
            viewBox="0 0 54 54"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full overflow-visible"
          >
            <defs>
              {/* Premium Realistic Metallic/Polymer Scoop Shading */}
              <linearGradient id="scoopBodyGrad" x1="15%" y1="10%" x2="85%" y2="90%">
                <stop offset="0%" stopColor="#4A4944" />
                <stop offset="30%" stopColor="#2D2C28" />
                <stop offset="70%" stopColor="#1B1A18" />
                <stop offset="100%" stopColor="#0F0F0E" />
              </linearGradient>

              {/* Scoop Handle Shading */}
              <linearGradient id="scoopHandleGrad" x1="0%" y1="0%" x2="100%" y2="80%">
                <stop offset="0%" stopColor="#5E5D57" />
                <stop offset="40%" stopColor="#383733" />
                <stop offset="85%" stopColor="#1F1E1B" />
                <stop offset="100%" stopColor="#121210" />
              </linearGradient>

              {/* Fluffy Protein Powder Dome Gradient */}
              <radialGradient id="fluffyPowderGrad" cx="45%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="45%" stopColor="#F5F5F0" />
                <stop offset="75%" stopColor="#D8D7CE" />
                <stop offset="100%" stopColor="#9E9D93" />
              </radialGradient>

              {/* Powder Specular Glow */}
              <linearGradient id="powderGleam" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#E2E2D8" stopOpacity="0" />
              </linearGradient>

              {/* Precision Tactical Olive Rim Accent */}
              <linearGradient id="oliveRimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#768349" />
                <stop offset="50%" stopColor="#596238" />
                <stop offset="100%" stopColor="#3E4527" />
              </linearGradient>

              {/* Handle Inner Groove Recess Shadow */}
              <linearGradient id="grooveShadow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0A0A09" />
                <stop offset="100%" stopColor="#252422" />
              </linearGradient>
            </defs>

            {/* 1. REALISTIC ERGONOMIC LONG SCOOP HANDLE (Diagonal with finger grip & markings) */}
            {/* Handle Main Body */}
            <path
              d="M20 22 L46 9 C48 8 50.5 9.2 51 11.4 C51.4 13.5 49.8 15.6 47.5 16.5 L24 30 Z"
              fill="url(#scoopHandleGrad)"
              stroke="#111110"
              strokeWidth="0.8"
            />

            {/* Handle Top Highlight Ridge */}
            <path
              d="M22 22 L46.5 9.8 C48 9 49.5 9.8 49.8 11.2"
              stroke="#7E7D76"
              strokeWidth="0.9"
              strokeLinecap="round"
            />

            {/* Handle Structural Center Reinforcement Groove */}
            <path
              d="M26 23.5 L44 14.5"
              stroke="url(#grooveShadow)"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M26 23.2 L44 14.2"
              stroke="#55544E"
              strokeWidth="0.6"
              strokeLinecap="round"
            />

            {/* Measurement Ticks on Handle (30cc / 70cc calibration markings) */}
            <line x1="33" y1="18.5" x2="35.5" y2="23.5" stroke="#F4F4F1" strokeWidth="0.8" strokeLinecap="round" opacity="0.85" />
            <line x1="38" y1="16" x2="40.5" y2="21" stroke="#F4F4F1" strokeWidth="0.8" strokeLinecap="round" opacity="0.85" />
            <line x1="43" y1="13.5" x2="45.5" y2="18.5" stroke="url(#oliveRimGrad)" strokeWidth="1.2" strokeLinecap="round" />

            {/* 2. PROTEIN / CREATINE HEAPED POWDER MOUND (Disappears when flipped) */}
            <g
              className={`transition-all duration-300 ease-in-out ${
                isOpen
                  ? "opacity-0 scale-50 translate-y-3"
                  : "opacity-100 scale-100 translate-y-0"
              }`}
            >
              {/* Fluffy Powder Dome with Natural Grain Shape */}
              <path
                d="M5 24.5 C5.5 16 11 12.5 17 13.5 C22.5 14.5 25.5 18.5 26.5 25 Z"
                fill="url(#fluffyPowderGrad)"
              />

              {/* Specular Highlight on Powder Dome Peak */}
              <ellipse
                cx="15"
                cy="17"
                rx="6"
                ry="3"
                transform="rotate(-8 15 17)"
                fill="url(#powderGleam)"
              />

              {/* Natural Grain & Creatine Sparkle Specks */}
              <circle cx="11" cy="18.5" r="0.6" fill="#FFFFFF" />
              <circle cx="14" cy="16" r="0.5" fill="#596238" />
              <circle cx="19" cy="19.5" r="0.7" fill="#FFFFFF" />
              <circle cx="16.5" cy="21" r="0.8" fill="#B4B3AA" />
              <circle cx="8.5" cy="21.5" r="0.5" fill="#FFFFFF" />
              <circle cx="22" cy="22" r="0.6" fill="#D2D1C8" />
            </g>

            {/* 3. DEEP CYLINDRICAL SCOOP CUP (Semi-Cylindrical with real thickness and base) */}
            <path
              d="M4.5 25 C3.5 35 9 44 17.5 44 C26 44 29 35.5 28 25.5 C28 24.5 21 24.5 16 24.5 C9.5 24.5 4.8 24.5 4.5 25 Z"
              fill="url(#scoopBodyGrad)"
              stroke="#151513"
              strokeWidth="1"
            />

            {/* Inner Scoop Wall Shadow & Specular Curvature */}
            <path
              d="M6.5 26.5 C5.8 34 10 41.5 17.5 41.5 C24.5 41.5 26.8 34.5 26 26.5"
              stroke="#52514A"
              strokeWidth="0.8"
              fill="none"
            />

            {/* Thickened Industrial Scoop Rim Collar */}
            <path
              d="M4.2 25 C9 27.5 22.5 27.5 28.2 25"
              stroke="url(#oliveRimGrad)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />

            {/* Rim Highlight Reflection Line */}
            <path
              d="M7 26.2 C11 27.5 21 27.5 25.5 26.2"
              stroke="#FFFFFF"
              strokeWidth="0.6"
              strokeLinecap="round"
              opacity="0.75"
            />

            {/* Base Contact Deep Shadow Curve */}
            <path
              d="M10 38.5 C13.5 42 20.5 42 24 38.5"
              stroke="#080807"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          {/* Micro Dust Particles on Hover (Only when closed) */}
          {!isOpen && (
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="absolute top-1 left-2 w-1 h-1 rounded-full bg-[#FFFFFF] animate-ping" />
              <span className="absolute top-3 left-0 w-0.5 h-0.5 rounded-full bg-[#596238] animate-pulse" />
              <span className="absolute -top-1 left-4 w-0.5 h-0.5 rounded-full bg-[#F4F4F1] animate-pulse" />
            </div>
          )}
        </div>
      </button>
    </div>
  );
}
