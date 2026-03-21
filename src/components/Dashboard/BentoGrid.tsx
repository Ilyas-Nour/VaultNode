"use client";

import React, { useState, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { toolsData } from '@/lib/tools-data';
import { ToolIcon } from '@/components/ToolIcon';


export const BentoGrid = memo(() => {
    const locale = useLocale();
    const t = useTranslations('HomePage');
    const isRTL = locale === 'ar';
    const [active, setActive] = useState('all');

    const categories = [
        { id: 'all', label: t('sectionAllLabel'), count: toolsData.length },
        { id: 'vault', label: t('categories.vault'), count: toolsData.filter(t => t.category === 'vault').length },
        { id: 'media', label: t('categories.media'), count: toolsData.filter(t => t.category === 'media').length },
        { id: 'docs', label: t('categories.docs'), count: toolsData.filter(t => t.category === 'docs').length },
    ];

    const filtered = useMemo(() => {
        if (active === 'all') return toolsData;
        return toolsData.filter(t => t.category === active);
    }, [active]);

    const getSpanClass = (index: number, total: number) => {
        if (index !== total - 1) return "";
        let classes = "";
        // MD (2 columns)
        if (total % 2 === 1) classes += "md:col-span-2 ";
        
        // LG (3 columns)
        if (total % 3 === 1) {
            classes += "lg:col-span-3";
        } else if (total % 3 === 2) {
            classes += "lg:col-span-2";
        } else {
            classes += "lg:col-span-1";
        }
        return classes.trim();
    };

    return (
        <section id="tools" className="space-y-10">

            {/* Filter tabs */}
            <div className="flex flex-nowrap overflow-x-auto pb-4 sm:pb-0 no-scrollbar items-center gap-1.5 -mx-5 px-5 sm:mx-0 sm:px-0 sm:flex-wrap">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActive(cat.id)}
                        className={cn(
                            "h-9 px-4 text-[10px] font-bold uppercase tracking-[0.18em] border transition-all",
                            active === cat.id
                                ? "bg-white text-black border-white"
                                : "bg-transparent text-zinc-600 border-white/[0.08] hover:border-white/25 hover:text-zinc-300"
                        )}
                    >
                        {cat.label}
                        <span className={cn("ms-2 tabular-nums font-normal", active === cat.id ? "text-black/40" : "text-zinc-700")}>
                            {cat.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Tool grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.05]">
                <AnimatePresence mode="popLayout">
                    {filtered.map((tool, i) => (
                        <motion.div
                            key={tool.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2, delay: i * 0.03 }}
                            className={cn("h-full", getSpanClass(i, filtered.length))}
                        >
                            <Link href={tool.href} className="group flex flex-col justify-between bg-black hover:bg-zinc-950/40 transition-all duration-300 p-8 lg:p-10 h-full min-h-[220px] relative overflow-hidden">
                                {/* Hover background effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="relative z-10">
                                    <div className="mb-6">
                                        <ToolIcon icon={tool.icon} color={tool.color} size="md" />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-[17px] font-bold uppercase tracking-tight text-white mb-3 group-hover:text-white transition-colors">
                                        {t(tool.titleKey)}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-[14px] text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors line-clamp-2">
                                        {t(tool.descKey)}
                                    </p>
                                </div>

                                {/* Bottom: Action */}
                                <div className={cn(
                                    "relative z-10 mt-8 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] transition-all",
                                    "text-zinc-700 group-hover:text-white"
                                )}>
                                    <span className="w-0 group-hover:w-4 h-px bg-current transition-all duration-300" />
                                    {t('visualProof.openTool')}
                                    <ArrowRight className={cn("w-3.5 h-3.5 group-hover:translate-x-1 transition-transform", isRTL && "rotate-180 group-hover:-translate-x-1")} />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </section>
    );
});

BentoGrid.displayName = 'BentoGrid';
