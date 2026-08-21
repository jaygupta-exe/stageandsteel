"use client";

import React, { useState } from "react";

const WHATSAPP_NUMBER = "919779159169"; // Divesh Mehan
const PREFILLED_MESSAGE = encodeURIComponent(
  "Hi Stage & Steel! 💪 I'd like to know more about your premium supplements."
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${PREFILLED_MESSAGE}`;

export default function WhatsAppWidget() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      id="whatsapp-widget"
      aria-label="Chat on WhatsApp"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-[100] group cursor-pointer"
      style={{ textDecoration: "none" }}
    >
      {/* Pulse Ring */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30 pointer-events-none" />
      <span className="absolute inset-0 rounded-full bg-[#25D366]/20 animate-pulse pointer-events-none scale-125" />

      {/* Main Button */}
      <div
        className={`relative flex items-center gap-2.5 rounded-full shadow-2xl shadow-[#25D366]/30 transition-all duration-300 ${
          isHovered
            ? "bg-[#25D366] pl-4 pr-5 py-3 sm:pl-5 sm:pr-6 sm:py-3.5"
            : "bg-[#25D366] p-3.5 sm:p-4"
        }`}
      >
        {/* WhatsApp Icon */}
        <svg
          viewBox="0 0 32 32"
          fill="white"
          className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 transition-transform duration-300 group-hover:scale-110"
        >
          <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958C9.72 31.054 12.764 32 16.004 32 24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.35 22.606c-.39 1.1-1.932 2.014-3.166 2.28-.846.18-1.95.324-5.668-1.218-4.762-1.974-7.826-6.814-8.064-7.13-.23-.316-1.93-2.572-1.93-4.904s1.222-3.476 1.656-3.952c.434-.476.948-.596 1.264-.596.316 0 .632.002.908.018.292.014.682-.11 1.068.814.39.938 1.336 3.27 1.452 3.508.118.238.196.514.04.83-.158.316-.236.514-.474.79-.238.278-.5.62-.714.832-.238.236-.486.494-.208.968.276.474 1.228 2.028 2.638 3.286 1.81 1.616 3.338 2.118 3.812 2.356.474.238.75.198 1.026-.118.278-.316 1.186-1.382 1.502-1.858.316-.476.632-.396 1.066-.238.434.158 2.764 1.304 3.238 1.542.474.238.79.356.908.554.118.198.118 1.148-.272 2.252z" />
        </svg>

        {/* Expanded Label */}
        <span
          className={`font-mono text-white text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap overflow-hidden transition-all duration-300 ${
            isHovered ? "max-w-40 opacity-100" : "max-w-0 opacity-0"
          }`}
        >
          Chat with us
        </span>
      </div>

      {/* Tooltip (mobile-only tap hint) */}
      <div className="absolute -top-10 right-0 bg-[#1a1b18] text-white text-[10px] font-mono px-3 py-1.5 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-[#333530]">
        💬 Quick Chat on WhatsApp
        <div className="absolute -bottom-1 right-5 w-2 h-2 bg-[#1a1b18] border-r border-b border-[#333530] rotate-45" />
      </div>
    </a>
  );
}
