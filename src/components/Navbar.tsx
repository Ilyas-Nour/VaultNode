"use client";

import React, { useState, memo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { ChevronDown, Menu, X, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/Logo';

export const Navbar = memo(() => {
    const t = useTranslations('HomePage');
    useLocale();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const close = () => setIsMenuOpen(false);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const categories = [
        {
            id: 'vault',
            title: t('nav.vault'),
            tools: [
                { title: t('launchRedactor'), href: '/tools/redact', desc: t('toolDescriptions.redactor') },
                { title: t('cleanExif'), href: '/tools/clean-exif', desc: t('toolDescriptions.cleanExif') },
                { title: t('password'), href: '/tools/password', desc: t('toolDescriptions.password') },
                { title: t('textEncryptor'), href: '/tools/encrypt', desc: t('toolDescriptions.textEncryptor') },
                { title: t('repair'), href: '/tools/repair', desc: t('toolDescriptions.repair') },
            ]
        },
        {
            id: 'media',
            title: t('nav.media'),
            tools: [
                { title: t('imageCompressor'), href: '/tools/compress', desc: t('toolDescriptions.compress') },
                { title: t('heicToJpg'), href: '/tools/heic-to-jpg', desc: t('toolDescriptions.heic') },
                { title: t('mediaConverter'), href: '/tools/media-converter', desc: t('toolDescriptions.mediaConverter') },
                { title: t('svgToPng'), href: '/tools/svg-to-png', desc: t('toolDescriptions.svgToPng') },
                { title: t('blurTool'), href: '/tools/blur', desc: t('toolDescriptions.blur') },
                { title: t('stamp'), href: '/tools/stamp', desc: t('toolDescriptions.stamp') },
            ]
        },
        {
            id: 'documents',
            title: t('nav.documents'),
            tools: [
                { title: t('pdfMerger'), href: '/tools/pdf-merge', desc: t('toolDescriptions.merger') },
                { title: t('pdfToDocx'), href: '/tools/pdf-to-docx', desc: t('toolDescriptions.pdfToWord') },
                { title: t('unlockPdf'), href: '/tools/unlock-pdf', desc: t('toolDescriptions.unlock') },
                { title: t('pdfToImg'), href: '/tools/pdf-to-img', desc: t('toolDescriptions.pdfToImg') },
                { title: t('pdfSplit'), href: '/tools/pdf-split', desc: t('toolDescriptions.split') },
                { title: t('sign'), href: '/tools/sign', desc: t('toolDescriptions.sign') },
                { title: t('numberPages'), href: '/tools/number-pages', desc: t('toolDescriptions.numberPages') },
                { title: t('organizePages'), href: '/tools/organize-pages', desc: t('toolDescriptions.organizePages') },
                { title: t('textToDocx'), href: '/tools/text-to-word', desc: t('toolDescriptions.textToDocx') },
                { title: t('docxToText'), href: '/tools/word-to-text', desc: t('toolDescriptions.docxToText') },
            ]
        }
    ];

    return (
        <>
            <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.07]" style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)' }}>
                <div className="w-full px-5 lg:px-10 h-14 flex items-center justify-between gap-6">

                    {/* Logo - Left column */}
                    <div className="flex-1 flex justify-start">
                        <Link href="/" className="flex items-center shrink-0 group" onClick={close}>
                            <Logo size="sm" />
                        </Link>
                    </div>

                    {/* Desktop nav - center column */}
                    <div ref={dropdownRef} className="hidden lg:flex items-center gap-1 flex-none justify-center">
                        {categories.map((cat) => (
                            <div key={cat.id} className="relative">
                                <button
                                    onMouseEnter={() => setOpenDropdown(cat.id)}
                                    onMouseLeave={() => setOpenDropdown(null)}
                                    className={`flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.15em] transition-colors rounded-sm ${openDropdown === cat.id ? 'text-white' : 'text-zinc-500 hover:text-zinc-200'}`}
                                >
                                    {cat.title}
                                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${openDropdown === cat.id ? 'rotate-180 text-white' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {openDropdown === cat.id && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 6 }}
                                            transition={{ duration: 0.15 }}
                                            onMouseEnter={() => setOpenDropdown(cat.id)}
                                            onMouseLeave={() => setOpenDropdown(null)}
                                            className="absolute top-[calc(100%+2px)] left-1/2 -translate-x-1/2 w-64 bg-zinc-950 border border-white/[0.08] shadow-2xl shadow-black/80 overflow-hidden"
                                        >
                                            {/* Dropdown header */}
                                            <div className="px-4 py-2.5 border-b border-white/[0.06]">
                                                <span className="text-[9px] font-black uppercase tracking-[0.35em] text-zinc-600">{cat.title}</span>
                                            </div>
                                            {/* Tools list */}
                                            <div className="py-1.5">
                                                {cat.tools.map((tool) => (
                                                    <Link
                                                        key={tool.href}
                                                        href={tool.href}
                                                        onClick={() => setOpenDropdown(null)}
                                                        className="flex items-center justify-between px-4 py-2.5 hover:bg-white/[0.04] transition-colors group/item"
                                                    >
                                                        <span className="text-[12px] font-semibold text-zinc-300 group-hover/item:text-white transition-colors leading-snug">
                                                            {tool.title}
                                                        </span>
                                                        <ArrowRight className="w-3 h-3 text-zinc-700 group-hover/item:text-zinc-400 group-hover/item:translate-x-0.5 transition-all shrink-0" />
                                                    </Link>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}

                        {/* Divider */}
                        <div className="w-px h-4 bg-white/[0.08] mx-2" />

                        <Link href="/contact" className="px-4 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-500 hover:text-zinc-200 transition-colors">
                            {t('nav.contact')}
                        </Link>
                    </div>

                    {/* Right side — privacy badge + mobile menu - Right column */}
                    <div className="flex-1 flex justify-end items-center gap-3 shrink-0">

                        {/* Mobile hamburger */}
                        <button
                            className="lg:hidden flex items-center justify-center w-8 h-8 text-zinc-400 hover:text-white transition-colors"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={isMenuOpen ? 'close' : 'open'}
                                    initial={{ opacity: 0, rotate: -90 }}
                                    animate={{ opacity: 1, rotate: 0 }}
                                    exit={{ opacity: 0, rotate: 90 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                                </motion.div>
                            </AnimatePresence>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile drawer */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
                            onClick={close}
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'tween', duration: 0.22, ease: 'easeOut' }}
                            className="lg:hidden fixed top-0 left-0 bottom-0 z-50 w-[82vw] max-w-xs bg-black border-r border-white/[0.08] flex flex-col overflow-y-auto"
                        >
                            {/* Drawer header */}
                            <div className="flex items-center justify-between px-5 h-14 border-b border-white/[0.06] shrink-0">
                                <Logo size="sm" />
                                <button onClick={close} className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-white transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Tool categories */}
                            <div className="flex-1 py-4 overflow-y-auto">
                                {categories.map((cat, i) => (
                                    <div key={cat.id} className={i > 0 ? 'mt-5' : ''}>
                                        <div className="px-5 mb-2">
                                            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-700">{cat.title}</span>
                                        </div>
                                        {cat.tools.map((tool) => (
                                            <Link
                                                key={tool.href}
                                                href={tool.href}
                                                onClick={close}
                                                className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.04] transition-colors group"
                                            >
                                                <span className="text-[13px] font-semibold text-zinc-300 group-hover:text-white transition-colors">{tool.title}</span>
                                                <ArrowRight className="w-3.5 h-3.5 text-zinc-700 group-hover:text-zinc-400 transition-colors shrink-0" />
                                            </Link>
                                        ))}
                                    </div>
                                ))}
                            </div>

                            {/* Drawer footer */}
                            <div className="border-t border-white/[0.06] px-5 py-4 space-y-0.5 shrink-0">
                                <Link href="/contact" onClick={close} className="flex items-center justify-between py-3 text-[13px] font-semibold text-zinc-500 hover:text-white transition-colors group">
                                    {t('nav.contact')}
                                    <ArrowRight className="w-3.5 h-3.5 text-zinc-700 group-hover:text-zinc-400 transition-colors" />
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
