"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from 'next-intl';
import { Zap } from "lucide-react";
import { BentoGrid } from "@/components/Dashboard/BentoGrid";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

export default function Home() {
  const t = useTranslations('HomePage');
  const locale = useLocale();

  return (
    <main className="relative min-h-screen bg-zinc-950 text-white selection:bg-emerald-500/30 overflow-x-hidden">

      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 start-1/4 w-[1000px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full opacity-50" />
        <div className="absolute bottom-0 end-1/4 w-[500px] h-[500px] bg-emerald-500/5 blur-[100px] rounded-full opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-20 space-y-24">

        {/* Dashboard Header */}
        <header className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-[0.3em] italic"
          >
            <Zap className="w-3 h-3 fill-emerald-500" />
            <span>{t('subtitle')}</span>
          </motion.div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.85]"
              >
                {t('title').split(' ').slice(0, -1).join(' ')}<br />
                <span className="text-emerald-500">{t('title').split(' ').pop()}</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-zinc-500 font-bold text-sm md:text-base max-w-xl leading-relaxed"
              >
                {t('description')}
              </motion.p>
            </div>

            {/* Quick Stats/Status */}
            <div className="flex gap-4">
              <div className="px-6 py-4 bg-zinc-900/50 border border-zinc-900 rounded-3xl flex flex-col gap-1">
                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest leading-none">Global Server Load</span>
                <span className="text-xl font-black text-emerald-500 uppercase italic">0.0% <span className="text-[10px]">(Pure Local)</span></span>
              </div>
            </div>
          </div>
        </header>

        {/* Bento Grid */}
        <section>
          <BentoGrid />
        </section>

        {/* Pro Call to Action */}
        <section className="relative overflow-hidden bg-emerald-500 rounded-[3rem] p-12 lg:p-20 text-center space-y-8 group transition-all hover:scale-[1.01]">
          <div className="absolute inset-0 bg-[url('/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
          <div className="absolute -top-24 -start-24 w-64 h-64 bg-white/20 blur-[100px] rounded-full animate-pulse" />

          <h3 className="text-3xl md:text-5xl font-black text-emerald-950 tracking-tighter uppercase italic leading-none max-w-3xl mx-auto">
            {t('cta.title')}
          </h3>
          <p className="text-emerald-900/70 font-bold uppercase tracking-widest text-xs max-w-lg mx-auto leading-relaxed">
            {t('cta.desc')}
          </p>
          <div className="pt-4">
            <Link href="/tools/redact">
              <Button className="h-16 px-10 bg-emerald-950 hover:bg-black text-white font-black rounded-2xl transition-all hover:scale-105 active:scale-95 text-lg uppercase italic shadow-2xl">
                {t('cta.button')}
              </Button>
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}
