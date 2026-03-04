"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from 'next-intl';
import {
  Zap,
  MousePointerClick,
  Sparkles,
  Download,
  Lock,
  Eye,
  ChevronDown,
  Shield
} from "lucide-react";
import { BentoGrid } from "@/components/Dashboard/BentoGrid";
import { PrivacyShieldDiagram } from "@/components/PrivacyShieldDiagram";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import AdUnit from "@/components/AdUnit";

export default function Home() {
  const t = useTranslations('HomePage');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const steps = [
    {
      id: 1,
      title: t('howItWorks.step1.title'),
      desc: t('howItWorks.step1.desc'),
      icon: MousePointerClick,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10'
    },
    {
      id: 2,
      title: t('howItWorks.step2.title'),
      desc: t('howItWorks.step2.desc'),
      icon: Sparkles,
      color: 'text-sky-500',
      bg: 'bg-sky-500/10'
    },
    {
      id: 3,
      title: t('howItWorks.step3.title'),
      desc: t('howItWorks.step3.desc'),
      icon: Download,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    }
  ];

  return (
    <main className="relative min-h-screen bg-zinc-950 text-white selection:bg-emerald-500/30 overflow-x-hidden">

      {/* Hero Section */}
      <section className="relative py-32 lg:py-56 border-b border-zinc-900 overflow-hidden">
        {/* Ambient Lights */}
        <div className="absolute top-0 inset-x-0 h-[800px] bg-emerald-500/5 blur-[160px] -z-10" />

        <div className="w-full px-6 lg:px-24 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] italic mb-10"
          >
            <Lock className="w-3 h-3" />
            <span>100% Private • 100% Free</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-10 max-w-4xl"
          >
            <div className="space-y-6">
              <h1 className="text-6xl md:text-8xl lg:text-[120px] font-black tracking-tighter uppercase italic leading-[0.8] flex flex-col items-center">
                <span className="opacity-90">{t('titlePart1')}</span>
                <span className="text-emerald-500 bg-gradient-to-r from-emerald-500 to-sky-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]">{t('titlePart2')}</span>
              </h1>

              <p className="text-zinc-500 font-bold text-lg md:text-2xl max-w-2xl mx-auto leading-relaxed">
                <span className="text-emerald-500 opacity-50 font-black">/</span> {t('subtitle')}
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-6"
            >
              <Link href="#tools">
                <button className="h-20 px-12 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-[2rem] transition-all hover:scale-105 active:scale-95 text-xl uppercase italic shadow-[0_20px_60px_rgba(16,185,129,0.3)] group relative overflow-hidden">
                  <span className="relative z-10">{t('cta.button')}</span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </button>
              </Link>
              <Link href="#magic" className="group flex items-center gap-3 text-sm font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
                <div className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center group-hover:border-emerald-500 transition-colors">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                </div>
                {t('visualProof.viewProof')}
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-zinc-800"
        >
          <ChevronDown className="w-8 h-8" />
        </motion.div>
      </section>

      {/* Hero Ad Banner */}
      <section className="w-full px-6 lg:px-24 py-12 bg-zinc-950 border-b border-zinc-900/50">
        <AdUnit type="banner-wide" className="mx-auto" />
      </section>

      {/* 3-Step Story */}
      <section className="py-24 border-b border-zinc-900 bg-zinc-950/50">
        <div className="w-full px-6 lg:px-24 space-y-20">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">{t('howItWorks.title')}</h2>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">{t('howItWorks.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {steps.map((step, i) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 group"
              >
                <div className={cn(
                  "w-24 h-24 rounded-3xl border border-zinc-800 bg-zinc-950 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:border-emerald-500/50 shadow-2xl skew-x-[-10deg]",
                  step.bg
                )}>
                  <step.icon className={cn("w-10 h-10 skew-x-[10deg]", step.color)} />
                </div>
                <div className="space-y-4">
                  <span className="inline-block text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.3em] bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/10">Step 0{step.id}</span>
                  <h3 className="text-3xl font-black uppercase italic tracking-tight">{step.title}</h3>
                  <p className="text-zinc-500 text-base font-bold leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Proof / Tools Section */}
      <section id="magic" className="py-24 lg:py-40 relative">
        <div className="w-full px-6 lg:px-24 space-y-20">
          <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
            <span className="text-xs font-black uppercase tracking-[0.4em] text-emerald-500/50">{t('visualProof.label')}</span>
            <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">{t('visualProof.title')}</h2>
            <p className="text-zinc-500 font-bold text-lg max-w-2xl">
              {t('visualProof.desc')}
            </p>
          </div>

          <BentoGrid />
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="philosophy" className="py-24 lg:py-40 bg-zinc-900/30 border-y border-zinc-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/patterns/carbon-fibre.png')] opacity-5" />
        <div className="w-full px-6 lg:px-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-12 text-center lg:text-left">
            <h2 className="text-5xl lg:text-7xl font-black uppercase italic tracking-tighter leading-none">
              {t('footer.philosophy')}
            </h2>
            <div className="space-y-6 text-zinc-400 font-bold text-lg leading-relaxed max-w-xl lg:mx-0 mx-auto">
              <p>{t('footer.whyDesc')}</p>
            </div>
            <div className="flex justify-center lg:justify-start gap-4">
              {[Shield, Lock, Sparkles].map((Icon, i) => (
                <div key={i} className="w-16 h-16 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-emerald-500">
                  <Icon className="w-8 h-8" />
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 lg:p-12 rounded-[3.5rem] bg-emerald-500/5 border border-emerald-500/20 backdrop-blur-sm space-y-8">
            <div className="space-y-4">
              <h4 className="text-xl font-black uppercase italic tracking-tight text-white">{t('footer.whyTitle')}</h4>
              <p className="text-zinc-500 font-bold leading-relaxed">{t('footer.whyDesc')}</p>
            </div>
            <Link href="#tools" className="block w-full">
              <button className="w-full h-18 bg-emerald-500 text-emerald-950 font-black rounded-2xl uppercase italic text-lg hover:bg-emerald-400 transition-colors">
                {t('cta.button')}
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>

  );
}
