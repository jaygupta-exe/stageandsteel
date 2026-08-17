import React from "react";
import HeroSection from "@/components/Hero";
import ProductCatalog from "@/components/ProductCatalog";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#A8A7A3] text-[#151515] relative selection:bg-[#596238] selection:text-[#F4F4F1] overflow-x-hidden">
      <HeroSection />
      <ProductCatalog />
    </main>
  );
}
