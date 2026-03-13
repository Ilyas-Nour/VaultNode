"use client";

import React, { memo } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { SecurityProof } from '@/components/SecurityProof';

export const Footer = memo(() => {
    const t = useTranslations('HomePage');

    const toolLinks = [
        { label: t('footer.linkRedact'), href: '/tools/redact' },
        { label: t('footer.linkCleanMeta'), href: '/tools/clean-exif' },
        { label: t('footer.linkConverter'), href: '/tools/media-converter' },
        { label: t('footer.linkPdfWord'), href: '/tools/pdf-to-docx' },
        { label: t('footer.linkCompress'), href: '/tools/compress' },
        { label: t('footer.linkEnhancer'), href: '/tools/enhancer' },
        { label: t('footer.linkBgRemover'), href: '/tools/bg-remover' },
        { label: t('footer.linkMerge'), href: '/tools/pdf-merge' },
        { label: t('footer.linkSign'), href: '/tools/sign' },
        { label: t('footer.linkRepair'), href: '/tools/repair' },
        { label: t('footer.linkBlur'), href: '/tools/blur' },
        { label: t('footer.linkHeic'), href: '/tools/heic-to-jpg' },
        { label: t('footer.linkSvg'), href: '/tools/svg-to-png' },
        { label: t('footer.linkUnlock'), href: '/tools/unlock-pdf' },
        { label: t('footer.linkPdfImg'), href: '/tools/pdf-to-img' },
        { label: t('footer.linkSplit'), href: '/tools/pdf-split' },
        { label: t('footer.linkStamp'), href: '/tools/stamp' },
        { label: t('footer.linkNumber'), href: '/tools/number-pages' },
        { label: t('footer.linkOrganize'), href: '/tools/organize-pages' },
    ];

    const quickLinks = [
        { label: t('footer.linkHowItWorks'), href: '/#magic' },
        { label: t('footer.linkPhilosophy'), href: '/#philosophy' },
        { label: t('footer.linkAllTools'), href: '/#magic' },
        { label: t('footer.linkContact'), href: '/contact' },
    ];

    return (
        <footer className="border-t border-white/[0.06] bg-black w-full">

            <div className="w-full border-b border-white/[0.06]">
                <SecurityProof className="py-12 sm:py-20 lg:py-24" />
            </div>

            <div className="w-full px-6 lg:px-10 py-10 sm:py-8 flex items-center justify-center sm:justify-start border-b border-white/[0.06]">
                <Logo size="md" showTagline />
            </div>

            {/* Main grid: brand statement + tool grid */}
            <div className="w-full px-6 lg:px-10 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 border-b border-white/[0.06]">

                {/* Left: mission statement */}
                <div className="flex flex-col justify-between items-center sm:items-start text-center sm:text-left gap-12">
                    <div>
                        <p className="text-3xl sm:text-5xl lg:text-[56px] font-black uppercase tracking-tight leading-[0.9]">
                            <span className="text-white/10">{t('footer.brandStatement')}</span>
                            <br />
                            <span className="text-white">{t('footer.brandHighlight')}</span>
                        </p>
                    </div>

                    {/* Quick links */}
                    <div className="w-full">
                        <span className="text-[9px] font-black uppercase tracking-[0.35em] text-zinc-700 block mb-6">{t('footer.colInfo')}</span>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-x-8 gap-y-3">
                            {quickLinks.map(link => (
                                <Link
                                    key={link.href + link.label}
                                    href={link.href}
                                    className="group flex items-center gap-1.5 text-[11px] font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest"
                                >
                                    {link.label}
                                    <ArrowUpRight className="w-3 h-3 text-zinc-800 group-hover:text-emerald-500 transition-colors" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: all tools grid */}
                <div className="relative">
                    <div className="absolute -top-8 left-0 right-0 h-px bg-white/[0.04] lg:hidden" />
                    <span className="text-[9px] font-black uppercase tracking-[0.35em] text-zinc-700 block mb-6">{t('footer.colTools')} / {t('footer.colMedia')}</span>
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-x-10 gap-y-0">
                        {toolLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="group flex items-center justify-between py-2 border-b border-white/[0.04] hover:border-white/[0.12] transition-colors"
                            >
                                <span className="text-[12px] font-bold text-zinc-600 group-hover:text-zinc-200 transition-colors uppercase tracking-tight">{link.label}</span>
                                <ArrowUpRight className="w-3 h-3 text-zinc-800 group-hover:text-emerald-500 opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="w-full px-6 lg:px-10 py-8 flex flex-col sm:flex-row items-center sm:items-center justify-between gap-6">
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-700 text-center sm:text-left">
                    {t('footer.copyright')}
                </p>
                <div className="flex items-center gap-6">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-800 whitespace-nowrap">{t('footer.footerCredits')}</span>
                </div>
            </div>
        </footer>
    );
});

Footer.displayName = 'Footer';
