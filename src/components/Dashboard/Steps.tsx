"use client";

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { MousePointerClick, Cpu, Download } from 'lucide-react';
import { useTranslations } from 'next-intl';

export const Steps = memo(() => {
    const t = useTranslations('HomePage');
    const steps = [
        { n: "01", icon: MousePointerClick, title: t('step1Title'), desc: t('step1Desc') },
        { n: "02", icon: Cpu, title: t('step2Title'), desc: t('step2Desc') },
        { n: "03", icon: Download, title: t('step3Title'), desc: t('step3Desc') },
    ];
    return (
        <section className="border-t border-white/[0.06] w-full">
            <div className="w-full px-5 sm:px-6 lg:px-12 py-12 lg:py-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center mb-10 lg:mb-16">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">{t('stepsLabel')}</span>
                        <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight">
                            {t('stepsTitle')}
                        </h2>
                    </div>
                    <p className="text-zinc-400 text-base leading-relaxed">{t('stepsBody')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.06]">
                    {steps.map((s, i) => (
                        <motion.div
                            key={s.n}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 }}
                            className="bg-black p-7 md:p-10 space-y-5"
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-5xl font-black text-white/10 tabular-nums leading-none">{s.n}</span>
                                <div className="w-9 h-9 border border-white/10 flex items-center justify-center">
                                    <s.icon className="w-4 h-4 text-white/50" />
                                </div>
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tight">{s.title}</h3>
                            <p className="text-sm text-zinc-500 leading-relaxed font-normal">{s.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
});

Steps.displayName = 'Steps';
