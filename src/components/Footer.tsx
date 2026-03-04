/**
 * 🧱 PRIVAFLOW | Foundational Footer
 * ---------------------------------------------------------
 * The structural anchor for the application.
 * Provides deep-link navigation and security reassurance.
 * 
 * Logic: Hierarchical Link Registration
 * Performance: High (Memoized Registry)
 * Aesthetics: Zero-Weight / Technical-Premium
 */

"use client";

import React, { useMemo, memo } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Sparkles, Shield, Heart, Github, Mail, HelpCircle } from 'lucide-react';

/**
 * 🧱 Footer Component
 * High-fidelity footer with optimized link structures.
 */
export const Footer = memo(() => {
    // ✨ HOOKS
    const t = useTranslations('HomePage');

    /**
     * 📂 Footer Navigation Registry
     * Memoized to prevent hierarchical rebuilds during viewport resizing.
     */
    const sections = useMemo(() => [
        {
            title: t('footer.services'),
            links: [
                { title: t('launchRedactor'), href: '/tools/redact' },
                { title: t('imageCompressor'), href: '/tools/compress' },
                { title: t('pdfMerger'), href: '/tools/pdf-merge' },
                { title: t('password'), href: '/tools/password' },
                { title: t('cleanExif'), href: '/tools/clean-exif' },
                { title: t('unlockPdf'), href: '/tools/unlock-pdf' },
            ]
        },
        {
            title: t('footer.company'),
            links: [
                { title: t('footer.philosophy'), href: '#philosophy' },
                { title: t('footer.whyTitle'), href: '#why' },
                { title: t('footer.privacy'), href: '#' },
                { title: t('footer.terms'), href: '#' },
            ]
        },
        {
            title: t('footer.support'),
            links: [
                { title: t('footer.faq'), href: '#faq' },
                { title: t('footer.contact'), href: '#contact' },
                { title: t('footer.report'), href: '#' },
            ]
        }
    ], [t]);

    return (
        <footer className="bg-zinc-950 border-t border-zinc-900 pt-24 pb-12 w-full">
            <div className="w-full px-6 lg:px-12 xl:px-24">
                {/* 🏗️ MAIN GRID ARCHITECTURE */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-24">
                    {/* 🏷️ BRAND IDENTITY COLUMN */}
                    <div className="space-y-8">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                <Sparkles className="w-6 h-6 text-black fill-black" />
                            </div>
                            <span className="text-xl font-black uppercase italic tracking-tighter text-white">
                                PrivaFlow
                            </span>
                        </Link>
                        <p className="text-zinc-500 text-sm leading-relaxed font-medium max-w-[240px]">
                            {t('footer.whyDesc')}
                        </p>
                        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-zinc-900 border border-zinc-800 w-fit">
                            <Shield className="w-4 h-4 text-emerald-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                                {t('footer.badge')}
                            </span>
                        </div>
                    </div>

                    {/* 🔗 LINK DIRECTORIES */}
                    {sections.map((section) => (
                        <div key={section.title} className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                                {section.title}
                            </h4>
                            <ul className="space-y-4">
                                {section.links.map((link) => (
                                    <li key={link.title}>
                                        <Link
                                            href={link.href}
                                            className="text-sm font-bold text-zinc-500 hover:text-white transition-colors"
                                        >
                                            {link.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* 📜 LEGAL & SOCIAL FOOTLINE */}
                <div className="pt-12 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-8">
                    <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">
                        © 2026 PRIVAFLOW. {t('footer.rights')}
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="#" className="p-2 text-zinc-500 hover:text-white transition-colors">
                            <Github className="w-5 h-5" />
                        </Link>
                        <Link href="#" className="p-2 text-zinc-500 hover:text-white transition-colors">
                            <Mail className="w-5 h-5" />
                        </Link>
                        <Link href="#" className="p-2 text-zinc-500 hover:text-white transition-colors">
                            <HelpCircle className="w-5 h-5" />
                        </Link>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-600 uppercase tracking-widest">
                        {t('footer.builtWith')} <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for privacy
                    </div>
                </div>
            </div>
        </footer>
    );
});

Footer.displayName = 'Footer';
