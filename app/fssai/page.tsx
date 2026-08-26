import React from "react";
import PolicyPageLayout from "@/components/PolicyPageLayout";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Download, ExternalLink, Award, CheckCircle2, Building, MapPin, FileCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FSSAI License & Certification | Stage & Steel",
  description: "Official Food Safety and Standards Authority of India (FSSAI) License for Stage & Steel (S AND S Nutrition Partners). License No: 10724997000182.",
};

export default function FssaiPage() {
  return (
    <PolicyPageLayout
      title="GOVT. FSSAI LICENSE & CERTIFICATION"
      badge="FOOD SAFETY AND STANDARDS AUTHORITY OF INDIA"
      lastUpdated="2026 // ACTIVE & VALID"
    >
      {/* Overview Banner */}
      <section className="space-y-4">
        <div className="p-4 sm:p-6 bg-[#0E0E0D] border border-[#596238]/40 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono text-[#9DB25E] uppercase tracking-widest font-bold block mb-1">
              CENTRAL REGISTRATION CREDENTIALS
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-black text-white uppercase">
              FSSAI LIC NO. 10724997000182
            </h2>
            <p className="text-xs font-mono text-[#A8A7A3] mt-1">
              Registered Entity: S AND S NUTRITION PARTNERS (STAGE &amp; STEEL LABS)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/fssaijpeg.jpeg"
              download="Stage_and_Steel_FSSAI_Certificate.jpeg"
              className="px-4 py-2.5 bg-[#596238] hover:bg-[#48502B] text-white rounded-lg text-xs font-editorial font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md cursor-pointer shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>DOWNLOAD CERTIFICATE</span>
            </a>
            <a
              href="/fssaijpeg.jpeg"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 bg-[#222220] hover:bg-[#2C2C29] border border-white/10 text-white rounded-lg text-xs font-mono transition-colors shrink-0"
              title="Open Full Resolution"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Certificate Image Showcase */}
      <section className="space-y-4">
        <h3 className="text-base font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-[#9DB25E]" />
          OFFICIAL REGISTRATION CERTIFICATE
        </h3>
        <p className="text-xs text-[#A3A29E]">
          Below is the official certificate issued under the Food Safety and Standards Act, 2006 for manufacturing, storing, and marketing health supplements &amp; dietary nutraceuticals.
        </p>

        <div className="relative w-full rounded-xl overflow-hidden border border-white/15 bg-[#0A0A09] shadow-2xl p-2 sm:p-4 group">
          <div className="relative w-full min-h-[500px] sm:min-h-[700px] flex items-center justify-center">
            <Image
              src="/fssaijpeg.jpeg"
              alt="Official FSSAI License Certificate - Stage and Steel"
              fill
              unoptimized
              className="object-contain filter drop-shadow-xl"
            />
          </div>
          <div className="p-3 bg-[#111110] border-t border-white/10 rounded-b-lg flex items-center justify-between text-xs font-mono text-[#8E8D88]">
            <span className="flex items-center gap-1.5 text-[#9DB25E] font-bold">
              <ShieldCheck className="w-4 h-4" /> 100% AUTHENTIC &amp; ACTIVE
            </span>
            <span>CENTRAL LICENSING AUTHORITY // NEW DELHI</span>
          </div>
        </div>
      </section>

      {/* Key Details Matrix */}
      <section className="space-y-4">
        <h3 className="text-base font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Building className="w-4 h-4 text-[#9DB25E]" />
          REGISTERED PARTICULARS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-[#0E0E0D] border border-white/10 rounded-xl space-y-2">
            <span className="text-[10px] font-mono text-[#8E8D88] uppercase block">
              NAME OF LICENSE HOLDER
            </span>
            <span className="font-sans text-sm font-bold text-white block">
              S AND S NUTRITION PARTNERS
            </span>
            <span className="text-xs text-[#9DB25E] font-mono block">
              Brand: Stage &amp; Steel Labs
            </span>
          </div>

          <div className="p-4 bg-[#0E0E0D] border border-white/10 rounded-xl space-y-2">
            <span className="text-[10px] font-mono text-[#8E8D88] uppercase block">
              REGISTERED PREMISES ADDRESS
            </span>
            <span className="font-sans text-xs text-[#C4C3BE] block leading-relaxed">
              D-74 Shubham Enclave, Paschim Vihar, New Delhi - 110063, India
            </span>
          </div>

          <div className="p-4 bg-[#0E0E0D] border border-white/10 rounded-xl space-y-2">
            <span className="text-[10px] font-mono text-[#8E8D88] uppercase block">
              LICENSE NUMBER
            </span>
            <span className="font-mono text-sm font-bold text-[#9DB25E] block">
              10724997000182
            </span>
            <span className="text-[11px] font-mono text-[#8E8D88] block">
              Category: Food Safety and Standards (Health Supplements / Nutraceuticals)
            </span>
          </div>

          <div className="p-4 bg-[#0E0E0D] border border-white/10 rounded-xl space-y-2">
            <span className="text-[10px] font-mono text-[#8E8D88] uppercase block">
              QUALITY ASSURANCE
            </span>
            <span className="font-sans text-xs text-white block">
              3rd-Party HPLC Lab Verified &amp; Heavy Metals Free
            </span>
            <span className="text-[11px] font-mono text-emerald-400 block">
              Passed 100% Zero Amino-Spiking Standard
            </span>
          </div>
        </div>
      </section>

      {/* Safety & Compliance Guarantees */}
      <section className="space-y-4">
        <h3 className="text-base font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Award className="w-4 h-4 text-[#9DB25E]" />
          QUALITY &amp; SAFETY COMMITMENT
        </h3>
        
        <ul className="space-y-2.5 text-xs text-[#C4C3BE] font-sans">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#9DB25E] shrink-0 mt-0.5" />
            <span><strong>100% Purity &amp; Active Ingredients:</strong> Every batch is manufactured adhering to the highest Good Manufacturing Practice (GMP) protocols.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#9DB25E] shrink-0 mt-0.5" />
            <span><strong>Zero Doping &amp; WADA Compliant:</strong> Free from any banned substances, heavy metal impurities (Lead, Mercury, Cadmium, Arsenic), or undeclared additives.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#9DB25E] shrink-0 mt-0.5" />
            <span><strong>Independent 3rd-Party Analytical Testing:</strong> Every release is verified by independent NABL-accredited HPLC laboratories before pan-India dispatch.</span>
          </li>
        </ul>
      </section>
    </PolicyPageLayout>
  );
}
