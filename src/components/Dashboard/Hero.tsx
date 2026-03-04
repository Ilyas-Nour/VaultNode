/**
 * 🚀 PRIVAFLOW | Hero Architecture
 * ---------------------------------------------------------
 * The high-fidelity entry point for the application.
 * Features kinetic typography and deep-space atmospheric lighting.
 * 
 * Logic: Atmospheric Motion Node
 * Performance: High (Static Memoization)
 * Aesthetics: Ultra-Premium / Kinetic-Italic
 */

"use client";

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Lock, Sparkles, ChevronDown } from 'lucide-react';
import { Link } from '@/i18n/routing';

/**
 * 🚀 Hero Component
 * First-impression generator for PrivaFlow.
 */
export const Hero = memo(() => {
    // ✨ HOOKS
    const t = useTranslations('HomePage');

    return (
        <section className="relative py-32 lg:py-56 border-b border-zinc-900 overflow-hidden w-full">
            {/* 🌌 AMBIENT ATMOSPHERE */}
            <div className="absolute top-0 inset-x-0 h-[800px] bg-emerald-500/5 blur-[160px] -z-10" />

            <div className="w-full px-6 lg:px-24 flex flex-col items-center text-center">

                {/* 🛡️ SECURITY BADGE */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] italic mb-10"
                >
                    <Lock className="w-3 h-3" />
                    <span>100% Private • 100% Free</span>
                </motion.div>

                {/* 🖋️ TYPOGRAPHY ENGINE */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-10 max-w-4xl"
                >
                    <div className="space-y-6">
                        <h1 className="text-6xl md:text-8xl lg:text-[120px] font-black tracking-tighter uppercase italic leading-[0.8] flex flex-col items-center">
                            <span className="opacity-90">{t('titlePart1')}</span>
                            <span className="text-emerald-500 bg-gradient-to-r from-emerald-500 to-sky-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                                {t('titlePart2')}
                            </span>
                        </h1>

                        <p className="text-zinc-500 font-bold text-lg md:text-2xl max-w-2xl mx-auto leading-relaxed">
                            <span className="text-emerald-500 opacity-50 font-black">/</span> {t('subtitle')}
                        </p>
                    </div>

                    {/* 🕹️ CALL-TO-ACTION HUB */}
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

            {/* 🖱️ INDICATOR */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 text-zinc-800"
            >
                <ChevronDown className="w-8 h-8" />
            </motion.div>
        </section>
    );
});

Hero.displayName = 'Hero';
