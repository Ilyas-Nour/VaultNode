"use client";

import React, { memo } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export const Footer = memo(() => {
    const t = useTranslations('HomePage');

    const columns = [
        {
            heading: t('footer.colTools'),
            links: [
                { label: t('footer.linkRedact'), href: '/tools/redact' },
                { label: t('footer.linkCleanMeta'), href: '/tools/clean-exif' },
                { label: t('footer.linkConverter'), href: '/tools/media-converter' },
                { label: t('footer.linkPdfWord'), href: '/tools/pdf-to-docx' },
                { label: t('footer.linkCompress'), href: '/tools/compress' },
                { label: t('footer.linkMerge'), href: '/tools/pdf-merge' },
            ]
        },
        {
            heading: t('footer.colMedia'),
            links: [
                { label: t('footer.linkBlur'), href: '/tools/blur' },
                { label: t('footer.linkHeic'), href: '/tools/heic-to-jpg' },
                { label: t('footer.linkSvg'), href: '/tools/svg-to-png' },
                { label: t('footer.linkUnlock'), href: '/tools/unlock-pdf' },
                { label: t('footer.linkPdfImg'), href: '/tools/pdf-to-img' },
                { label: t('footer.linkSplit'), href: '/tools/pdf-split' },
            ]
        },
        {
            heading: t('footer.colPrivacy'),
            links: [
                { label: t('footer.linkZeroUpload'), href: '#philosophy' },
                { label: t('footer.linkLocalProtocol'), href: '#philosophy' },
                { label: t('footer.linkEncryption'), href: '#philosophy' },
                { label: t('footer.linkOpenArch'), href: '#philosophy' },
            ]
        },
        {
            heading: t('footer.colInfo'),
            links: [
                { label: t('footer.linkHowItWorks'), href: '/#tools' },
                { label: t('footer.linkPhilosophy'), href: '/#philosophy' },
                { label: t('footer.linkAllTools'), href: '/#magic' },
                { label: t('footer.linkContact'), href: '/contact' },
            ]
        }
    ];

    return (
        <footer className="border-t border-white/[0.06] bg-black w-full">
            <div className="w-full px-4 sm:px-6 lg:px-12 pt-12 sm:pt-16 lg:pt-20 pb-10 sm:pb-12">

                {/* Big brand statement */}
                <div className="mb-10 sm:mb-16 border-b border-white/[0.06] pb-10 sm:pb-16">
                    <p className="text-3xl sm:text-4xl lg:text-7xl font-black uppercase tracking-tight leading-[0.9] text-white/10 max-w-3xl">
                        {t('footer.brandStatement')}
                        <span className="text-white">{t('footer.brandHighlight')}</span>
                    </p>
                </div>

                {/* Sitemap */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
                    {columns.map(col => (
                        <div key={col.heading} className="space-y-5">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                                {col.heading}
                            </h4>
                            <ul className="space-y-2.5">
                                {col.links.map(link => (
                                    <li key={link.href + link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-[13px] text-zinc-500 hover:text-white transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-black uppercase tracking-[0.15em] text-white">PrivaFlow</span>
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-700">v2.0</span>
                    </div>
                    <p className="text-[10px] font-semibold text-zinc-700 uppercase tracking-widest">
                        {t('footer.copyright')}
                    </p>
                </div>
            </div>
        </footer>
    );
});

Footer.displayName = 'Footer';
