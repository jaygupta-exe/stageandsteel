"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Trophy, Sunrise, ShieldCheck, Award, Flame, Target, Sparkles, Check, ChevronRight, Zap } from "lucide-react";

export default function AboutFounders() {
  const diveshImages = [
    { src: "/founders/divesh/divesh-1.jpg", label: "ELITE PHYSIQUE" },
    { src: "/founders/divesh/divesh-2.jpg", label: "NPC & MUSCLEMANIA" },
    { src: "/founders/divesh/divesh-3.jpg", label: "STAGE PERFORMANCE" },
    { src: "/founders/divesh/divesh-4.jpg", label: "DISCIPLINE & CRAFT" },
  ];

  const ashishImages = [
    { src: "/founders/ashish/ashish-1.jpg", label: "5 AM DISCIPLINE" },
    { src: "/founders/ashish/ashish-2.jpg", label: "MIND & HABIT" },
    { src: "/founders/ashish/ashish-3.jpg", label: "FITNESS & LIFESTYLE" },
    { src: "/founders/ashish/ashish-4.jpg", label: "TEMPLE NUTRITION" },
    { src: "/founders/ashish/ashish-5.jpg", label: "LEAN RESILIENCE" },
    { src: "/founders/ashish/ashish-6.jpg", label: "DAILY EXECUTION" },
  ];

  const [activeDiveshImg, setActiveDiveshImg] = useState(0);
  const [activeAshishImg, setActiveAshishImg] = useState(0);

  return (
    <section id="about" className="relative w-full py-24 sm:py-32 bg-[#0F0F0E] text-[#F4F4F1] overflow-hidden border-t border-white/10">
      
      {/* Ambient Radial Spotlight & Subtle Grid Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(212,248,67,0.07),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Decorative Technical Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-10 flex justify-between max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-16">
        <div className="w-[1px] h-full bg-white/20" />
        <div className="w-[1px] h-full bg-white/20 hidden md:block" />
        <div className="w-[1px] h-full bg-white/20" />
      </div>

      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-16 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-12 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-2.5 h-2.5 bg-[#D4F843] flex items-center justify-center">
                <span className="w-1 h-1 bg-[#121211]" />
              </span>
              <p className="font-mono text-xs sm:text-sm font-bold text-[#D4F843] tracking-widest uppercase">
                HERITAGE &amp; LEADERSHIP // STAGE AND STEEL LABS
              </p>
            </div>

            <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase text-[#F5F5F2] tracking-tight leading-[0.92]">
              ABOUT US <br />
              <span className="text-[#D4F843] relative inline-block">
                MEET THE FOUNDERS
                <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-[#D4F843]" />
              </span>
            </h2>
          </div>

          <div className="flex flex-col gap-3 max-w-lg">
            <p className="text-xs sm:text-sm font-sans text-[#C4C3BE] leading-relaxed font-medium">
              We don’t create products to follow trends—we create products that reflect the uncompromising standards we live by every single day.
            </p>
            <div className="flex items-center gap-4 text-[10px] font-mono text-[#8E8D88] uppercase tracking-wider">
              <span className="flex items-center gap-1.5 font-bold text-[#D4F843]">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% ATHLETE OWNED
              </span>
              <span>•</span>
              <span>DECADE+ FIELD TESTED</span>
            </div>
          </div>
        </div>

        {/* Two Founders Monolithic Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 pt-16">
          
          {/* ========================================================================= */}
          {/* FOUNDER 1: DIVESH MEHAN */}
          {/* ========================================================================= */}
          <div className="relative flex flex-col justify-between bg-[#151514] border border-white/10 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl overflow-hidden group">
            
            {/* Top Accent Edge */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4F843] to-transparent" />

            <div>
              {/* Badge & Role */}
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4F843]/10 border border-[#D4F843]/30 rounded text-[10px] font-mono font-bold tracking-widest text-[#D4F843] uppercase">
                  <Trophy className="w-3.5 h-3.5" />
                  CO-FOUNDER // ELITE ATHLETE
                </span>
                <span className="text-[10px] font-mono text-[#8E8D88] uppercase tracking-widest">
                  16+ YEARS TRAINING
                </span>
              </div>

              {/* Founder Header */}
              <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-[#F5F5F2] tracking-tight mb-2">
                DIVESH MEHAN
              </h3>
              <p className="font-mono text-xs text-[#D4F843] uppercase tracking-wider font-bold mb-6">
                CHAMPION BODYBUILDER &amp; FORMULATION ARCHITECT
              </p>

              {/* Image Frame with Full Non-Cropped Display */}
              <div className="relative w-full h-[400px] sm:h-[480px] rounded-xl overflow-hidden bg-[#0A0A09] border border-white/10 mb-6 group/img shadow-2xl flex items-center justify-center">
                {/* Ambient Blurred Aura Behind */}
                <Image
                  src={diveshImages[activeDiveshImg].src}
                  alt="Divesh Mehan Background Aura"
                  fill
                  unoptimized
                  className="object-cover blur-2xl opacity-30 pointer-events-none select-none scale-110"
                />
                
                {/* Crisp 100% Uncropped Founder Image */}
                <div className="relative w-full h-full p-2 z-10 flex items-center justify-center">
                  <Image
                    src={diveshImages[activeDiveshImg].src}
                    alt="Divesh Mehan - Co-Founder"
                    fill
                    unoptimized
                    className="object-contain object-center transition-transform duration-500 group-hover/img:scale-102 filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]"
                  />
                </div>
                
                {/* Photo Caption Badge */}
                <div className="absolute bottom-3 left-3 z-20 px-3 py-1 bg-[#121211]/90 backdrop-blur-md border border-white/15 rounded text-[9px] font-mono font-bold text-[#F5F5F2] uppercase tracking-widest shadow-lg">
                  {diveshImages[activeDiveshImg].label}
                </div>
              </div>

              {/* Thumbnail Selector Strip */}
              <div className="grid grid-cols-4 gap-2 mb-6">
                {diveshImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveDiveshImg(idx)}
                    className={`relative h-18 sm:h-20 rounded-lg overflow-hidden border-2 bg-[#0D0D0C] transition-all cursor-pointer ${
                      activeDiveshImg === idx
                        ? "border-[#D4F843] scale-102 shadow-lg ring-2 ring-[#D4F843]/20"
                        : "border-white/10 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img.src}
                      alt={img.label}
                      fill
                      unoptimized
                      className="object-contain object-center p-1"
                    />
                  </button>
                ))}
              </div>

              {/* Competitive Championship Accolades Box */}
              <div className="p-4 sm:p-5 bg-[#0D0D0C] border border-white/10 rounded-xl mb-6 shadow-inner">
                <span className="text-[10px] font-mono text-[#D4F843] uppercase tracking-widest block mb-3 font-bold flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" /> COMPETITIVE RECORD // INTERNATIONAL &amp; NATIONAL
                </span>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 bg-white/5 border border-white/5 rounded-lg">
                    <span className="text-xs sm:text-sm font-display font-black text-[#F5F5F2] tracking-wide flex items-center gap-2">
                      🏆 1ST PLACE
                    </span>
                    <span className="font-mono text-xs font-bold text-[#D4F843] uppercase">NPC MIAMI</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-white/5 border border-white/5 rounded-lg">
                    <span className="text-xs sm:text-sm font-display font-black text-[#F5F5F2] tracking-wide flex items-center gap-2">
                      🏆 1ST PLACE
                    </span>
                    <span className="font-mono text-xs font-bold text-[#D4F843] uppercase">MUSCLEMANIA ASIA 2022</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-white/5 border border-white/5 rounded-lg">
                    <span className="text-xs sm:text-sm font-display font-black text-[#F5F5F2] tracking-wide flex items-center gap-2">
                      🏆 1ST PLACE
                    </span>
                    <span className="font-mono text-xs font-bold text-[#D4F843] uppercase">MUSCLEMANIA INDIA 2019</span>
                  </div>
                </div>
              </div>

              {/* Biography & Story */}
              <div className="space-y-4 text-xs sm:text-sm font-sans text-[#C4C3BE] leading-relaxed">
                <p>
                  For <strong className="text-[#F5F5F2] font-semibold">Divesh Mehan</strong>, fitness has never been a hobby—it has been a way of life.
                </p>
                <p>
                  With over <strong className="text-[#D4F843]">16 years of dedicated training</strong>, his journey is built on discipline, sacrifice, and an unrelenting pursuit of excellence. Competing at the highest levels of international bodybuilding, Divesh has proven what the human body can achieve under unyielding discipline.
                </p>
                <p>
                  Years of elite competition taught him one fundamental truth: <em className="text-[#F5F5F2] not-italic font-semibold">success is built on consistency, integrity, and quality.</em> That philosophy now forms the cornerstone of Stage &amp; Steel. Every product is engineered to the exact standards of an athlete who lives the demands of peak output and recovery.
                </p>
              </div>
            </div>

            {/* Quote Footer */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <blockquote className="text-xs sm:text-sm font-editorial italic text-[#F5F5F2] border-l-2 border-[#D4F843] pl-4">
                &ldquo;Greatness is not achieved overnight—it is forged through thousands of disciplined days, both inside and outside the gym.&rdquo;
              </blockquote>
            </div>
          </div>


          {/* ========================================================================= */}
          {/* FOUNDER 2: ASHISH YADAV */}
          {/* ========================================================================= */}
          <div className="relative flex flex-col justify-between bg-[#151514] border border-white/10 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl overflow-hidden group">
            
            {/* Top Accent Edge */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#A8B778] to-transparent" />

            <div>
              {/* Badge & Role */}
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#A8B778]/15 border border-[#A8B778]/30 rounded text-[10px] font-mono font-bold tracking-widest text-[#A8B778] uppercase">
                  <Sunrise className="w-3.5 h-3.5" />
                  CO-FOUNDER // 5 AM CLUB ETHOS
                </span>
                <span className="text-[10px] font-mono text-[#8E8D88] uppercase tracking-widest">
                  10+ YEARS LIFESTYLE
                </span>
              </div>

              {/* Founder Header */}
              <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-[#F5F5F2] tracking-tight mb-2">
                ASHISH YADAV
              </h3>
              <p className="font-mono text-xs text-[#A8B778] uppercase tracking-wider font-bold mb-6">
                DISCIPLINE MENTOR &amp; HOLISTIC HEALTH STRATEGIST
              </p>

              {/* Image Frame with Full Non-Cropped Display */}
              <div className="relative w-full h-[400px] sm:h-[480px] rounded-xl overflow-hidden bg-[#0A0A09] border border-white/10 mb-6 group/img shadow-2xl flex items-center justify-center">
                {/* Ambient Blurred Aura Behind */}
                <Image
                  src={ashishImages[activeAshishImg].src}
                  alt="Ashish Yadav Background Aura"
                  fill
                  unoptimized
                  className="object-cover blur-2xl opacity-30 pointer-events-none select-none scale-110"
                />
                
                {/* Crisp 100% Uncropped Founder Image */}
                <div className="relative w-full h-full p-2 z-10 flex items-center justify-center">
                  <Image
                    src={ashishImages[activeAshishImg].src}
                    alt="Ashish Yadav - Co-Founder"
                    fill
                    unoptimized
                    className="object-contain object-center transition-transform duration-500 group-hover/img:scale-102 filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]"
                  />
                </div>
                
                {/* Photo Caption Badge */}
                <div className="absolute bottom-3 left-3 z-20 px-3 py-1 bg-[#121211]/90 backdrop-blur-md border border-white/15 rounded text-[9px] font-mono font-bold text-[#F5F5F2] uppercase tracking-widest shadow-lg">
                  {ashishImages[activeAshishImg].label}
                </div>
              </div>

              {/* Thumbnail Selector Strip */}
              <div className="grid grid-cols-6 gap-1.5 sm:gap-2 mb-6">
                {ashishImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveAshishImg(idx)}
                    className={`relative h-18 sm:h-20 rounded-lg overflow-hidden border-2 bg-[#0D0D0C] transition-all cursor-pointer ${
                      activeAshishImg === idx
                        ? "border-[#A8B778] scale-102 shadow-lg ring-2 ring-[#A8B778]/20"
                        : "border-white/10 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img.src}
                      alt={img.label}
                      fill
                      unoptimized
                      className="object-contain object-center p-1"
                    />
                  </button>
                ))}
              </div>

              {/* Guiding Principle Callout Box */}
              <div className="p-4 sm:p-5 bg-[#0D0D0C] border border-[#A8B778]/30 rounded-xl mb-6 shadow-inner relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <Flame className="w-16 h-16 text-[#A8B778]" />
                </div>
                <span className="text-[10px] font-mono text-[#A8B778] uppercase tracking-widest block mb-2 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> GUIDING PHILOSOPHY // THE TEMPLE PRINCIPLE
                </span>
                <p className="font-editorial text-sm sm:text-base italic text-[#F5F5F2] font-semibold leading-relaxed">
                  &ldquo;Your body is your temple, and how you nourish it defines how you live, perform, and grow.&rdquo;
                </p>
              </div>

              {/* Biography & Story */}
              <div className="space-y-4 text-xs sm:text-sm font-sans text-[#C4C3BE] leading-relaxed">
                <p>
                  <strong className="text-[#F5F5F2] font-semibold">Ashish Yadav</strong> represents the mindset that true transformation begins long before the world wakes up.
                </p>
                <p>
                  A dedicated follower of the <strong className="text-[#A8B778]">5 AM Club philosophy</strong>, he believes that discipline is the ultimate competitive advantage. For more than a decade, fitness, self-development, and purposeful living have remained at the core of his journey.
                </p>
                <p>
                  Ashish advocates a lifestyle rooted in mindful nutrition, consistent training, and daily habits that forge both physical strength and mental resilience. To him, fitness is about creating the foundational bedrock for a healthier, more powerful, and meaningful life.
                </p>
              </div>
            </div>

            {/* Quote Footer */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <blockquote className="text-xs sm:text-sm font-editorial italic text-[#F5F5F2] border-l-2 border-[#A8B778] pl-4">
                &ldquo;Discipline is not a restriction—it is the catalyst to unlock the highest version of yourself.&rdquo;
              </blockquote>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* OUR VISION & BRAND MANIFESTO */}
        {/* ========================================================================= */}
        <div className="mt-16 sm:mt-24 p-8 sm:p-12 lg:p-16 bg-gradient-to-b from-[#181816] to-[#10100F] border border-[#D4F843]/30 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative overflow-hidden">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4F843]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#D4F843]/10 border border-[#D4F843]/30 rounded-full text-xs font-mono font-bold tracking-widest text-[#D4F843] uppercase mb-6">
              <Zap className="w-3.5 h-3.5 fill-current" />
              THE BRAND COVENANT // OUR VISION
            </div>

            <h3 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black uppercase text-[#F5F5F2] tracking-tight leading-[0.95] mb-6">
              UNITED BY A SHARED PASSION <br />
              <span className="text-[#D4F843]">FOR EXCELLENCE</span>
            </h3>

            <p className="text-sm sm:text-base lg:text-lg font-sans text-[#D4D3CD] leading-relaxed max-w-3xl mx-auto mb-8 font-medium">
              Divesh and Ashish founded Stage &amp; Steel with one uncompromising mission: to create premium supplements built on authenticity, trusted by athletes, and designed for those who demand more from themselves every single day.
            </p>

            <p className="font-editorial text-base sm:text-xl italic text-[#F5F5F2] mb-12">
              &ldquo;We don’t create products to follow trends—we create products that reflect the standards we live by.&rdquo;
            </p>

            {/* 3 Pillars Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-8 border-t border-white/10">
              <div className="p-6 bg-[#0D0D0C] border border-white/10 rounded-xl text-center flex flex-col items-center">
                <span className="w-10 h-10 rounded-full bg-[#D4F843]/15 border border-[#D4F843]/30 text-[#D4F843] flex items-center justify-center font-mono font-bold text-xs mb-3">
                  01
                </span>
                <h4 className="font-display text-lg sm:text-xl font-black uppercase text-[#F5F5F2] mb-1">
                  BUILT ON DISCIPLINE
                </h4>
                <p className="text-xs text-[#8E8D88] font-sans">
                  Forged through daily sacrifice and uncompromising execution.
                </p>
              </div>

              <div className="p-6 bg-[#0D0D0C] border border-white/10 rounded-xl text-center flex flex-col items-center">
                <span className="w-10 h-10 rounded-full bg-[#D4F843]/15 border border-[#D4F843]/30 text-[#D4F843] flex items-center justify-center font-mono font-bold text-xs mb-3">
                  02
                </span>
                <h4 className="font-display text-lg sm:text-xl font-black uppercase text-[#F5F5F2] mb-1">
                  BACKED BY EXPERIENCE
                </h4>
                <p className="text-xs text-[#8E8D88] font-sans">
                  Decades on national and international championship stages.
                </p>
              </div>

              <div className="p-6 bg-[#0D0D0C] border border-white/10 rounded-xl text-center flex flex-col items-center">
                <span className="w-10 h-10 rounded-full bg-[#D4F843]/15 border border-[#D4F843]/30 text-[#D4F843] flex items-center justify-center font-mono font-bold text-xs mb-3">
                  03
                </span>
                <h4 className="font-display text-lg sm:text-xl font-black uppercase text-[#F5F5F2] mb-1">
                  MADE FOR CHAMPIONS
                </h4>
                <p className="text-xs text-[#8E8D88] font-sans">
                  Pure active bio-availability with zero proprietary fillers.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
