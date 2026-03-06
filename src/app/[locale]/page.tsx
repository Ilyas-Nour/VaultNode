"use client";

import React from "react";
import { useTranslations } from 'next-intl';
import { Hero } from "@/components/Dashboard/Hero";
import { Steps } from "@/components/Dashboard/Steps";
import { BentoGrid } from "@/components/Dashboard/BentoGrid";
import { Philosophy } from "@/components/Dashboard/Philosophy";

export default function Home() {
  const t = useTranslations('HomePage');
  return (
    <div className="w-full bg-black text-white">
      <Hero />

      {/* Services */}
      <section id="magic" className="w-full px-6 lg:px-12 py-16 lg:py-24">
        <div>
          <div className="mb-16 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">
              {t('sectionAllLabel')}
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[0.9]">
              {t('sectionAllTitle')}
            </h2>
          </div>
          <BentoGrid />
        </div>
      </section>

      <Steps />
      <Philosophy />
    </div>
  );
}
