"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, User, ShoppingBag, LogOut, ShieldCheck, Package } from "lucide-react";
import SupplementScoop from "./SupplementScoop";
import PowderParticleCanvas from "./PowderParticleCanvas";
import PowderMegaMenu from "./PowderMegaMenu";
import OrderTrackerModal from "./OrderTrackerModal";
import OrderHistoryModal from "./OrderHistoryModal";
import LabReportsModal from "./LabReportsModal";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

interface NavbarProps {
  navbarRef?: React.RefObject<HTMLElement | null>;
}

export default function Navbar({ navbarRef }: NavbarProps) {
  const { user, openAuthModal, logout } = useAuth();
  const { totalCount, toggleCart } = useCart();
  const [isScoopOpen, setIsScoopOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [scoopOrigin, setScoopOrigin] = useState<{ x: number; y: number } | null>(null);
  const scoopButtonRef = useRef<HTMLButtonElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "PROTEIN", href: "#products" },
    { name: "CREATINE", href: "#products" },
    { name: "TRACK ORDER", href: "#track" },
    { name: "ABOUT US", href: "#about" },
    { name: "CONTACT US", href: "#contact" },
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

  const handleNavClick = (e: React.MouseEvent, linkName: string) => {
    if (linkName === "TRACK ORDER") {
      e.preventDefault();
      setIsTrackerOpen(true);
    } else if (linkName === "PROTEIN") {
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

  const handleAccountClick = () => {
    if (user) {
      setIsUserMenuOpen((prev) => !prev);
    } else {
      openAuthModal("signin");
    }
  };

  return (
    <>
      <header
        ref={navbarRef}
        className="relative w-full border-b border-[#151515]/10 bg-[#A8A7A3]/85 backdrop-blur-xs z-50 shrink-0 opacity-0"
      >
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-16 h-22 sm:h-24 lg:h-28 grid grid-cols-3 items-center">
          
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
                <Search className="w-5 h-5 stroke-[1.8]" />
              </button>

              {/* User Account / Auth Trigger */}
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  aria-label="Account"
                  onClick={handleAccountClick}
                  className={`p-2 transition-colors duration-200 focus:outline-hidden hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                    user ? "text-[#596238] font-bold" : "text-[#151515] hover:text-[#596238]"
                  }`}
                >
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      className="w-5 h-5 rounded-full ring-1 ring-[#596238] object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 stroke-[1.8]" />
                  )}
                  {user && (
                    <span className="hidden xl:inline-block text-[11px] font-mono font-semibold max-w-[100px] truncate">
                      {user.displayName || user.email?.split("@")[0]}
                    </span>
                  )}
                </button>

                {/* Logged-In User Dropdown */}
                {user && isUserMenuOpen && (
                  <div className="absolute left-0 top-full mt-2 w-64 bg-[#181917] border border-[#333530] text-[#F4F4F1] shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center gap-3 pb-3 border-b border-[#292a26]">
                      <div className="w-9 h-9 rounded-full bg-[#596238] text-white flex items-center justify-center font-bold text-sm">
                        {user.displayName
                          ? user.displayName.charAt(0).toUpperCase()
                          : user.email?.charAt(0).toUpperCase() || "M"}
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-bold text-white truncate">
                          {user.displayName || "Member Profile"}
                        </div>
                        <div className="text-[10px] font-mono text-[#8c8e88] truncate">
                          {user.email}
                        </div>
                      </div>
                    </div>

                    <div className="py-2 space-y-1">
                      <div className="px-2 py-1.5 text-[10px] font-mono text-[#75804c] flex items-center gap-1.5 uppercase">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>AUTHENTICATED MEMBER</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setIsOrderHistoryOpen(true);
                        }}
                        className="w-full flex items-center gap-2 px-2 py-2 text-xs font-mono text-[#D4D3CD] hover:text-white hover:bg-[#252723] transition-colors cursor-pointer uppercase tracking-wider"
                      >
                        <Package className="w-3.5 h-3.5 text-[#9DB25E]" />
                        <span>MY ORDERS</span>
                      </button>

                      {user.email?.toLowerCase() === "jaynirala82@gmail.com" && (
                        <Link
                          href="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="w-full flex items-center gap-2 px-2 py-2 text-xs font-mono bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/60 transition-colors uppercase tracking-wider font-bold"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>ADMIN CMS PANEL</span>
                        </Link>
                      )}
                    </div>

                    <div className="pt-2 border-t border-[#292a26]">
                      <button
                        type="button"
                        onClick={async () => {
                          setIsUserMenuOpen(false);
                          await logout();
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-red-950/30 hover:bg-red-900/50 border border-red-800/40 text-red-300 hover:text-red-100 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>LOG OUT</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                aria-label="Cart"
                onClick={toggleCart}
                className="p-2 text-[#151515] hover:text-[#596238] transition-colors duration-200 relative focus:outline-hidden hover:scale-105 active:scale-95 cursor-pointer flex items-center"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
                {totalCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 bg-[#596238] text-white text-[9px] font-mono font-bold rounded-full flex items-center justify-center ring-2 ring-[#A8A7A3] shadow-sm animate-in zoom-in">
                    {totalCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* 2. Center: Brand Logo Centered - Noticeably Bigger */}
          <div className="flex items-center justify-center">
            <Link
              href="/"
              onClick={handleLogoClick}
              className="group flex items-center justify-center gap-2.5 focus:outline-hidden cursor-pointer"
            >
              <div className="relative h-16 sm:h-20 md:h-24 lg:h-26 w-56 sm:w-72 md:w-80 lg:w-96">
                <Image
                  src="/logo stage and steel.png"
                  alt="Stage & Steel Logo"
                  fill
                  priority
                  unoptimized
                  className="object-contain object-center filter drop-shadow-xs transition-transform duration-200 group-hover:scale-105"
                />
              </div>
              <span className="hidden xl:inline-block text-[11px] font-mono tracking-widest text-[#555550] border-l border-[#151515]/20 pl-2 uppercase font-bold group-hover:text-[#151515] transition-colors">
                LAB &reg;
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
                  onClick={(e) => handleNavClick(e, link.name)}
                  className="text-xs font-editorial font-bold tracking-widest text-[#151515] hover:text-[#596238] transition-colors duration-200 uppercase relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#596238] hover:after:w-full after:transition-all after:duration-200 cursor-pointer"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Mobile / Quick Action on far right */}
            <div className="flex sm:hidden items-center space-x-1">
              <button
                type="button"
                aria-label="Account"
                onClick={handleAccountClick}
                className="p-2 text-[#151515] hover:text-[#596238] relative focus:outline-hidden cursor-pointer"
              >
                <User className="w-5 h-5 stroke-[1.8]" />
              </button>

              <button
                type="button"
                aria-label="Cart"
                onClick={toggleCart}
                className="p-2 text-[#151515] hover:text-[#596238] relative focus:outline-hidden cursor-pointer flex items-center"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
                {totalCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-[#596238] text-white text-[9px] font-mono font-bold rounded-full flex items-center justify-center ring-2 ring-[#A8A7A3] shadow-sm">
                    {totalCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Protein & Creatine Powder Cascading Particle Canvas */}
      <PowderParticleCanvas isActive={isScoopOpen} origin={scoopOrigin} />

      {/* Scoop-Triggered Powder Mega Menu Overlay */}
      <PowderMegaMenu isOpen={isScoopOpen} onClose={handleCloseMenu} />

      {/* Delhivery Live Order Tracker Modal */}
      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
      />

      {/* My Orders History Modal */}
      <OrderHistoryModal
        isOpen={isOrderHistoryOpen}
        onClose={() => setIsOrderHistoryOpen(false)}
      />

      {/* Official 3rd-Party HPLC Lab Test Reports Zoom Modal */}
      <LabReportsModal />
    </>
  );
}


