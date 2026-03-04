/**
 * 🪜 PRIVAFLOW | 3-Step Architecture
 * ---------------------------------------------------------
 * A high-visibility instructional section.
 * Guides the user through the "Privacy-First" workflow.
 * 
 * Performance: Optimized (Static Memoization)
 * Aesthetics: Kinetic / Skewed Geometries
 */

"use client";

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { MousePointerClick, Sparkles, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * 🪜 Steps Component
 * Sequential instruction engine.
 */
export const Steps = memo(() => {
    const t = useTranslations('HomePage');

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
        <section className="py-24 border-b border-zinc-900 bg-zinc-950/50 w-full">
            <div className="w-full px-6 lg:px-24 space-y-20">

                {/* 🏷️ SECTION HEADER */}
                <div className="text-center space-y-4">
                    <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">
                        {t('howItWorks.title')}
                    </h2>
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">
                        {t('howItWorks.subtitle')}
                    </p>
                </div>

                {/* 🪜 STEP GRID */}
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
                            {/* 🛸 SKEWED ICON HOUSING */}
                            <div className={cn(
                                "w-24 h-24 rounded-3xl border border-zinc-800 bg-zinc-950 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:border-emerald-500/50 shadow-2xl skew-x-[-10deg]",
                                step.bg
                            )}>
                                <step.icon className={cn("w-10 h-10 skew-x-[10deg]", step.color)} />
                            </div>

                            {/* 📜 CONTENT MAPPING */}
                            <div className="space-y-4">
                                <span className="inline-block text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.3em] bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/10">
                                    Step 0{step.id}
                                </span>
                                <h3 className="text-3xl font-black uppercase italic tracking-tight">
                                    {step.title}
                                </h3>
                                <p className="text-zinc-500 text-base font-bold leading-relaxed">
                                    {step.desc}
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
