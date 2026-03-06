"use client";

import React, { memo } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';
import { Logo } from '@/components/Logo';

export const Footer = memo(() => {
    const t = useTranslations('HomePage');

    const toolLinks = [
        { label: t('footer.linkRedact'), href: '/tools/redact' },
        { label: t('footer.linkCleanMeta'), href: '/tools/clean-exif' },
        { label: t('footer.linkConverter'), href: '/tools/media-converter' },
        { label: t('footer.linkPdfWord'), href: '/tools/pdf-to-docx' },
        { label: t('footer.linkCompress'), href: '/tools/compress' },
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

            <div className="w-full px-5 lg:px-10 py-8 flex items-center border-b border-white/[0.06]">
                <Logo size="md" showTagline />
            </div>

            {/* Main grid: brand statement + tool grid */}
            <div className="w-full px-5 lg:px-10 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 border-b border-white/[0.06]">

                {/* Left: mission statement */}
                <div className="flex flex-col justify-between gap-10">
                    <div>
                        <p className="text-4xl sm:text-5xl lg:text-[56px] font-black uppercase tracking-tight leading-[0.88]">
                            <span className="text-white/15">{t('footer.brandStatement')}</span>
                            <br />
                            <span className="text-white">{t('footer.brandHighlight')}</span>
                        </p>
                    </div>

                    {/* Quick links */}
                    <div>
                        <span className="text-[9px] font-black uppercase tracking-[0.35em] text-zinc-700 block mb-4">{t('footer.colInfo')}</span>
                        <div className="flex flex-wrap gap-x-6 gap-y-2">
                            {quickLinks.map(link => (
                                <Link
                                    key={link.href + link.label}
                                    href={link.href}
                                    className="group flex items-center gap-1 text-[12px] font-semibold text-zinc-500 hover:text-white transition-colors"
                                >
                                    {link.label}
                                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: all tools grid */}
                <div>
                    <span className="text-[9px] font-black uppercase tracking-[0.35em] text-zinc-700 block mb-4">{t('footer.colTools')} / {t('footer.colMedia')}</span>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-0">
                        {toolLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="group flex items-center justify-between py-2 border-b border-white/[0.04] hover:border-white/[0.12] transition-colors"
                            >
                                <span className="text-[12px] font-medium text-zinc-600 group-hover:text-zinc-200 transition-colors">{link.label}</span>
                                <ArrowUpRight className="w-3 h-3 text-zinc-800 group-hover:text-zinc-500 opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="w-full px-5 lg:px-10 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-700">
                    {t('footer.copyright')}
                </p>
                <div className="flex items-center gap-6">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-800">{t('footer.footerCredits')}</span>
                </div>
            </div>
        </footer>
    );
});

Footer.displayName = 'Footer';
