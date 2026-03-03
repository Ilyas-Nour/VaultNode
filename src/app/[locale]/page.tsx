"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from 'next-intl';
import {
  Zap,
  MousePointerClick,
  Sparkles,
  Download,
  CheckCircle2,
  Lock,
  Eye,
  ChevronDown
} from "lucide-react";
import { BentoGrid } from "@/components/Dashboard/BentoGrid";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

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
      <section className="relative pt-20 pb-12 lg:pt-32 lg:pb-24 border-b border-zinc-900 bg-grid-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] italic"
          >
            <Lock className="w-3 h-3" />
            <span>100% Private • 100% Free</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase italic leading-[0.8]"
          >
            {t('title').split(' ').slice(0, -1).join(' ')}<br />
            <span className="text-emerald-500">{t('title').split(' ').pop()}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-500 font-bold text-base md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            {t('subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="pt-6"
          >
            <Link href="#tools">
              <Button className="h-20 px-12 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-3xl transition-all hover:scale-105 active:scale-95 text-xl uppercase italic shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                {t('cta.button')}
              </Button>
            </Link>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="pt-12 text-zinc-800"
          >
            <ChevronDown className="w-8 h-8 mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* 3-Step Story */}
      <section className="py-20 lg:py-32 border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-20">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">{t('howItWorks.title')}</h2>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">{t('howItWorks.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">
            {/* Connector Lines (Desktop) */}
            <div className="hidden md:block absolute top-[60px] start-[15%] end-[15%] h-px bg-zinc-900 -z-10" />

            {steps.map((step, i) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="flex flex-col items-center text-center space-y-6 group"
              >
                <div className={cn(
                  "w-32 h-32 rounded-[2.5rem] border border-zinc-800 bg-zinc-950 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:border-zinc-700 shadow-2xl",
                  step.bg
                )}>
                  <step.icon className={cn("w-12 h-12", step.color)} />
                </div>
                <div className="space-y-3 px-4">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-black text-zinc-800 uppercase tracking-[0.3em]">Step 0{step.id}</span>
                    <h3 className="text-2xl font-black uppercase italic tracking-tight">{step.title}</h3>
                  </div>
                  <p className="text-zinc-500 text-sm font-bold leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-20 lg:py-32 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <BentoGrid />
        </div>
      </section>

      {/* Why it's Free (Footer CTA) */}
      <section className="py-20 lg:py-32 bg-emerald-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8 relative z-10">
          <h2 className="text-4xl md:text-6xl font-black text-emerald-950 uppercase italic tracking-tighter leading-none">
            {t('footer.whyTitle')}
          </h2>
          <p className="text-emerald-900/80 font-bold text-lg md:text-xl leading-relaxed">
            {t('footer.whyDesc')}
          </p>
          <div className="pt-4 flex flex-col md:flex-row items-center justify-center gap-4">
            <Button className="h-16 px-10 bg-emerald-950 hover:bg-black text-white font-black rounded-2xl transition-all hover:scale-105 active:scale-95 text-lg uppercase italic shadow-2xl">
              {t('cta.button')}
            </Button>
            <Button variant="outline" className="h-16 px-10 border-emerald-900 text-emerald-900 hover:bg-emerald-900 hover:text-white font-black rounded-2xl transition-all text-lg uppercase italic">
              {t('footer.contact')}
            </Button>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-12 border-t border-zinc-900 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 opacity-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-emerald-950 font-black italic">P</div>
            <span className="text-xl font-black tracking-tighter uppercase italic">PrivaFlow</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group">
            © {new Date().getFullYear()} PrivaFlow • Built for Privacy
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest">
            <Link href="#" className="hover:text-emerald-500 transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-emerald-500 transition-colors">GitHub</Link>
          </div>
        </div>
      </footer>

    </main>
  );
}
