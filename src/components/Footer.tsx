"use client";

import React, { memo } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { SecurityProof } from '@/components/SecurityProof';
import { toolsData } from '@/lib/tools-data';
import { cn } from '@/lib/utils';
import { ToolIcon } from '@/components/ToolIcon';

export const Footer = memo(() => {
    const t = useTranslations('HomePage');

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
            tools: toolsData.filter(t => ['pdf-to-word', 'pdf-to-ppt', 'pdf-to-excel', 'pdf-to-img', 'word-to-text', 'image-to-text'].includes(t.id))
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

    const quickLinks = [
        { label: t('footer.linkHowItWorks'), href: '/how-it-works' },
        { label: t('footer.linkPhilosophy'), href: '/philosophy' },
        { label: t('footer.linkFAQ'), href: '/faq' },
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
            <div className="w-full px-6 lg:px-10 py-12 lg:py-16 flex flex-col gap-16 lg:gap-20 border-b border-white/[0.06]">

                {/* Top: mission statement + Quick links */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
                    <div>
                        <p className="text-3xl sm:text-5xl lg:text-[64px] font-black uppercase tracking-tight leading-[0.85] mb-8">
                            <span className="text-white/10">{t('footer.brandStatement')}</span>
                            <br />
                            <span className="text-white">{t('footer.brandHighlight')}</span>
                        </p>
                    </div>

                    <div className="flex flex-col gap-6 items-start lg:items-end">
                        <span className="text-[9px] font-black uppercase tracking-[0.35em] text-zinc-700">{t('footer.colInfo')}</span>
                        <div className="flex flex-wrap justify-start lg:justify-end gap-x-8 gap-y-3">
                            {quickLinks.map(link => (
                                <Link
                                    key={link.href + link.label}
                                    href={link.href}
                                    className="group flex items-center gap-1.5 text-[11px] font-bold text-emerald-500/50 hover:text-emerald-400 transition-colors uppercase tracking-widest"
                                >
                                    {link.label}
                                    <ArrowUpRight className="w-3 h-3 text-emerald-900 group-hover:text-emerald-500 transition-colors" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom: Tool Categorized Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-10">
                    {categories.map((cat) => (
                        <div key={cat.id} className="flex flex-col gap-6">
                            <span className="text-[9px] font-black uppercase tracking-[0.35em] text-zinc-600 border-b border-white/[0.06] pb-3 whitespace-nowrap">
                                {cat.title}
                            </span>
                            <div className="flex flex-col gap-4">
                                {cat.tools.map((tool) => (
                                    <Link
                                        key={tool.href}
                                        href={tool.href}
                                        className="group flex items-center gap-3 py-1 transition-colors"
                                    >
                                        <ToolIcon 
                                            icon={tool.icon}
                                            color={tool.color}
                                            size="sm"
                                            className="opacity-60 group-hover:opacity-100"
                                        />
                                        <span className="text-[12px] font-bold text-zinc-600 group-hover:text-white transition-colors uppercase tracking-tight whitespace-nowrap">
                                            {t(tool.titleKey)}
                                        </span>
                                        <ArrowUpRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 text-zinc-500 transition-all ms-auto" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
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
