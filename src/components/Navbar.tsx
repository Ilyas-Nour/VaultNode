"use client";

import React, { useState, memo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { ChevronDown, Menu, X, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { toolsData } from '@/lib/tools-data';
import { ToolIcon } from '@/components/ToolIcon';

export const Navbar = memo(() => {
    const t = useTranslations('HomePage');
    const locale = useLocale();
    const isRTL = locale === 'ar';

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
            id: 'organize',
            title: t('footer.catOrganize'),
            tools: toolsData.filter(t => ['merger', 'split', 'organize-pages', 'scan-to-pdf'].includes(t.id))
        },
        {
            id: 'optimize',
            title: t('footer.catOptimize'),
            tools: toolsData.filter(t => ['compress', 'repair'].includes(t.id))
        },
        {
            id: 'toPdf',
            title: t('footer.catToPdf'),
            tools: toolsData.filter(t => ['word-to-pdf', 'ppt-to-pdf', 'excel-to-pdf', 'html-to-pdf', 'text-to-word'].includes(t.id))
        },
        {
            id: 'fromPdf',
            title: t('footer.catFromPdf'),
            tools: toolsData.filter(t => ['pdf-to-word', 'pdf-to-ppt', 'pdf-to-excel', 'pdf-to-img', 'word-to-text'].includes(t.id))
        },
        {
            id: 'edit',
            title: t('footer.catEdit'),
            tools: toolsData.filter(t => ['sign', 'stamp', 'number-pages', 'redactor'].includes(t.id))
        },
        {
            id: 'security',
            title: t('footer.catSecurity'),
            tools: toolsData.filter(t => ['unlock', 'password', 'encrypt'].includes(t.id))
        },
        {
            id: 'media',
            title: t('footer.catMedia'),
            tools: toolsData.filter(t => ['clean-exif', 'heic', 'media-converter', 'svg-to-png', 'blur', 'bg-remover', 'enhancer'].includes(t.id))
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
                        <div className="relative group/mega">
                            <button
                                onMouseEnter={() => setOpenDropdown('mega')}
                                onMouseLeave={() => setOpenDropdown(null)}
                                className={`flex items-center gap-2 px-6 py-2 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors rounded-full border ${openDropdown === 'mega' ? 'text-white border-white/20 bg-white/5' : 'text-zinc-400 border-transparent hover:text-zinc-200'}`}
                            >
                                {t('footer.colTools')}
                                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${openDropdown === 'mega' ? 'rotate-180 text-white' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {openDropdown === 'mega' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        onMouseEnter={() => setOpenDropdown('mega')}
                                        onMouseLeave={() => setOpenDropdown(null)}
                                        className="fixed top-[56px] inset-x-5 lg:inset-x-10 bg-zinc-950 border border-white/[0.08] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)] overflow-hidden rounded-2xl"
                                    >
                                        <div className="grid grid-cols-7 p-8 gap-8">
                                            {categories.map((cat) => (
                                                <div key={cat.id} className="flex flex-col gap-4">
                                                    <div className="flex items-center gap-2 pb-2 border-b border-white/[0.04]">
                                                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 whitespace-nowrap">{cat.title}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        {cat.tools.map((tool) => (
                                                            <Link
                                                                key={tool.href}
                                                                href={tool.href}
                                                                onClick={() => setOpenDropdown(null)}
                                                                className="group/item py-2 px-1 rounded-lg hover:bg-white/[0.03] flex items-center gap-3 transition-colors"
                                                            >
                                                                <ToolIcon 
                                                                    icon={tool.icon}
                                                                    color={tool.color}
                                                                    size="sm"
                                                                />
                                                                <span className="text-[11px] font-bold text-zinc-300 group-hover/item:text-white transition-colors uppercase tracking-tight">
                                                                    {t(tool.titleKey)}
                                                                </span>
                                                                <ArrowRight className="w-3 h-3 ms-auto text-zinc-800 opacity-0 group-hover/item:opacity-100 group-hover/item:text-zinc-600 group-hover/item:translate-x-0.5 transition-all shrink-0" />
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {/* Bottom bar */}
                                        <div className="bg-white/[0.02] border-t border-white/[0.04] p-4 flex items-center justify-end">
                                            <Link href="/contact" onClick={() => setOpenDropdown(null)} className="text-[10px] text-zinc-400 hover:text-white transition-colors font-bold uppercase tracking-widest flex items-center gap-2">
                                                Support & Help <ArrowRight className="w-3 h-3" />
                                            </Link>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="w-px h-4 bg-white/[0.08] mx-2" />
                        
                        <Link href="/how-it-works" className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors">
                            {t('footer.linkHowItWorks')}
                        </Link>
                        
                        <Link href="/philosophy" className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors">
                            {t('footer.linkPhilosophy')}
                        </Link>

                        <Link href="/faq" className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors">
                            {t('nav.faq')}
                        </Link>

                        <div className="w-px h-4 bg-white/[0.08] mx-2" />

                        <Link href="/contact" className="px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-200 transition-colors">
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
                                    <div key={cat.id} className={i > 0 ? 'mt-8' : ''}>
                                        <div className="px-6 mb-3 flex items-center gap-2">
                                            <div className="w-1 h-3 bg-zinc-800 rounded-full" />
                                            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-600 font-black">{cat.title}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            {cat.tools.map((tool) => (
                                                <Link
                                                    key={tool.href}
                                                    href={tool.href}
                                                    onClick={close}
                                                    className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.04] transition-colors group active:bg-white/[0.08]"
                                                >
                                                    <ToolIcon 
                                                        icon={tool.icon}
                                                        color={tool.color}
                                                        size="md"
                                                        className="shrink-0"
                                                    />
                                                    <span className="text-[14px] font-bold uppercase tracking-tight text-zinc-300 group-hover:text-white transition-colors">
                                                        {t(tool.titleKey)}
                                                    </span>
                                                    <ArrowRight className={cn("w-4 h-4 ms-auto text-zinc-800 group-hover:text-zinc-500 transition-colors shrink-0", isRTL && "rotate-180")} />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Drawer footer */}
                            <div className="border-t border-white/[0.06] px-5 py-6 space-y-4 shrink-0 bg-white/[0.01]">
                                <Link href="/how-it-works" onClick={close} className="flex items-center justify-between text-[13px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors group">
                                    {t('footer.linkHowItWorks')}
                                    <ArrowRight className="w-4 h-4 text-zinc-800 group-hover:text-zinc-400 transition-colors" />
                                </Link>

                                <Link href="/philosophy" onClick={close} className="flex items-center justify-between text-[13px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors group">
                                    {t('footer.linkPhilosophy')}
                                    <ArrowRight className="w-4 h-4 text-zinc-800 group-hover:text-zinc-400 transition-colors" />
                                </Link>

                                <Link href="/faq" onClick={close} className="flex items-center justify-between text-[13px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors group">
                                    {t('nav.faq')}
                                    <ArrowRight className="w-4 h-4 text-zinc-800 group-hover:text-zinc-400 transition-colors" />
                                </Link>

                                <div className="h-px bg-white/[0.05] w-full" />

                                <Link href="/contact" onClick={close} className="flex items-center justify-between py-2 text-[13px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors group">
                                    {t('nav.contact')}
                                    <ArrowRight className="w-4 h-4 text-zinc-800 group-hover:text-zinc-400 transition-colors" />
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
