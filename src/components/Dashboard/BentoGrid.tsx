"use client";

import React, { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import {
    Lock,
    Eraser,
    Search,
    ImageMinus,
    KeyRound,
    Zap,
    Images,
    ImagePlus,
    Video,
    FileText,
    FileUp,
    FileStack,
    Unlock,
    Wand2,
    ArrowRight,
    Scissors,
    Eye
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';

export function BentoGrid() {
    const t = useTranslations('HomePage');
    const locale = useLocale();
    const isRTL = locale === 'ar';

    const tools = [
        // THE VAULT (Security)
        {
            id: 'redactor',
            category: 'vault',
            title: t('launchRedactor'),
            desc: t('toolDescriptions.redactor'),
            icon: Eraser,
            href: '/tools/redact',
            gradient: 'from-emerald-500/20 to-emerald-500/5',
            border: 'hover:border-emerald-500/50',
            size: 'large' // Spans 2 columns
        },
        {
            id: 'clean-exif',
            category: 'vault',
            title: t('cleanExif'),
            desc: t('toolDescriptions.cleanExif'),
            icon: ImageMinus,
            href: '/tools/clean-exif',
            gradient: 'from-emerald-500/20 to-emerald-500/5',
            border: 'hover:border-emerald-500/50',
            size: 'small'
        },
        {
            id: 'password',
            category: 'vault',
            title: t('password'),
            desc: t('toolDescriptions.password'),
            icon: KeyRound,
            href: '/tools/password',
            gradient: 'from-emerald-500/20 to-emerald-500/5',
            border: 'hover:border-emerald-500/50',
            size: 'small'
        },
        {
            id: 'encrypt',
            category: 'vault',
            title: t('textEncryptor'),
            desc: t('toolDescriptions.textEncryptor'),
            icon: Lock,
            href: '/tools/encrypt',
            gradient: 'from-emerald-500/20 to-emerald-500/5',
            border: 'hover:border-emerald-500/50',
            size: 'small'
        },

        // MEDIA LAB (Image/Video)
        {
            id: 'compress',
            category: 'media',
            title: t('imageCompressor'),
            desc: t('toolDescriptions.compress'),
            icon: Zap,
            href: '/tools/compress',
            gradient: 'from-sky-500/20 to-sky-500/5',
            border: 'hover:border-sky-500/50',
            size: 'medium'
        },
        {
            id: 'heic',
            category: 'media',
            title: t('heicToJpg'),
            desc: t('toolDescriptions.heic'),
            icon: ImagePlus,
            href: '/tools/heic-to-jpg',
            gradient: 'from-sky-500/20 to-sky-500/5',
            border: 'hover:border-sky-500/50',
            size: 'small'
        },
        {
            id: 'media-converter',
            category: 'media',
            title: t('mediaConverter'),
            desc: t('toolDescriptions.mediaConverter'),
            icon: Video,
            href: '/tools/media-converter',
            gradient: 'from-sky-500/20 to-sky-500/5',
            border: 'hover:border-sky-500/50',
            size: 'small'
        },
        {
            id: 'svg-to-png',
            category: 'media',
            title: t('svgToPng'),
            desc: t('toolDescriptions.svgToPng'),
            icon: Wand2,
            href: '/tools/svg-to-png',
            gradient: 'from-sky-500/20 to-sky-500/5',
            border: 'hover:border-sky-500/50',
            size: 'small'
        },
        {
            id: 'blur',
            category: 'media',
            title: t('blurTool'),
            desc: t('toolDescriptions.blur'),
            icon: Eye,
            href: '/tools/blur',
            gradient: 'from-sky-500/20 to-sky-500/5',
            border: 'hover:border-sky-500/50',
            size: 'small'
        },

        // DOCUMENT SUITE (PDF)
        {
            id: 'merger',
            category: 'docs',
            title: t('pdfMerger'),
            desc: t('toolDescriptions.merger'),
            icon: FileStack,
            href: '/tools/pdf-merge',
            gradient: 'from-purple-500/20 to-purple-500/5',
            border: 'hover:border-purple-500/50',
            size: 'large'
        },
        {
            id: 'pdf-to-word',
            category: 'docs',
            title: t('pdfToDocx'),
            desc: t('toolDescriptions.pdfToWord'),
            icon: FileUp,
            href: '/tools/pdf-to-docx',
            gradient: 'from-purple-500/20 to-purple-500/5',
            border: 'hover:border-purple-500/50',
            size: 'medium'
        },
        {
            id: 'unlock',
            category: 'docs',
            title: t('unlockPdf'),
            desc: t('toolDescriptions.unlock'),
            icon: Unlock,
            href: '/tools/unlock-pdf',
            gradient: 'from-purple-500/20 to-purple-500/5',
            border: 'hover:border-purple-500/50',
            size: 'small'
        },
        {
            id: 'pdf-to-img',
            category: 'docs',
            title: t('pdfToImg'),
            desc: t('toolDescriptions.pdfToImg'),
            icon: Images,
            href: '/tools/pdf-to-img',
            gradient: 'from-purple-500/20 to-purple-500/5',
            border: 'hover:border-purple-500/50',
            size: 'small'
        },
        {
            id: 'split',
            category: 'docs',
            title: t('pdfSplit'),
            desc: t('toolDescriptions.split'),
            icon: Scissors,
            href: '/tools/pdf-split',
            gradient: 'from-purple-500/20 to-purple-500/5',
            border: 'hover:border-purple-500/50',
            size: 'small'
        }
    ];

    const categories = [
        { id: 'vault', color: 'bg-emerald-500' },
        { id: 'media', color: 'bg-sky-500' },
        { id: 'docs', color: 'bg-purple-500' }
    ];

    return (
        <div className="space-y-24">
            {categories.map((cat) => (
                <section key={cat.id} id={cat.id} className="space-y-8">
                    <div className="flex items-center gap-4">
                        <div className={cn("w-1 h-8 rounded-full", cat.color)} />
                        <div>
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter">
                                {t(`categories.${cat.id}`)}
                            </h2>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                                {t('toolSubtitle', { category: cat.id })}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[180px]">
                        {tools.filter(t => t.category === cat.id).map((tool, i) => (
                            <motion.div
                                key={tool.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={cn(
                                    "relative group",
                                    tool.size === 'large' ? "md:col-span-2 md:row-span-2" :
                                        tool.size === 'medium' ? "md:col-span-2" : ""
                                )}
                            >
                                <Link href={tool.href} className="block h-full">
                                    <Card className={cn(
                                        "h-full p-8 bg-zinc-900/40 border-zinc-800/50 rounded-[2rem] transition-all duration-500 overflow-hidden flex flex-col justify-between",
                                        tool.border,
                                        "group-hover:translate-y-[-4px] group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                                    )}>
                                        {/* Background Glow */}
                                        <div className={cn(
                                            "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10",
                                            tool.gradient
                                        )} />

                                        <div className="space-y-4">
                                            <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors duration-500">
                                                <tool.icon className="w-6 h-6" />
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-xl font-black uppercase italic tracking-tight leading-none group-hover:text-emerald-400 transition-colors">
                                                    {tool.title}
                                                </h3>
                                                <p className="text-xs text-zinc-500 font-bold leading-relaxed max-w-[200px]">
                                                    {tool.desc}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Before & After Reveal */}
                                        <div className="mt-4 pt-4 border-t border-zinc-900 overflow-hidden group/ba relative">
                                            <div className="flex flex-col gap-2 transition-all duration-500 transform group-hover:-translate-y-[120%]">
                                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-700">
                                                    <span>{t('cta.button')}</span>
                                                    <ArrowRight className="w-3 h-3 text-emerald-500" />
                                                </div>
                                            </div>

                                            <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 space-y-2">
                                                <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-zinc-950/50 border border-zinc-800">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">Before</span>
                                                        <p className="text-[10px] text-zinc-400 font-bold italic line-through opacity-50">{t(`beforeAfter.${tool.id}.before`)}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.2em]">After</span>
                                                        <p className="text-[10px] text-white font-black italic">{t(`beforeAfter.${tool.id}.after`)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}
