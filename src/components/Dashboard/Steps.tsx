"use client";

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export const Steps = memo(() => {
    const t = useTranslations('HomePage');
    const steps = [
        { n: "01", title: t('step1Title'), desc: t('step1Desc') },
        { n: "02", title: t('step2Title'), desc: t('step2Desc') },
        { n: "03", title: t('step3Title'), desc: t('step3Desc') },
    ];
    return (
        <section className="border-t border-white/[0.06] w-full">
            <div className="w-full px-5 sm:px-6 lg:px-12 py-16 lg:py-28">

                {/* Header */}
                <div className="mb-12 lg:mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div className="text-center lg:text-left">
                        <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-zinc-400">{t('stepsLabel')}</span>
                        <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-[0.9]">
                            {t('stepsTitle')}
                        </h2>
                    </div>
                    <p className="text-zinc-400 text-[14px] leading-relaxed max-w-sm mx-auto lg:mx-0 lg:text-right text-center">
                        {t('stepsBody')}
                    </p>
                </div>

                {/* Steps — horizontal rule layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.05]">
                    {steps.map((s, i) => (
                        <motion.div
                            key={s.n}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.12, duration: 0.4 }}
                            className="bg-black p-8 lg:p-10 flex flex-col gap-8"
                        >
                            {/* Number */}
                            <span className="text-[52px] font-black text-white/[0.07] tabular-nums leading-none tracking-tighter">
                                {s.n}
                            </span>
                            <div className="space-y-2">
                                <h3 className="text-[15px] font-black uppercase tracking-[0.1em] text-white">
                                    {s.title}
                                </h3>
                                <p className="text-[13px] text-zinc-400 leading-relaxed">
                                    {s.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
});

Steps.displayName = 'Steps';
