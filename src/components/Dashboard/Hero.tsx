"use client";

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export const Hero = memo(() => {
    const t = useTranslations('HomePage');
    return (
        <section className="relative mt-14 sm:mt-16 min-h-[calc(100dvh-3.5rem)] sm:min-h-[calc(100dvh-4rem)] flex flex-col items-center justify-center border-b border-white/[0.06] overflow-hidden w-full">
            <div className="absolute inset-0 bg-grid-canvas opacity-100 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-white/3 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative w-full px-4 sm:px-6 lg:px-12 py-6 -mt-[8vh] flex flex-col items-center text-center gap-5 sm:gap-6">

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2.5 px-4 py-2 border border-white/10 rounded-full text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-400"
                >
                    <Lock className="w-3 h-3 shrink-0" />
                    {t('heroBadge')}
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="font-black leading-[0.87] tracking-tighter uppercase w-full"
                    style={{ fontSize: 'clamp(2.5rem, 12vw, 160px)' }}
                >
                    <span className="text-white block">{t('titlePart1')}</span>
                    <span className="text-white/30 block">{t('titlePart2')}</span>
                    <span className="text-white block">{t('titlePart3')}</span>
                </motion.h1>

                {/* Subline */}
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                    className="max-w-2xl text-zinc-400 text-lg md:text-xl leading-relaxed font-normal"
                >
                    {t('subtitle')}
                </motion.p>

                {/* CTA row */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto"
                >
                    <Link
                        href="#tools"
                        className="group h-12 sm:h-14 px-8 sm:px-10 bg-white hover:bg-zinc-100 text-black font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95"
                    >
                        {t('heroExplore')}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="#magic"
                        className="h-12 sm:h-14 px-8 sm:px-10 border border-white/10 text-white/50 hover:text-white hover:border-white/30 font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all"
                    >
                        {t('heroProof')}
                    </Link>
                </motion.div>

                {/* Stat strip */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 pt-4 border-t border-white/[0.06] w-full max-w-3xl"
                >
                    {[
                        { n: t('heroStatValue1'), label: t('heroStatTools') },
                        { n: t('heroStatValue2'), label: t('heroStatUploaded') },
                        { n: t('heroStatValue3'), label: t('heroStatLanguages') },
                        { n: t('heroStatValue4'), label: t('heroStatClient') },
                    ].map(s => (
                        <div key={s.label} className="flex flex-col items-center gap-1">
                            <span className="text-xl font-black text-white tracking-tight">{s.n}</span>
                            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">{s.label}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
});

Hero.displayName = 'Hero';
