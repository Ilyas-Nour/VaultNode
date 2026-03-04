/**
 * 🏠 PRIVAFLOW | Home Architecture
 * ---------------------------------------------------------
 * The central entry point of the PrivaFlow ecosystem.
 * Orchestrates high-level sections and structural components.
 * 
 * Performance: Optimized (Modularized sections)
 * Aesthetics: Elite / Dark-Mode / Premium
 */

"use client";

import React from "react";
import { useTranslations } from 'next-intl';
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Dashboard/Hero";
import { Steps } from "@/components/Dashboard/Steps";
import { BentoGrid } from "@/components/Dashboard/BentoGrid";
import { Philosophy } from "@/components/Dashboard/Philosophy";
import AdUnit from "@/components/AdUnit";

/**
 * 🏠 Home Component
 * The main container for the lander experience.
 */
export default function Home() {
  const t = useTranslations('HomePage');

  return (
    <main className="relative min-h-screen bg-zinc-950 text-white selection:bg-emerald-500/30 overflow-x-hidden w-full">
      {/* 🧭 NAVIGATION LAYER */}
      <Navbar />

      {/* 🚀 HERO ASCENSION */}
      <Hero />

      {/* 📣 STRATEGIC AD PLACEMENT (BANNER) */}
      <section className="w-full px-6 lg:px-24 py-12 bg-zinc-950 border-b border-zinc-900/50">
        <AdUnit type="banner-wide" className="mx-auto" />
      </section>

      {/* 🪜 ONBOARDING WORKFLOW */}
      <Steps />

      {/* ⚒️ DYNAMIC TOOL ECOSYSTEM */}
      <section id="magic" className="py-24 lg:py-40 relative w-full">
        <div className="w-full px-6 lg:px-24 space-y-20">
          <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
            <span className="text-xs font-black uppercase tracking-[0.4em] text-emerald-500/50">
              {t('visualProof.label')}
            </span>
            <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
              {t('visualProof.title')}
            </h2>
            <p className="text-zinc-500 font-bold text-lg max-w-2xl">
              {t('visualProof.desc')}
            </p>
          </div>

          <BentoGrid />
        </div>
      </section>

      {/* 🧘 BRAND PHILOSOPHY & WHY */}
      <Philosophy />

      {/* 🧱 FOUNDATIONAL FOOTER */}
      <Footer />
    </main>
  );
}
