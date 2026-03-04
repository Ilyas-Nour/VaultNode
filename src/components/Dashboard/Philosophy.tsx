/**
 * 🧘 PRIVAFLOW | Philosophy & Why Section
 * ---------------------------------------------------------
 * A content-rich section that communicates the brand's core values.
 * Features a split-layout with mission statement and reason for being.
 * 
 * Performance: Optimized (Static Memoization)
 * Aesthetics: High-Contrast / Glassmorphic Cards
 */

"use client";

import React, { memo } from 'react';
import { useTranslations } from 'next-intl';
import { Shield, Lock, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/routing';

/**
 * 🧘 Philosophy Component
 * Communicates the "Why" and "How" of PrivaFlow.
 */
export const Philosophy = memo(() => {
    const t = useTranslations('HomePage');

    return (
        <section id="philosophy" className="py-24 lg:py-40 bg-zinc-900/30 border-y border-zinc-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/patterns/carbon-fibre.png')] opacity-5" />
            <div className="w-full px-6 lg:px-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

                {/* 📜 MISSION STATEMENT */}
                <div className="space-y-12 text-center lg:text-left">
                    <h2 className="text-5xl lg:text-7xl font-black uppercase italic tracking-tighter leading-none">
                        {t('footer.philosophy')}
                    </h2>
                    <div className="space-y-6 text-zinc-400 font-bold text-lg leading-relaxed max-wxl lg:mx-0 mx-auto">
                        <p>{t('footer.philosophyDesc')}</p>
                    </div>
                    <div className="flex justify-center lg:justify-start gap-4">
                        {[Shield, Lock, Sparkles].map((Icon, i) => (
                            <div key={i} className="w-16 h-16 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-emerald-500 shadow-2xl">
                                <Icon className="w-8 h-8" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* 💎 REASON FOR BEING (WHY IT'S FREE) */}
                <div className="p-8 lg:p-12 rounded-[3.5rem] bg-emerald-500/5 border border-emerald-500/20 backdrop-blur-sm space-y-8 shadow-[0_0_80px_rgba(16,185,129,0.05)]">
                    <div className="space-y-4">
                        <h4 className="text-xl font-black uppercase italic tracking-tight text-white">
                            {t('footer.whyTitle')}
                        </h4>
                        <p className="text-zinc-500 font-bold leading-relaxed">
                            {t('footer.whyDesc')}
                        </p>
                    </div>
                    <Link href="#tools" className="block w-full">
                        <button className="w-full h-18 bg-emerald-500 text-emerald-950 font-black rounded-2xl uppercase italic text-lg hover:bg-emerald-400 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/20">
                            {t('cta.button')}
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
});

Philosophy.displayName = 'Philosophy';
