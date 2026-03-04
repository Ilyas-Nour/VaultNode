/**
 * 🧭 PRIVAFLOW | Navigation Architecture
 * ---------------------------------------------------------
 * The main orchestrator for site-wide navigation.
 * Features a high-fidelity mega-menu and mobile-first responsive design.
 * 
 * Performance: Optimized (Memoized categories & components)
 * Aesthetics: Glassmorphism / Premium Minimalist
 */

"use client";

import React, { useState, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import {
    Eraser,
    ImageMinus,
    KeyRound,
    Lock,
    Zap,
    ImagePlus,
    Video,
    Wand2,
    Eye,
    FileStack,
    FileUp,
    Unlock,
    Images,
    Scissors,
    Sparkles,
    ChevronDown,
    Menu,
    X,
    Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * 🧭 Navbar Component
 * High-performance navigation with mega-menu capabilities.
 */
export const Navbar = memo(() => {
    // ✨ HOOKS & LOCAL STATE
    const t = useTranslations('HomePage');
    const locale = useLocale();
    const isRTL = locale === 'ar';
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isToolsOpen, setIsToolsOpen] = useState(false);

    // 📂 CATEGORY REGISTRY (Memoized for peak efficiency)
    const categories = useMemo(() => [
        {
            id: 'vault',
            title: t('categories.vault'),
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20',
            tools: [
                { id: 'redact', title: t('launchRedactor'), icon: Eraser, href: '/tools/redact' },
                { id: 'clean-exif', title: t('cleanExif'), icon: ImageMinus, href: '/tools/clean-exif' },
                { id: 'password', title: t('password'), icon: KeyRound, href: '/tools/password' },
                { id: 'encrypt', title: t('textEncryptor'), icon: Lock, href: '/tools/encrypt' },
            ]
        },
        {
            id: 'media',
            title: t('categories.media'),
            color: 'text-sky-500',
            bg: 'bg-sky-500/10',
            border: 'border-sky-500/20',
            tools: [
                { id: 'compress', title: t('imageCompressor'), icon: Zap, href: '/tools/compress' },
                { id: 'heic', title: t('heicToJpg'), icon: ImagePlus, href: '/tools/heic-to-jpg' },
                { id: 'converter', title: t('mediaConverter'), icon: Video, href: '/tools/media-converter' },
                { id: 'svg', title: t('svgToPng'), icon: Wand2, href: '/tools/svg-to-png' },
                { id: 'blur', title: t('blurTool'), icon: Eye, href: '/tools/blur' },
            ]
        },
        {
            id: 'docs',
            title: t('categories.docs'),
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/20',
            tools: [
                { id: 'merger', title: t('pdfMerger'), icon: FileStack, href: '/tools/pdf-merge' },
                { id: 'word', title: t('pdfToDocx'), icon: FileUp, href: '/tools/pdf-to-docx' },
                { id: 'unlock', title: t('unlockPdf'), icon: Unlock, href: '/tools/unlock-pdf' },
                { id: 'img', title: t('pdfToImg'), icon: Images, href: '/tools/pdf-to-img' },
                { id: 'split', title: t('pdfSplit'), icon: Scissors, href: '/tools/pdf-split' },
            ]
        }
    ], [t]);

    return (
        <nav className="fixed top-0 inset-x-0 z-50 bg-zinc-950/50 backdrop-blur-xl border-b border-zinc-900/50">
            {/* 🌌 MAIN LOGO & DESKTOP LINKS */}
            <div className="w-full px-6 lg:px-24 h-18 flex items-center justify-between">
                {/* 🏷️ BRAND IDENTITY */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] group-hover:scale-110 transition-transform">
                        <Sparkles className="w-6 h-6 text-black fill-black" />
                    </div>
                    <span className="text-xl font-black uppercase italic tracking-tighter text-white">
                        PrivaFlow
                    </span>
                </Link>

                {/* 🛰️ DESKTOP NAVIGATION HUB */}
                <div className="hidden lg:flex items-center gap-8">
                    <div
                        className="relative"
                        onMouseEnter={() => setIsToolsOpen(true)}
                        onMouseLeave={() => setIsToolsOpen(false)}
                    >
                        <button className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors py-8">
                            {t('nav.tools')} <ChevronDown className={cn("w-3 h-3 transition-transform", isToolsOpen && "rotate-180")} />
                        </button>

                        <AnimatePresence>
                            {isToolsOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute top-full left-1/2 -translate-x-1/2 w-[700px] bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-8 shadow-[0_40px_80px_rgba(0,0,0,0.8)] grid grid-cols-3 gap-8"
                                >
                                    {categories.map((cat) => (
                                        <div key={cat.id} className="space-y-4">
                                            <div className="flex items-center gap-2 px-2">
                                                <div className={cn("w-1 h-4 rounded-full bg-current", cat.color)} />
                                                <span className={cn("text-[10px] font-black uppercase tracking-[0.2em]", cat.color)}>
                                                    {cat.title}
                                                </span>
                                            </div>
                                            <div className="space-y-1">
                                                {cat.tools.map((tool) => (
                                                    <Link
                                                        key={tool.id}
                                                        href={tool.href}
                                                        className="flex items-center gap-3 p-3 rounded-2xl hover:bg-zinc-900 transition-colors group/tool"
                                                    >
                                                        <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover/tool:text-white transition-colors">
                                                            <tool.icon className="w-4 h-4" />
                                                        </div>
                                                        <span className="text-sm font-bold text-zinc-400 group-hover/tool:text-white transition-colors">
                                                            {tool.title}
                                                        </span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <Link href="#philosophy" className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
                        {t('nav.philosophy')}
                    </Link>
                    <Link href="#faq" className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
                        {t('nav.faq')}
                    </Link>
                </div>

                {/* 🛡️ SECURITY STATUS BADGE */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <Shield className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">{t('nav.privateBadge')}</span>
                    </div>

                    {/* 📱 MOBILE TOGGLE HUB */}
                    <button
                        className="lg:hidden p-2 text-zinc-400"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* 📱 MOBILE MENU DRILL-DOWN */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-zinc-950 border-t border-zinc-900 px-6 py-8 overflow-hidden"
                    >
                        <div className="space-y-8">
                            {categories.map((cat) => (
                                <div key={cat.id} className="space-y-4">
                                    <span className={cn("text-[10px] font-black uppercase tracking-[0.2em] px-2", cat.color)}>
                                        {cat.title}
                                    </span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {cat.tools.map((tool) => (
                                            <Link
                                                key={tool.id}
                                                href={tool.href}
                                                className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-900"
                                            >
                                                <tool.icon className="w-5 h-5 text-zinc-500" />
                                                <span className="text-sm font-bold text-zinc-300">{tool.title}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
});

Navbar.displayName = 'Navbar';
