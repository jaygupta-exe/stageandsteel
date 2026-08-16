"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, User, ShoppingBag } from "lucide-react";
import SupplementScoop from "./SupplementScoop";
import PowderParticleCanvas from "./PowderParticleCanvas";
import PowderMegaMenu from "./PowderMegaMenu";

interface NavbarProps {
  navbarRef?: React.RefObject<HTMLElement | null>;
}

export default function Navbar({ navbarRef }: NavbarProps) {
  const [isScoopOpen, setIsScoopOpen] = useState(false);
  const [scoopOrigin, setScoopOrigin] = useState<{ x: number; y: number } | null>(null);
  const scoopButtonRef = useRef<HTMLButtonElement | null>(null);

  const navLinks = [
    { name: "SHOP", href: "#" },
    { name: "PROTEIN", href: "#" },
    { name: "CREATINE", href: "#" },
    { name: "STACKS", href: "#" },
    { name: "ABOUT US", href: "#" },
    { name: "CONTACT", href: "#" },
  ];

  const handleScoopToggle = () => {
    if (!isScoopOpen && scoopButtonRef.current) {
      const rect = scoopButtonRef.current.getBoundingClientRect();
      setScoopOrigin({
        x: rect.left + rect.width * 0.45,
        y: rect.top + rect.height * 0.8,
      });
    }
    setIsScoopOpen((prev) => !prev);
  };

  const handleCloseMenu = () => {
    setIsScoopOpen(false);
  };

  return (
    <>
      <header
        ref={navbarRef}
        className="relative w-full border-b border-[#151515]/10 bg-[#A8A7A3]/80 backdrop-blur-xs z-50 shrink-0 opacity-0"
      >
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-16 h-16 lg:h-[72px] flex items-center justify-between">
          
          {/* Left: Brand Logo in Left Corner */}
          <div className="flex items-center">
            <Link href="/" className="group flex items-center gap-2 focus:outline-hidden">
              <div className="relative h-10 sm:h-11 md:h-12 w-40 sm:w-48 md:w-56">
                <Image
                  src="/logo stage and steel.png"
                  alt="Stage & Steel Logo"
                  fill
                  priority
                  unoptimized
                  className="object-contain object-left filter drop-shadow-xs transition-transform duration-200 group-hover:scale-105"
                />
              </div>
              <span className="hidden sm:inline-block text-[9px] font-mono tracking-widest text-[#777773] border-l border-[#151515]/20 pl-2 uppercase">
                LABS &reg;
              </span>
            </Link>
          </div>

          {/* Center: Main Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                type="button"
                onClick={() => {
                  if (scoopButtonRef.current) {
                    const rect = scoopButtonRef.current.getBoundingClientRect();
                    setScoopOrigin({
                      x: rect.left + rect.width * 0.45,
                      y: rect.top + rect.height * 0.8,
                    });
                  }
                  setIsScoopOpen(true);
                }}
                className="text-xs font-editorial font-bold tracking-widest text-[#151515] hover:text-[#596238] transition-colors duration-200 uppercase relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#596238] hover:after:w-full after:transition-all after:duration-200 cursor-pointer"
              >
                {link.name}
              </button>
            ))}
          </nav>

          {/* Right: Actions & Scoop Menu Button (Replaced 3-line icon) */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            <button
              type="button"
              aria-label="Search"
              className="p-1 text-[#151515] hover:text-[#596238] transition-colors duration-200 focus:outline-hidden hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Search className="w-4.5 h-4.5 stroke-[1.8]" />
            </button>

            <button
              type="button"
              aria-label="Account"
              className="p-1 text-[#151515] hover:text-[#596238] transition-colors duration-200 focus:outline-hidden hover:scale-105 active:scale-95 cursor-pointer"
            >
              <User className="w-4.5 h-4.5 stroke-[1.8]" />
            </button>

            <button
              type="button"
              aria-label="Cart"
              className="p-1 text-[#151515] hover:text-[#596238] transition-colors duration-200 relative focus:outline-hidden hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-4.5 h-4.5 stroke-[1.8]" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-[#596238] rounded-full ring-2 ring-[#A8A7A3]" />
            </button>

            {/* Supplement Scoop Trigger (Placed on the right replacing the 3-line hamburger menu) */}
            <SupplementScoop
              isOpen={isScoopOpen}
              onToggle={handleScoopToggle}
              scoopRef={scoopButtonRef}
            />
          </div>
        </div>
      </header>

      {/* Protein & Creatine Powder Cascading Particle Canvas */}
      <PowderParticleCanvas isActive={isScoopOpen} origin={scoopOrigin} />

      {/* Scoop-Triggered Powder Mega Menu Overlay */}
      <PowderMegaMenu isOpen={isScoopOpen} onClose={handleCloseMenu} />
    </>
  );
}
