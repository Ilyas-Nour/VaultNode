/**
 * 🍱 PRIVAFLOW | Bento Architecture
 * ---------------------------------------------------------
 * A high-performance, responsive grid system for tool navigation.
 * Features ultra-smooth filtering and premium hover states.
 * 
 * Performance: Optimized (Memoized grid & lists)
 * Interaction: Motion-Enhanced / Category-Filtered
 */

"use client";

import React, { useState, useMemo, memo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Eraser,
    ImageMinus,
    KeyRound,
    Zap,
    Images,
    ImagePlus,
    Video,
    FileUp,
    FileStack,
    Unlock,
    Wand2,
    ArrowRight,
    Scissors,
    Eye,
    Lock
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

// --- TYPES & CONFIG ---

interface ToolItem {
    id: string;
    category: 'vault' | 'media' | 'docs';
    title: string;
    desc: string;
    icon: React.ElementType;
    href: string;
    color: string;
}

/**
 * 🍱 BentoGrid Component
 * The central command center for all available services.
 */
export const BentoGrid = memo(() => {
    // ✨ HOOKS & STATE
    const t = useTranslations('HomePage');
    const locale = useLocale();
    const isRTL = locale === 'ar';
    const [activeCategory, setActiveCategory] = useState('all');

    // 📋 TOOL REGISTRY
    const tools = useMemo((): ToolItem[] => [
        // THE VAULT (Security Specialist Tools)
        { id: 'redactor', category: 'vault', title: t('launchRedactor'), desc: t('toolDescriptions.redactor'), icon: Eraser, href: '/tools/redact', color: 'emerald' },
        { id: 'clean-exif', category: 'vault', title: t('cleanExif'), desc: t('toolDescriptions.cleanExif'), icon: ImageMinus, href: '/tools/clean-exif', color: 'emerald' },
        { id: 'password', category: 'vault', title: t('password'), desc: t('toolDescriptions.password'), icon: KeyRound, href: '/tools/password', color: 'emerald' },
        { id: 'encrypt', category: 'vault', title: t('textEncryptor'), desc: t('toolDescriptions.textEncryptor'), icon: Lock, href: '/tools/encrypt', color: 'emerald' },

        // MEDIA LAB (Creative & Compression Assets)
        { id: 'compress', category: 'media', title: t('imageCompressor'), desc: t('toolDescriptions.compress'), icon: Zap, href: '/tools/compress', color: 'sky' },
        { id: 'heic', category: 'media', title: t('heicToJpg'), desc: t('toolDescriptions.heic'), icon: ImagePlus, href: '/tools/heic-to-jpg', color: 'sky' },
        { id: 'media-converter', category: 'media', title: t('mediaConverter'), desc: t('toolDescriptions.mediaConverter'), icon: Video, href: '/tools/media-converter', color: 'sky' },
        { id: 'svg-to-png', category: 'media', title: t('svgToPng'), desc: t('toolDescriptions.svgToPng'), icon: Wand2, href: '/tools/svg-to-png', color: 'sky' },
        { id: 'blur', category: 'media', title: t('blurTool'), desc: t('toolDescriptions.blur'), icon: Eye, href: '/tools/blur', color: 'sky' },

        // DOCUMENT SUITE (Secure PDF Workflow)
        { id: 'merger', category: 'docs', title: t('pdfMerger'), desc: t('toolDescriptions.merger'), icon: FileStack, href: '/tools/pdf-merge', color: 'purple' },
        { id: 'pdf-to-word', category: 'docs', title: t('pdfToDocx'), desc: t('toolDescriptions.pdfToWord'), icon: FileUp, href: '/tools/pdf-to-docx', color: 'purple' },
        { id: 'unlock', category: 'docs', title: t('unlockPdf'), desc: t('toolDescriptions.unlock'), icon: Unlock, href: '/tools/unlock-pdf', color: 'purple' },
        { id: 'pdf-to-img', category: 'docs', title: t('pdfToImg'), desc: t('toolDescriptions.pdfToImg'), icon: Images, href: '/tools/pdf-to-img', color: 'purple' },
        { id: 'split', category: 'docs', title: t('pdfSplit'), desc: t('toolDescriptions.split'), icon: Scissors, href: '/tools/pdf-split', color: 'purple' }
    ], [t]);

    const categories = useMemo(() => [
        { id: 'all', title: 'All Tools', color: 'zinc' },
        { id: 'vault', title: t('categories.vault'), color: 'emerald' },
        { id: 'media', title: t('categories.media'), color: 'sky' },
        { id: 'docs', title: t('categories.docs'), color: 'purple' }
    ], [t]);

    // 🔍 FILTER LOGIC
    const filteredTools = useMemo(() => {
        if (activeCategory === 'all') return tools;
        return tools.filter(tool => tool.category === activeCategory);
    }, [activeCategory, tools]);

    const colorClasses = {
        zinc: 'text-zinc-400 bg-zinc-400/5 hover:bg-zinc-400/10 active:bg-zinc-400/20 border-zinc-800',
        emerald: 'text-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10 active:bg-emerald-500/20 border-emerald-500/20',
        sky: 'text-sky-500 bg-sky-500/5 hover:bg-sky-500/10 active:bg-sky-500/20 border-sky-500/20',
        purple: 'text-purple-500 bg-purple-500/5 hover:bg-purple-500/10 active:bg-purple-500/20 border-purple-500/20'
    };

    return (
        <section id="tools" className="space-y-16">
            {/* 🎚️ CATEGORY FILTERS */}
            <div className="flex flex-wrap items-center justify-center gap-3">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={cn(
                            "px-6 lg:px-10 py-4 lg:py-5 rounded-[1.5rem] text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] transition-all border",
                            activeCategory === cat.id
                                ? "bg-white text-black border-white shadow-[0_10px_30px_rgba(255,255,255,0.2)] scale-105"
                                : "bg-zinc-900/50 text-zinc-500 border-zinc-800 hover:border-zinc-700 hover:text-white"
                        )}
                    >
                        {cat.title}
                    </button>
                ))}
            </div>

            {/* ⚒️ DYNAMIC TOOL GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                    {filteredTools.map((tool, i) => (
                        <motion.div
                            key={tool.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4, delay: i * 0.05 }}
                        >
                            <Link href={tool.href} className="group block h-full">
                                <Card className="h-full bg-zinc-900/30 border border-zinc-900 rounded-[2.5rem] p-8 lg:p-10 flex flex-col transition-all duration-500 hover:bg-zinc-900/50 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/5">
                                    <div className="flex items-start justify-between mb-8">
                                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl border transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 bg-zinc-950 border-zinc-800 text-zinc-400 group-hover:text-emerald-500 group-hover:border-emerald-500/50">
                                            <tool.icon className="w-8 h-8" />
                                        </div>
                                        <div className={cn(
                                            "px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest",
                                            colorClasses[tool.color as keyof typeof colorClasses] || colorClasses.zinc
                                        )}>
                                            {t(`categories.${tool.category}`)}
                                        </div>
                                    </div>

                                    <div className="space-y-6 mb-8">
                                        <h3 className="text-3xl lg:text-4xl font-black uppercase italic tracking-tighter text-white group-hover:text-emerald-500 transition-colors leading-none">
                                            {tool.title}
                                        </h3>
                                        <p className="text-zinc-400 font-bold leading-relaxed text-base">
                                            {tool.desc}
                                        </p>
                                    </div>

                                    <div className="mt-auto pt-8 border-t border-zinc-900/50">
                                        <div className="flex items-center justify-between group-hover:translate-x-2 transition-transform duration-500">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 italic">Open Service</span>
                                            <ArrowRight className={cn("w-5 h-5 text-emerald-500", isRTL && "rotate-180")} />
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </section>
    );
});

BentoGrid.displayName = 'BentoGrid';
