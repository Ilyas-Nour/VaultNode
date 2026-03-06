"use client";

import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { ChevronDown, Menu, X, ArrowRight } from 'lucide-react';

export const Navbar = memo(() => {
    const t = useTranslations('HomePage');
    useLocale(); // keep locale context active

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const close = () => setIsMenuOpen(false);

    const categories = [
        {
            title: t('nav.vault'),
            tools: [
                { title: t('launchRedactor'), href: '/tools/redact', desc: t('toolDescriptions.redactor') },
                { title: t('cleanExif'), href: '/tools/clean-exif', desc: t('toolDescriptions.cleanExif') },
                { title: t('password'), href: '/tools/password', desc: t('toolDescriptions.password') },
                { title: t('textEncryptor'), href: '/tools/encrypt', desc: t('toolDescriptions.textEncryptor') },
            ]
        },
        {
            title: t('nav.media'),
            tools: [
                { title: t('imageCompressor'), href: '/tools/compress', desc: t('toolDescriptions.compress') },
                { title: t('heicToJpg'), href: '/tools/heic-to-jpg', desc: t('toolDescriptions.heic') },
                { title: t('mediaConverter'), href: '/tools/media-converter', desc: t('toolDescriptions.mediaConverter') },
                { title: t('svgToPng'), href: '/tools/svg-to-png', desc: t('toolDescriptions.svgToPng') },
                { title: t('blurTool'), href: '/tools/blur', desc: t('toolDescriptions.blur') },
            ]
        },
        {
            title: t('nav.documents'),
            tools: [
                { title: t('pdfMerger'), href: '/tools/pdf-merge', desc: t('toolDescriptions.merger') },
                { title: t('pdfToDocx'), href: '/tools/pdf-to-docx', desc: t('toolDescriptions.pdfToWord') },
                { title: t('unlockPdf'), href: '/tools/unlock-pdf', desc: t('toolDescriptions.unlock') },
                { title: t('pdfToImg'), href: '/tools/pdf-to-img', desc: t('toolDescriptions.pdfToImg') },
                { title: t('pdfSplit'), href: '/tools/pdf-split', desc: t('toolDescriptions.split') },
            ]
        }
    ];

    return (
        <>
            <nav className="fixed top-0 inset-x-0 z-50 bg-black/95 backdrop-blur-sm border-b border-white/[0.06]">
                <div className="w-full px-4 sm:px-6 lg:px-12 h-14 sm:h-16 flex items-center justify-between gap-4">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 shrink-0" onClick={close}>
                        <span className="text-sm font-black uppercase tracking-[0.15em] text-white">PrivaFlow</span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden lg:flex items-center gap-8 flex-1">
                        {categories.map((cat) => (
                            <div key={cat.title} className="relative group/cat">
                                <button className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 hover:text-white py-5 flex items-center gap-1.5 transition-colors">
                                    {cat.title}
                                    <ChevronDown className="w-3 h-3 opacity-50" />
                                </button>
                                <div className="absolute top-[100%] left-0 w-60 bg-black border border-white/[0.08] p-4 shadow-2xl shadow-black/50 opacity-0 translate-y-2 pointer-events-none group-hover/cat:opacity-100 group-hover/cat:translate-y-0 group-hover/cat:pointer-events-auto transition-all duration-200 space-y-1">
                                    {cat.tools.map((tool) => (
                                        <Link
                                            key={tool.title}
                                            href={tool.href}
                                            className="flex flex-col px-3 py-2.5 hover:bg-white/5 transition-colors"
                                        >
                                            <span className="text-[12px] font-semibold text-white">{tool.title}</span>
                                            <span className="text-[10px] text-zinc-600 mt-0.5">{tool.desc}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <Link href="#philosophy" className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
                            {t('nav.philosophy')}
                        </Link>
                        <Link href="/contact" className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
                            {t('nav.contact')}
                        </Link>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        <button
                            className="lg:hidden text-white p-1.5 -mr-1"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Full-screen mobile drawer */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                            onClick={close}
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'tween', duration: 0.25 }}
                            className="lg:hidden fixed top-0 left-0 bottom-0 z-50 w-[85vw] max-w-sm bg-black border-r border-white/[0.08] flex flex-col overflow-y-auto"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-5 h-14 border-b border-white/[0.06] shrink-0">
                                <span className="text-sm font-black uppercase tracking-[0.15em] text-white">PrivaFlow</span>
                                <button onClick={close} className="text-zinc-500 hover:text-white p-1 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Tool sections */}
                            <div className="flex-1 px-5 py-4 space-y-6">
                                {categories.map((cat) => (
                                    <div key={cat.title}>
                                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 block mb-3">{cat.title}</span>
                                        <div className="space-y-0.5">
                                            {cat.tools.map((tool) => (
                                                <Link
                                                    key={tool.title}
                                                    href={tool.href}
                                                    onClick={close}
                                                    className="flex items-center justify-between px-3 py-3 hover:bg-white/5 transition-colors group"
                                                >
                                                    <div>
                                                        <p className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">{tool.title}</p>
                                                        <p className="text-[11px] text-zinc-600 mt-0.5">{tool.desc}</p>
                                                    </div>
                                                    <ArrowRight className="w-3.5 h-3.5 text-zinc-700 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer links */}
                            <div className="border-t border-white/[0.06] px-5 py-5 space-y-1 shrink-0">
                                <Link href="#philosophy" onClick={close} className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
                                    {t('nav.philosophy')}
                                </Link>
                                <Link href="/contact" onClick={close} className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
                                    {t('nav.contact')}
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
});

Navbar.displayName = 'Navbar';
