"use client";

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, Wifi } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export const Philosophy = memo(() => {
    const t = useTranslations('HomePage');
    const pillars = [
        { icon: ShieldCheck, title: t('pillar1Title'), desc: t('pillar1Desc') },
        { icon: Cpu, title: t('pillar2Title'), desc: t('pillar2Desc') },
        { icon: Wifi, title: t('pillar3Title'), desc: t('pillar3Desc') },
    ];
    return (
        <section id="philosophy" className="border-t border-white/[0.06] w-full">
            <div className="w-full px-5 sm:px-6 lg:px-12 py-14 lg:py-40">
                {/* Header */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start mb-10 lg:mb-20">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">{t('philosophyLabel')}</span>
                        <h2 className="mt-3 text-4xl lg:text-6xl font-black uppercase tracking-tight leading-[0.9]">
                            {t('philosophyTitle')}
                        </h2>
                    </div>
                    <div className="flex flex-col justify-end gap-6 text-zinc-400 leading-relaxed">
                        <p>{t('philosophyBody1')}</p>
                        <p>{t('philosophyBody2')}</p>
                        <Link
                            href="#tools"
                            className="self-start h-12 px-8 bg-white text-black text-xs font-bold uppercase tracking-widest flex items-center hover:bg-zinc-200 transition-colors mt-4"
                        >
                            {t('philosophyCta')}
                        </Link>
                    </div>
                </div>

                {/* Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.06]">
                    {pillars.map((p, i) => (
                        <motion.div
                            key={p.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-black p-10 space-y-5"
                        >
                            <div className="w-10 h-10 border border-white/10 flex items-center justify-center">
                                <p.icon className="w-4.5 h-4.5 text-white/60" />
                            </div>
                            <h3 className="text-lg font-black uppercase tracking-tight">{p.title}</h3>
                            <p className="text-sm text-zinc-500 leading-relaxed font-normal">{p.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
});

Philosophy.displayName = 'Philosophy';
