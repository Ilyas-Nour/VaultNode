"use client";

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export const Philosophy = memo(() => {
    const t = useTranslations('HomePage');

    const pillars = [
        { n: '01', title: t('pillar1Title'), desc: t('pillar1Desc') },
        { n: '02', title: t('pillar2Title'), desc: t('pillar2Desc') },
        { n: '03', title: t('pillar3Title'), desc: t('pillar3Desc') },
    ];

    return (
        <section id="philosophy" className="border-t border-white/[0.06] w-full">
            <div className="w-full px-5 sm:px-6 lg:px-12 py-16 lg:py-32">

                {/* Header */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-end mb-14 lg:mb-20">
                    <div className="text-center lg:text-start">
                        <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-zinc-400">
                            {t('philosophyLabel')}
                        </span>
                        <h2 className="mt-3 text-4xl sm:text-5xl lg:text-[56px] font-black uppercase tracking-tight leading-[0.88]">
                            {t('philosophyTitle')}
                        </h2>
                    </div>
                    <div className="flex flex-col gap-5 text-zinc-500 text-[14px] leading-relaxed">
                        <p>{t('philosophyBody1')}</p>
                        <p>{t('philosophyBody2')}</p>
                        <Link
                            href="#tools"
                            className="self-center lg:self-start h-11 px-7 bg-white text-black text-[11px] font-bold uppercase tracking-[0.18em] flex items-center hover:bg-zinc-100 transition-colors mt-2"
                        >
                            {t('philosophyCta')}
                        </Link>
                    </div>
                </div>

                {/* Pillars — no icons, just text with numbered heading */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.05]">
                    {pillars.map((p, i) => (
                        <motion.div
                            key={p.n}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.4 }}
                            className="bg-black p-8 lg:p-10 flex flex-col gap-4"
                        >
                            <span className="text-[11px] font-black text-white/20 tabular-nums tracking-[0.15em]">
                                {p.n}
                            </span>
                            <h3 className="text-[15px] font-black uppercase tracking-[0.1em] text-white leading-snug">
                                {p.title}
                            </h3>
                            <p className="text-[13px] text-zinc-400 leading-relaxed">
                                {p.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
});

Philosophy.displayName = 'Philosophy';
