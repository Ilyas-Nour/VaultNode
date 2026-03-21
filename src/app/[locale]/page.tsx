import React from "react";
import { getTranslations } from 'next-intl/server';
import { Hero } from "@/components/Dashboard/Hero";
import { Steps } from "@/components/Dashboard/Steps";
import { BentoGrid } from "@/components/Dashboard/BentoGrid";
import { Philosophy } from "@/components/Dashboard/Philosophy";
import { VisualProof } from "@/components/VisualProof";
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'HomePage' });
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'HomePage' });
  
  return (
    <div className="w-full bg-black text-white">
      <Hero />

      {/* Visual Evidence Showcase */}
      <section id="magic" className="w-full border-b border-white/[0.06] bg-zinc-950/20">
        <div className="w-full px-6 lg:px-12 py-16 lg:py-24">
          <div className="mb-12 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">
              {t('heroProof')}
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[0.9]">
              Visual Evidence.
            </h2>
          </div>
          <div className="max-w-6xl mx-auto">
             <VisualProof toolId="image-to-text" />
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="tools" className="w-full px-6 lg:px-12 py-16 lg:py-24">
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

