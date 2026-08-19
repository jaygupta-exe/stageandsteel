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
    { name: "PROTEIN", href: "#products" },
    { name: "CREATINE", href: "#products" },
    { name: "ABOUT US", href: "#about" },
    { name: "CONTACT", href: "#about" },
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

  const handleNavClick = (linkName: string) => {
    if (linkName === "PROTEIN") {
      window.dispatchEvent(new CustomEvent("filter-category", { detail: "PROTEIN" }));
    } else if (linkName === "CREATINE") {
      window.dispatchEvent(new CustomEvent("filter-category", { detail: "CREATINE" }));
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setIsScoopOpen(false);
    if (typeof window !== "undefined") {
      if (window.location.pathname === "/" || window.location.pathname === "") {
        if (window.location.hash) {
          window.history.pushState(null, "", "/");
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <header
        ref={navbarRef}
        className="relative w-full border-b border-[#151515]/10 bg-[#A8A7A3]/80 backdrop-blur-xs z-50 shrink-0 opacity-0"
      >
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-16 h-20 sm:h-22 lg:h-24 grid grid-cols-3 items-center">
          
          {/* 1. Left: Scoop Menu Trigger & Action Buttons */}
          <div className="flex items-center space-x-2.5 sm:space-x-4 justify-start">
            {/* Supplement Scoop Trigger */}
            <SupplementScoop
              isOpen={isScoopOpen}
              onToggle={handleScoopToggle}
              scoopRef={scoopButtonRef}
            />

            <div className="hidden sm:flex items-center space-x-2 pl-1 border-l border-[#151515]/15">
              <button
                type="button"
                aria-label="Search"
                className="p-2 text-[#151515] hover:text-[#596238] transition-colors duration-200 focus:outline-hidden hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Search className="w-4.5 h-4.5 stroke-[1.8]" />
              </button>

              <button
                type="button"
                aria-label="Account"
                className="p-2 text-[#151515] hover:text-[#596238] transition-colors duration-200 focus:outline-hidden hover:scale-105 active:scale-95 cursor-pointer"
              >
                <User className="w-4.5 h-4.5 stroke-[1.8]" />
              </button>

              <button
                type="button"
                aria-label="Cart"
                className="p-2 text-[#151515] hover:text-[#596238] transition-colors duration-200 relative focus:outline-hidden hover:scale-105 active:scale-95 cursor-pointer"
              >
                <ShoppingBag className="w-4.5 h-4.5 stroke-[1.8]" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#596238] rounded-full ring-2 ring-[#A8A7A3]" />
              </button>
            </div>
          </div>

          {/* 2. Center: Brand Logo Centered */}
          <div className="flex items-center justify-center">
            <Link
              href="/"
              onClick={handleLogoClick}
              className="group flex items-center justify-center gap-2.5 focus:outline-hidden cursor-pointer"
            >
              <div className="relative h-14 sm:h-16 md:h-18 lg:h-20 w-48 sm:w-60 md:w-72 lg:w-80">
                <Image
                  src="/logo stage and steel.png"
                  alt="Stage & Steel Logo"
                  fill
                  priority
                  unoptimized
                  className="object-contain object-center filter drop-shadow-xs transition-transform duration-200 group-hover:scale-105"
                />
              </div>
              <span className="hidden xl:inline-block text-[10px] font-mono tracking-widest text-[#777773] border-l border-[#151515]/20 pl-2 uppercase font-bold group-hover:text-[#151515] transition-colors">
                LABS &reg;
              </span>
            </Link>
          </div>

          {/* 3. Right: Main Navigation Links & Quick Action */}
          <div className="flex items-center justify-end space-x-6 sm:space-x-8">
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => handleNavClick(link.name)}
                  className="text-xs font-editorial font-bold tracking-widest text-[#151515] hover:text-[#596238] transition-colors duration-200 uppercase relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#596238] hover:after:w-full after:transition-all after:duration-200 cursor-pointer"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Mobile / Quick Action on far right */}
            <div className="flex sm:hidden items-center">
              <button
                type="button"
                aria-label="Cart"
                className="p-2 text-[#151515] hover:text-[#596238] relative focus:outline-hidden cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#596238] rounded-full ring-2 ring-[#A8A7A3]" />
              </button>
            </div>
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
