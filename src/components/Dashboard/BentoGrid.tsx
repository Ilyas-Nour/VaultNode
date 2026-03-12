"use client";

import React, { useState, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Eraser, ImageMinus, KeyRound, Lock, Zap, ImagePlus,
    Video, FileUp, FileStack, Unlock, Wand2, Images, Scissors, Eye, ArrowRight,
    PenTool, Stamp, Wrench, Hash, LayoutGrid
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface ToolItem {
    id: string;
    category: 'vault' | 'media' | 'docs';
    titleKey: string;
    descKey: string;
    icon: React.ElementType;
    href: string;
}

const tools: ToolItem[] = [
    // VAULT
    { id: 'redactor', category: 'vault', titleKey: 'launchRedactor', descKey: 'toolDescriptions.redactor', icon: Eraser, href: '/tools/redact' },
    { id: 'clean-exif', category: 'vault', titleKey: 'cleanExif', descKey: 'toolDescriptions.cleanExif', icon: ImageMinus, href: '/tools/clean-exif' },
    { id: 'password', category: 'vault', titleKey: 'password', descKey: 'toolDescriptions.password', icon: KeyRound, href: '/tools/password' },
    { id: 'encrypt', category: 'vault', titleKey: 'textEncryptor', descKey: 'toolDescriptions.textEncryptor', icon: Lock, href: '/tools/encrypt' },
    { id: 'repair', category: 'vault', titleKey: 'repair', descKey: 'toolDescriptions.repair', icon: Wrench, href: '/tools/repair' },

    // MEDIA
    { id: 'compress', category: 'media', titleKey: 'imageCompressor', descKey: 'toolDescriptions.compress', icon: Zap, href: '/tools/compress' },
    { id: 'heic', category: 'media', titleKey: 'heicToJpg', descKey: 'toolDescriptions.heic', icon: ImagePlus, href: '/tools/heic-to-jpg' },
    { id: 'media-converter', category: 'media', titleKey: 'mediaConverter', descKey: 'toolDescriptions.mediaConverter', icon: Video, href: '/tools/media-converter' },
    { id: 'svg-to-png', category: 'media', titleKey: 'svgToPng', descKey: 'toolDescriptions.svgToPng', icon: Wand2, href: '/tools/svg-to-png' },
    { id: 'blur', category: 'media', titleKey: 'blurTool', descKey: 'toolDescriptions.blur', icon: Eye, href: '/tools/blur' },
    { id: 'stamp', category: 'media', titleKey: 'stamp', descKey: 'toolDescriptions.stamp', icon: Stamp, href: '/tools/stamp' },

    // DOCS
    { id: 'merger', category: 'docs', titleKey: 'pdfMerger', descKey: 'toolDescriptions.merger', icon: FileStack, href: '/tools/pdf-merge' },
    { id: 'pdf-to-word', category: 'docs', titleKey: 'pdfToDocx', descKey: 'toolDescriptions.pdfToWord', icon: FileUp, href: '/tools/pdf-to-docx' },
    { id: 'unlock', category: 'docs', titleKey: 'unlockPdf', descKey: 'toolDescriptions.unlock', icon: Unlock, href: '/tools/unlock-pdf' },
    { id: 'pdf-to-img', category: 'docs', titleKey: 'pdfToImg', descKey: 'toolDescriptions.pdfToImg', icon: Images, href: '/tools/pdf-to-img' },
    { id: 'split', category: 'docs', titleKey: 'pdfSplit', descKey: 'toolDescriptions.split', icon: Scissors, href: '/tools/pdf-split' },
    { id: 'sign', category: 'docs', titleKey: 'sign', descKey: 'toolDescriptions.sign', icon: PenTool, href: '/tools/sign' },
    { id: 'number-pages', category: 'docs', titleKey: 'numberPages', descKey: 'toolDescriptions.numberPages', icon: Hash, href: '/tools/number-pages' },
    { id: 'organize-pages', category: 'docs', titleKey: 'organizePages', descKey: 'toolDescriptions.organizePages', icon: LayoutGrid, href: '/tools/organize-pages' },
];

export const BentoGrid = memo(() => {
    const locale = useLocale();
    const t = useTranslations('HomePage');
    const isRTL = locale === 'ar';
    const [active, setActive] = useState('all');

    const categories = [
        { id: 'all', label: t('sectionAllLabel'), count: tools.length },
        { id: 'vault', label: t('categories.vault'), count: tools.filter(t => t.category === 'vault').length },
        { id: 'media', label: t('categories.media'), count: tools.filter(t => t.category === 'media').length },
        { id: 'docs', label: t('categories.docs'), count: tools.filter(t => t.category === 'docs').length },
    ];

    const filtered = useMemo(() => {
        if (active === 'all') return tools;
        return tools.filter(t => t.category === active);
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
                            <Link href={tool.href} className="group flex flex-col justify-between bg-black hover:bg-zinc-950/80 transition-colors p-7 lg:p-9 h-full min-h-[180px]">

                                {/* Top row: icon + title */}
                                <div className="flex items-start gap-4 mb-5">
                                    <tool.icon className={cn(
                                        "w-5 h-5 shrink-0 mt-0.5 transition-colors",
                                        "text-zinc-700 group-hover:text-zinc-400"
                                    )} />
                                    <h3 className="text-[15px] font-black uppercase tracking-tight text-white leading-snug">
                                        {t(tool.titleKey)}
                                    </h3>
                                </div>

                                {/* Description */}
                                <p className="text-[13px] text-zinc-600 leading-relaxed mb-6 ms-9">
                                    {t(tool.descKey)}
                                </p>

                                {/* Bottom: open link */}
                                <div className={cn(
                                    "ms-9 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] transition-colors",
                                    "text-zinc-800 group-hover:text-zinc-400"
                                )}>
                                    {t('visualProof.openTool')}
                                    <ArrowRight className={cn("w-3 h-3 group-hover:translate-x-0.5 transition-transform", isRTL && "rotate-180")} />
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
